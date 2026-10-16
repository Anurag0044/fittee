import { Request, Response, NextFunction } from 'express';
import { AdminRole } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/errors.util';

export const requireAdminAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Authentication token is required');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw AppError.unauthorized('Malformed authorization header');
  }

  const decoded = AuthService.verifyToken(token);
  req.adminUser = decoded;
  next();
};

export const requireRoles = (...allowedRoles: AdminRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.adminUser) {
      throw AppError.unauthorized('Authentication required');
    }

    // SUPER_ADMIN has access to everything
    if (req.adminUser.role === AdminRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.adminUser.role)) {
      throw AppError.forbidden(`Access restricted to roles: ${allowedRoles.join(', ')}`);
    }

    next();
  };
};
