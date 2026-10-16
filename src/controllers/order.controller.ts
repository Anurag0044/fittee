import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/order.service';
import { ApiResponseHandler } from '../utils/apiResponse.util';

export const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2, 'Customer full name is required'),
    email: z.string().email('Valid customer email required'),
    phone: z.string().min(10, 'Valid 10-digit customer phone required'),
  }),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Recipient full name is required'),
    phone: z.string().min(10, 'Recipient phone required'),
    addressLine1: z.string().min(5, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Indian pincode must be exactly 6 digits'),
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID or slug is required'),
      variantId: z.string().optional(),
      sku: z.string().optional(),
      size: z.string().min(1, 'Size is required'),
      colorName: z.string().optional(),
      colorHex: z.string().optional(),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'At least one item is required in the order'),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
  couponCode: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  orderIdOrNumber: z.string().min(1, 'Order ID or order number is required'),
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
});

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await OrderService.createOrder(req.body);
      ApiResponseHandler.created(res, result, 'Order created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderService.verifyPayment(req.body);
      ApiResponseHandler.success(res, order, 'Payment verified and order confirmed');
    } catch (error) {
      next(error);
    }
  }

  static async confirmCodOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.confirmCodOrder(id);
      ApiResponseHandler.success(res, order, 'COD order confirmed for fulfillment');
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const order = await OrderService.getOrder(orderNumber);
      ApiResponseHandler.success(res, order, 'Order details retrieved');
    } catch (error) {
      next(error);
    }
  }
}
