import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { sendError } from '../utils/response';

export const authorizeRoles = (...allowedRoles: Array<'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'Unauthorized: User authentication required');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 403, 'Forbidden: Insufficient privileges for this action');
      return;
    }

    next();
  };
};
