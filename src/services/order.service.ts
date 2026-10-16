import { OrderStatus, PaymentMethod, PaymentStatus, DispatchState, FitType } from '@prisma/client';
import { prisma, withDbFallback } from '../config/prisma';
import { MOCK_PRODUCTS } from '../data/mockCatalog.data';
import { RazorpayService, RazorpayOrderResult } from './razorpay.service';
import { AppError } from '../utils/errors.util';

export interface CreateOrderCustomerInput {
  fullName: string;
  email: string;
  phone: string;
}

export interface CreateOrderShippingAddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string;
  sku?: string;
  size: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
}

export interface CreateOrderInput {
  customer: CreateOrderCustomerInput;
  shippingAddress: CreateOrderShippingAddressInput;
  items: CreateOrderItemInput[];
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

// In-memory fallback order store for offline testing and fast tests
export const IN_MEMORY_ORDERS: Map<string, any> = new Map();

export class OrderService {
  static async createOrder(input: CreateOrderInput): Promise<{ order: any; razorpayOrder?: RazorpayOrderResult }> {
    if (!input.items || input.items.length === 0) {
      throw AppError.badRequest('Order must contain at least one item');
    }

    // 1. Authoritative Price Resolution
    const resolvedItems: any[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      let product: any = null;
      try {
        product = await withDbFallback<any>(
          () => prisma.product.findFirst({
            where: { OR: [{ id: item.productId }, { slug: item.productId }] },
            include: { variants: true, images: true },
          }),
          () => MOCK_PRODUCTS.find(
            (p) => p.id === item.productId || p.slug === item.productId || p.displayId.toString() === item.productId
          )
        );
      } catch {
        product = MOCK_PRODUCTS.find(
          (p) => p.id === item.productId || p.slug === item.productId || p.displayId.toString() === item.productId
        );
      }

      if (!product) {
        throw AppError.badRequest(`Product with ID "${item.productId}" does not exist in catalog`);
      }

      const unitPrice = product.sellingPrice || product.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      resolvedItems.push({
        productId: product.id,
        productTitle: product.title || product.name,
        fitType: (product.fitType || (product.fit?.includes('Oversized') ? 'OVERSIZED_FIT' : 'REGULAR_FIT')) as FitType,
        colorName: item.colorName || product.colorways?.[0]?.name || 'Standard',
        colorHex: item.colorHex || product.colors?.[0] || '#1C1C1C',
        size: item.size,
        sku: item.sku || `FIT-${(product.slug || 'TEE').toUpperCase().slice(0, 4)}-${item.size}`,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        thumbnail: product.image || product.images?.[0]?.url || `/images/products/${product.slug}.jpg`,
      });
    }

    // 2. Calculations
    let discountAmount = 0;
    if (input.couponCode && input.couponCode.toUpperCase() === 'HERITAGE25') {
      discountAmount = Math.round(subtotal * 0.25);
    }

    const shippingFee = subtotal >= 999 ? 0 : 99;
    const totalAmount = subtotal - discountAmount + shippingFee;

    // 3. Unique Identifiers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FIT-2026-${randomSuffix}`;
    const customerCode = `FIT-CUST-${randomSuffix}`;

    // 4. Razorpay Initialization
    let razorpayOrder: RazorpayOrderResult | undefined;
    if (input.paymentMethod === PaymentMethod.RAZORPAY) {
      razorpayOrder = await RazorpayService.createOrder({
        amountInPaise: Math.round(totalAmount * 100),
        receipt: orderNumber,
        notes: {
          customerName: input.customer.fullName,
          customerEmail: input.customer.email,
        },
      });
    }

    const orderData = {
      id: `ord_${Date.now()}_${randomSuffix}`,
      orderNumber,
      customerCode,
      customerName: input.customer.fullName,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      shippingAddress: {
        ...input.shippingAddress,
        isServiceable: true,
      },
      items: resolvedItems,
      subtotal,
      discountAmount,
      couponCode: input.couponCode || null,
      shippingFee,
      totalAmount,
      paymentMethod: input.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      transactionId: razorpayOrder?.id || null,
      status: OrderStatus.PLACED,
      dispatchState: DispatchState.NOT_BOOKED,
      courierName: 'Ekart Logistics',
      internalNotes: [],
      timeline: [
        {
          status: OrderStatus.PLACED,
          actor: 'CUSTOMER',
          note: `Order placed via ${input.paymentMethod} checkout`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 5. Database Persistence or In-Memory Cache
    const fallback = () => {
      IN_MEMORY_ORDERS.set(orderData.id, orderData);
      IN_MEMORY_ORDERS.set(orderData.orderNumber, orderData);
      return { order: orderData, razorpayOrder };
    };

    return withDbFallback<{ order: any; razorpayOrder?: RazorpayOrderResult }>(async () => {
      const customer = await prisma.customer.upsert({
        where: { email: input.customer.email },
        update: { fullName: input.customer.fullName, phone: input.customer.phone },
        create: {
          customerCode,
          fullName: input.customer.fullName,
          email: input.customer.email,
          phone: input.customer.phone,
        },
      });

      const dbOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerCode: customer.customerCode,
          customerName: input.customer.fullName,
          customerEmail: input.customer.email,
          customerPhone: input.customer.phone,
          shippingAddress: orderData.shippingAddress,
          subtotal,
          discountAmount,
          couponCode: input.couponCode,
          shippingFee,
          totalAmount,
          paymentMethod: input.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          transactionId: razorpayOrder?.id,
          status: OrderStatus.PLACED,
          dispatchState: DispatchState.NOT_BOOKED,
          courierName: 'Ekart Logistics',
          items: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              productTitle: item.productTitle,
              fitType: item.fitType,
              colorName: item.colorName,
              colorHex: item.colorHex,
              size: item.size,
              sku: item.sku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              thumbnail: item.thumbnail,
            })),
          },
          timeline: {
            create: [
              {
                status: OrderStatus.PLACED,
                actor: 'CUSTOMER',
                note: `Order placed via ${input.paymentMethod} checkout`,
              },
            ],
          },
        },
        include: { items: true, timeline: true },
      });

