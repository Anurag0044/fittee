import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.util';
import { ApiResponseHandler } from '../utils/apiResponse.util';
import { logger } from '../utils/logger.util';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  ApiResponseHandler.error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Zod validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    ApiResponseHandler.error(res, 'Validation failed', 400, formattedErrors);
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[AppError ${err.statusCode}] ${err.message}`, { path: req.path, details: err.details });
    }
    ApiResponseHandler.error(res, err.message, err.statusCode, err.details);
    return;
  }

  // Handle malformed JSON body
  if ('type' in err && (err as { type?: string }).type === 'entity.parse.failed') {
    ApiResponseHandler.error(res, 'Malformed JSON payload in request body', 400);
    return;
  }

  // Unhandled unexpected error
  logger.error(`[Unhandled Error] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const message = env.isProd ? 'Internal server error' : err.message;
  ApiResponseHandler.error(res, message, 500, env.isProd ? undefined : err.stack);
};
