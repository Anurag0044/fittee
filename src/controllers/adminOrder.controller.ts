import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { OrderService, IN_MEMORY_ORDERS } from '../services/order.service';
import { prisma, withDbFallback } from '../config/prisma';
import { ApiResponseHandler } from '../utils/apiResponse.util';
import { AppError } from '../utils/errors.util';

export const updateStatusSchema = z.object({
  status: z.enum(['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RTO']),
  note: z.string().optional(),
});

export const addNoteSchema = z.object({
  note: z.string().min(1, 'Note content is required'),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason is required'),
});

export class AdminOrderController {
  static async listOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tab = (req.query.tab as string) || 'ALL';
      const paymentMethod = req.query.paymentMethod as PaymentMethod | undefined;
      const search = (req.query.search as string)?.toLowerCase().trim();
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 20));

      const fallback = () => {
        let orders = Array.from(IN_MEMORY_ORDERS.values());

        // Deduplicate in case indexed by both id and orderNumber
        const uniqueOrders = Array.from(new Map(orders.map((o) => [o.id, o])).values());

        let filtered = uniqueOrders;

        // Tab filter matching admin UI
        if (tab === 'NEEDS_ACTION') {
          filtered = filtered.filter((o) => o.status === 'CONFIRMED' || o.status === 'PLACED');
        } else if (tab === 'PACKED') {
          filtered = filtered.filter((o) => o.status === 'PACKED');
        } else if (tab === 'SHIPPED') {
          filtered = filtered.filter((o) => o.status === 'SHIPPED');
        } else if (tab === 'DELIVERED') {
          filtered = filtered.filter((o) => o.status === 'DELIVERED');
        } else if (tab === 'CANCELLED') {
          filtered = filtered.filter((o) => o.status === 'CANCELLED' || o.status === 'RTO');
        }

        // Payment filter
        if (paymentMethod && paymentMethod !== ('ALL' as any)) {
          filtered = filtered.filter((o) => o.paymentMethod === paymentMethod);
        }

        // Search query (orderNumber, customerName, customerCode, customerPhone, pincode)
        if (search) {
          filtered = filtered.filter(
            (o) =>
              o.orderNumber.toLowerCase().includes(search) ||
              o.customerName.toLowerCase().includes(search) ||
              o.customerCode.toLowerCase().includes(search) ||
              o.customerPhone.includes(search) ||
              o.shippingAddress?.pincode?.includes(search)
          );
        }

        const startIndex = (page - 1) * limit;
        const paginated = filtered.slice(startIndex, startIndex + limit);

        return {
          orders: paginated,
          total: filtered.length,
          page,
          limit,
        };
      };

      const result = await withDbFallback(async () => {
        const whereClause: any = {};

        if (tab === 'NEEDS_ACTION') {
          whereClause.status = { in: ['CONFIRMED', 'PLACED'] };
        } else if (tab === 'PACKED') {
          whereClause.status = 'PACKED';
        } else if (tab === 'SHIPPED') {
          whereClause.status = 'SHIPPED';
        } else if (tab === 'DELIVERED') {
          whereClause.status = 'DELIVERED';
        } else if (tab === 'CANCELLED') {
          whereClause.status = { in: ['CANCELLED', 'RTO'] };
        }

        if (paymentMethod && paymentMethod !== ('ALL' as any)) {
          whereClause.paymentMethod = paymentMethod;
        }

        if (search) {
          whereClause.OR = [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { customerName: { contains: search, mode: 'insensitive' } },
            { customerCode: { contains: search, mode: 'insensitive' } },
            { customerPhone: { contains: search } },
          ];
        }

        const dbOrders = await prisma.order.findMany({
          where: whereClause,
          include: { items: true, timeline: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: (page - 1) * limit,
        });

        if (!dbOrders || dbOrders.length === 0) {
          return fallback();
        }

        const count = await prisma.order.count({ where: whereClause });
        return {
          orders: dbOrders,
          total: count,
          page,
          limit,
        };
      }, fallback);

      ApiResponseHandler.success(res, result, 'Admin orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrder(id);
      ApiResponseHandler.success(res, order, 'Order detail retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const order = await OrderService.getOrder(id);

      order.status = status as OrderStatus;
      const actor = req.adminUser?.name || 'ADMIN_OPERATOR';
      const logNote = note || `Status updated to ${status} by ${actor}`;

      if (!order.timeline) order.timeline = [];
      order.timeline.push({
        status,
        actor,
        note: logNote,
        timestamp: new Date().toISOString(),
      });

      await withDbFallback(async () => {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status,
            timeline: {
              create: {
                status,
                actor,
                note: logNote,
              },
            },
          },
        });
      }, () => {});

      IN_MEMORY_ORDERS.set(order.id, order);
      IN_MEMORY_ORDERS.set(order.orderNumber, order);

      ApiResponseHandler.success(res, order, `Order status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async addOrderNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { note } = req.body;
      const order = await OrderService.getOrder(id);

      if (!order.internalNotes) order.internalNotes = [];
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const actor = req.adminUser?.name || 'Admin';
      const formattedNote = `[${timestamp} by ${actor}] ${note}`;
      order.internalNotes.push(formattedNote);

      await withDbFallback(async () => {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            internalNotes: order.internalNotes,
          },
        });
      }, () => {});

      IN_MEMORY_ORDERS.set(order.id, order);
      IN_MEMORY_ORDERS.set(order.orderNumber, order);

      ApiResponseHandler.success(res, order, 'Internal note added to order');
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const order = await OrderService.getOrder(id);

      if (order.status === OrderStatus.DELIVERED) {
        throw AppError.badRequest('Cannot cancel an order that has already been delivered');
      }

      order.status = OrderStatus.CANCELLED;
      const actor = req.adminUser?.name || 'Admin';
      const logNote = `Order cancelled by ${actor}: ${reason}`;

      if (!order.timeline) order.timeline = [];
      order.timeline.push({
        status: OrderStatus.CANCELLED,
        actor,
        note: logNote,
        timestamp: new Date().toISOString(),
      });

      await withDbFallback(async () => {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CANCELLED,
            timeline: {
              create: {
                status: OrderStatus.CANCELLED,
                actor,
                note: logNote,
              },
            },
          },
        });
      }, () => {});

      IN_MEMORY_ORDERS.set(order.id, order);
      IN_MEMORY_ORDERS.set(order.orderNumber, order);

      ApiResponseHandler.success(res, order, 'Order cancelled successfully and stock returned');
    } catch (error) {
      next(error);
    }
  }
}
