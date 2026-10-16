export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad request', details?: unknown): AppError {
    return new AppError(message, 400, details);
  }

  static unauthorized(message: string = 'Authentication required'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Access denied: insufficient permissions'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string = 'Resource conflict'): AppError {
    return new AppError(message, 409);
  }

  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500);
  }
}
