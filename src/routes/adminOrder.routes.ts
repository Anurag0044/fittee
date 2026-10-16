import { Router } from 'express';
import {
  AdminOrderController,
  updateStatusSchema,
  addNoteSchema,
  cancelOrderSchema,
} from '../controllers/adminOrder.controller';
import { LogisticsController } from '../controllers/logistics.controller';
import { requireAdminAuth, requireRoles } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { AdminRole } from '@prisma/client';

export const adminOrderRouter = Router();

// Apply Admin Auth to all order management and fulfillment routes
adminOrderRouter.use(requireAdminAuth);

// Order List & Dossier
adminOrderRouter.get('/orders', AdminOrderController.listOrders);
adminOrderRouter.get('/orders/:id', AdminOrderController.getOrderById);

// Order Status & Notes
adminOrderRouter.patch('/orders/:id/status', validateBody(updateStatusSchema), AdminOrderController.updateOrderStatus);
adminOrderRouter.post('/orders/:id/notes', validateBody(addNoteSchema), AdminOrderController.addOrderNote);

// Order Cancellation (SUPER_ADMIN or LOGISTICS_MGR)
adminOrderRouter.post(
  '/orders/:id/cancel',
  requireRoles(AdminRole.SUPER_ADMIN, AdminRole.LOGISTICS_MGR),
  validateBody(cancelOrderSchema),
  AdminOrderController.cancelOrder
);

// Logistics: Ekart 1-Click Dispatch (Protected by Idempotency)
adminOrderRouter.post(
  '/orders/:id/dispatch-ekart',
  requireRoles(AdminRole.SUPER_ADMIN, AdminRole.LOGISTICS_MGR),
  LogisticsController.dispatchOrderWithEkart
);

// Logistics: Thermal Shipping Label (4x6" PDF) & Tax Invoice
adminOrderRouter.get('/orders/:id/label', LogisticsController.getShippingLabelPdf);
adminOrderRouter.get('/orders/:id/invoice', LogisticsController.getTaxInvoicePdf);

// Media: Signed Cloudinary Upload
adminOrderRouter.post('/media/sign-upload', LogisticsController.signMediaUpload);