      IN_MEMORY_ORDERS.set(dbOrder.id, dbOrder);
      IN_MEMORY_ORDERS.set(dbOrder.orderNumber, dbOrder);

      return { order: dbOrder, razorpayOrder };
    }, fallback);
  }

  static async verifyPayment(params: {
    orderIdOrNumber: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const isValid = RazorpayService.verifyPaymentSignature(params);
    if (!isValid) {
      throw AppError.badRequest('Invalid payment signature verification failed');
    }

    const order = await this.getOrder(params.orderIdOrNumber);
    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.CONFIRMED;
    order.transactionId = params.razorpay_payment_id;
    order.timeline.push({
      status: OrderStatus.CONFIRMED,
      actor: 'SYSTEM',
      note: `Payment verified successfully (ID: ${params.razorpay_payment_id})`,
      timestamp: new Date().toISOString(),
    });

    await withDbFallback(async () => {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
          transactionId: params.razorpay_payment_id,
          timeline: {
            create: {
              status: OrderStatus.CONFIRMED,
              actor: 'SYSTEM',
              note: `Payment verified successfully (ID: ${params.razorpay_payment_id})`,
            },
          },
        },
      });
    }, () => {});

    IN_MEMORY_ORDERS.set(order.id, order);
    IN_MEMORY_ORDERS.set(order.orderNumber, order);
    return order;
  }

  static async confirmCodOrder(orderIdOrNumber: string) {
    const order = await this.getOrder(orderIdOrNumber);
    order.status = OrderStatus.CONFIRMED;
    order.timeline.push({
      status: OrderStatus.CONFIRMED,
      actor: 'CUSTOMER',
      note: 'COD order confirmed for warehouse packing',
      timestamp: new Date().toISOString(),
    });

    await withDbFallback(async () => {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CONFIRMED,
          timeline: {
            create: {
              status: OrderStatus.CONFIRMED,
              actor: 'CUSTOMER',
              note: 'COD order confirmed for warehouse packing',
            },
          },
        },
      });
    }, () => {});

    IN_MEMORY_ORDERS.set(order.id, order);
    IN_MEMORY_ORDERS.set(order.orderNumber, order);
    return order;
  }

  static async getOrder(orderIdOrNumber: string) {
    const fallback = () => {
      const order = IN_MEMORY_ORDERS.get(orderIdOrNumber);
      if (!order) {
        throw AppError.notFound(`Order "${orderIdOrNumber}" not found`);
      }
      return order;
    };

    return withDbFallback(async () => {
      const dbOrder = await prisma.order.findFirst({
        where: {
          OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
        },
        include: { items: true, timeline: true },
      });

      if (dbOrder) return dbOrder;
      return fallback();
    }, fallback);
  }
}
