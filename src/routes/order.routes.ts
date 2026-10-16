import { Router } from 'express';
import {
  OrderController,
  createOrderSchema,
  verifyPaymentSchema,
} from '../controllers/order.controller';
import { validateBody } from '../middleware/validate.middleware';

export const orderRouter = Router();

orderRouter.post('/', validateBody(createOrderSchema), OrderController.createOrder);
orderRouter.post('/verify-payment', validateBody(verifyPaymentSchema), OrderController.verifyPayment);
orderRouter.post('/:id/cod-confirm', OrderController.confirmCodOrder);
orderRouter.get('/:orderNumber', OrderController.getOrder);
