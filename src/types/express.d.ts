import { AdminRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        id: string;
        email: string;
        name: string;
        role: AdminRole;
      };
      customerUser?: {
        id: string;
        email: string;
        customerCode: string;
      };
    }
  }
}
