import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponseHandler } from '../utils/apiResponse.util';

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        ApiResponseHandler.error(
          res,
          'Validation failed',
          400,
          error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        );
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        ApiResponseHandler.error(
          res,
          'Query validation failed',
          400,
          error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        );
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        ApiResponseHandler.error(
          res,
          'URL parameters validation failed',
          400,
          error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        );
        return;
      }
      next(error);
    }
  };
};
