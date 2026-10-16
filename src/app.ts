import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { healthRouter } from './routes/health.routes';
import { adminAuthRouter } from './routes/adminAuth.routes';
import { adminOrderRouter } from './routes/adminOrder.routes';
import { adminControlRouter } from './routes/adminControl.routes';
import { storeRouter } from './routes/store.routes';
import { orderRouter } from './routes/order.routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // 1. Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // 2. CORS Policy
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);
        if (env.isDev) return callback(null, true);
        if (env.corsOriginsList.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Requested-With'],
    })
  );

  // 3. HTTP Request Logging
  if (!env.isTest) {
    app.use(morgan(env.isDev ? 'dev' : 'combined'));
  }

  // 4. Request Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 5. Root & Health Check Routes
  app.use(healthRouter);
  app.use(env.API_PREFIX, healthRouter);

  // 6. Admin Authentication & Management Routes
  app.use(`${env.API_PREFIX}/admin`, adminAuthRouter);
  app.use(`${env.API_PREFIX}/admin`, adminOrderRouter);
  app.use(`${env.API_PREFIX}/admin`, adminControlRouter);

  // 7. Storefront Customer Routes
  app.use(`${env.API_PREFIX}/store`, storeRouter);
  app.use(`${env.API_PREFIX}/store/orders`, orderRouter);

  // 8. Not Found & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
