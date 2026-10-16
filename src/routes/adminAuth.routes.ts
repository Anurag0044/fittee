import { Router } from 'express';
import { AdminAuthController, loginSchema } from '../controllers/adminAuth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { requireAdminAuth } from '../middleware/auth.middleware';

export const adminAuthRouter = Router();

adminAuthRouter.post('/auth/login', validateBody(loginSchema), AdminAuthController.login);
adminAuthRouter.get('/auth/me', requireAdminAuth, AdminAuthController.me);
