import { Router, Request, Response } from 'express';
import { env } from '../config/env';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'fittee-backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
