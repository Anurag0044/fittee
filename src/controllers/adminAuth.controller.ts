import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { ApiResponseHandler } from '../utils/apiResponse.util';

export const loginSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export class AdminAuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginAdmin(email, password);
      ApiResponseHandler.success(res, result, 'Admin authenticated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.adminUser!.id;
      const user = await AuthService.getAdminById(adminId);
      ApiResponseHandler.success(res, user, 'Admin profile retrieved');
    } catch (error) {
      next(error);
    }
  }
}
