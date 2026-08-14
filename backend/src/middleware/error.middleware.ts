import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { config } from '../config/environment';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error Middleware]:', err.message);

  const statusCode = (err as unknown as { statusCode?: number }).statusCode || 500;
  const isProduction = config.nodeEnv === 'production';

  const userSafeMessage = isProduction && statusCode === 500
    ? 'An unexpected error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  // In production, never return stack traces or internal DB error objects to client
  const errorDetails = isProduction ? undefined : { message: err.message };

  sendError(res, statusCode, userSafeMessage, errorDetails);
};
