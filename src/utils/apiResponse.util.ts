import { Response } from 'express';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
  timestamp: string;
}

export class ApiResponseHandler {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Operation successful',
    statusCode: number = 200
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data?: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = 500,
    errorDetails?: unknown
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      error: errorDetails,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
