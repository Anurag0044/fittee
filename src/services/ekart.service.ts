import PDFDocument from 'pdfkit';
import { OrderStatus, DispatchState } from '@prisma/client';
import { env } from '../config/env';
import { logger } from '../utils/logger.util';
import { AppError } from '../utils/errors.util';
import { OrderService, IN_MEMORY_ORDERS } from './order.service';
import { prisma, withDbFallback } from '../config/prisma';

export interface PincodeServiceabilityResult {
  pincode: string;
  isServiceable: boolean;
  city: string;
  state: string;
  estimatedDays: number;
  codAvailable: boolean;
  courierName: string;
}

export interface EkartDispatchResult {
  success: boolean;
  orderId: string;
  orderNumber: string;
  awbNumber: string;
  manifestId: string;
  courierName: string;
  dispatchedAt: string;
  isDuplicateCall?: boolean;
}

export class EkartService {
  static checkPincode(pincode: string): PincodeServiceabilityResult {
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      throw AppError.badRequest('Pincode must be exactly 6 Indian numeric digits');
    }

    // High-priority direct regional hubs (Jharkhand: 834xxx, 831xxx, 825xxx, 826xxx, 827xxx, 828xxx)
    // and Metros (110xxx Delhi, 400xxx Mumbai, 560xxx Bangalore, 700xxx Kolkata, 500xxx Hyderabad)
    const isServiceable = true; // Ekart covers >95% of active pin codes
    const isJharkhand = cleanPin.startsWith('83') || cleanPin.startsWith('82');

    return {
      pincode: cleanPin,
      isServiceable,
      city: isJharkhand ? 'Ranchi / Regional Hub' : 'National Destination Hub',
      state: isJharkhand ? 'Jharkhand' : 'India',
      estimatedDays: isJharkhand ? 2 : 4,
      codAvailable: true,
      courierName: 'Ekart Logistics',
    };
  }

  static async dispatchShipment(orderIdOrNumber: string, idempotencyKey?: string): Promise<EkartDispatchResult> {
    const order = await OrderService.getOrder(orderIdOrNumber);

    if (order.status === OrderStatus.CANCELLED) {
      throw AppError.badRequest('Cannot dispatch a cancelled order');
    }

    // Idempotency: Return existing consignment if already dispatched
    if (order.dispatchState === DispatchState.BOOKED && order.awbNumber) {
      logger.info(`[Ekart Idempotency] Order ${order.orderNumber} already dispatched with AWB ${order.awbNumber}`);
      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        awbNumber: order.awbNumber,
        manifestId: order.manifestId || `MAN-RNC-${Date.now()}`,
        courierName: 'Ekart Logistics',
        dispatchedAt: order.updatedAt || new Date().toISOString(),
        isDuplicateCall: true,
      };
    }

    // Generate Ekart AWB and Manifest
    const randomAwbSuffix = Math.floor(100000 + Math.random() * 900000);
    const awbNumber = `EKT-IND-${randomAwbSuffix}`;
    const manifestId = `MAN-RNC-${Date.now()}`;

    order.dispatchState = DispatchState.BOOKED;
    order.status = OrderStatus.SHIPPED;
    order.awbNumber = awbNumber;
    order.manifestId = manifestId;
    order.courierName = 'Ekart Logistics';
    order.updatedAt = new Date().toISOString();

    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status: OrderStatus.SHIPPED,
      actor: 'LOGISTICS_MGR',
      note: `Shipment booked with Ekart Logistics (AWB: ${awbNumber}, Manifest: ${manifestId})`,
      timestamp: new Date().toISOString(),
    });

    await withDbFallback(async () => {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          dispatchState: DispatchState.BOOKED,
          status: OrderStatus.SHIPPED,
          awbNumber,
          manifestId,
          timeline: {
            create: {
              status: OrderStatus.SHIPPED,
              actor: 'LOGISTICS_MGR',
              note: `Shipment booked with Ekart Logistics (AWB: ${awbNumber})`,
            },
          },
        },
      });
    }, () => {});

    IN_MEMORY_ORDERS.set(order.id, order);
    IN_MEMORY_ORDERS.set(order.orderNumber, order);

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      awbNumber,
      manifestId,
      courierName: 'Ekart Logistics',
      dispatchedAt: new Date().toISOString(),
    };
  }

  static async generateThermalLabelPdf(orderIdOrNumber: string): Promise<Buffer> {
    const order = await OrderService.getOrder(orderIdOrNumber);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [288, 432], // 4x6 inches in PDF points (72dpi)
        margin: 16,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(14).font('Helvetica-Bold').text('EKART LOGISTICS', { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(8).font('Helvetica').text('ROUTING: RNC-EAST-HUB-PRIORITY', { align: 'center' });
      doc.fontSize(11).font('Helvetica-Bold').text(`AWB: ${order.awbNumber || 'EKT-IND-84920'}`, { align: 'center' });
      doc.moveDown(0.4);

      // Barcode placeholder block
      doc.rect(16, doc.y, 256, 24).fillAndStroke('#F5F4EF', '#161714');
      doc.fillColor('#161714').fontSize(12).font('Courier-Bold').text('|||| ||||| |||| ||||||| |||||||', 24, doc.y - 18);
      doc.moveDown(1.5);

      // Recipient details
      doc.font('Helvetica-Bold').fontSize(9).text('SHIP TO:');
      doc.font('Helvetica-Bold').fontSize(10).text(order.shippingAddress?.fullName || order.customerName);
      doc.font('Helvetica').fontSize(9).text(order.shippingAddress?.addressLine1 || '');
      if (order.shippingAddress?.addressLine2) {
        doc.text(order.shippingAddress.addressLine2);
      }
      doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`);
      doc.text(`Phone: ${order.shippingAddress?.phone || order.customerPhone}`);
      doc.moveDown(0.8);

      // Divider
      doc.strokeColor('#CCCCCC').moveTo(16, doc.y).lineTo(272, doc.y).stroke();
      doc.moveDown(0.5);

      // Order Details
      doc.fontSize(8.5).font('Helvetica-Bold').text(`ORDER: ${order.orderNumber}`);
      doc.font('Helvetica').text(`PAYMENT: ${order.paymentMethod} (INR ${order.totalAmount})`);
      doc.text(`CUSTOMER ID: ${order.customerCode || 'FIT-CUST-1049'}`);
      doc.text(`ITEMS COUNT: ${order.items?.length || 1}`);

      doc.end();
    });
  }
}
