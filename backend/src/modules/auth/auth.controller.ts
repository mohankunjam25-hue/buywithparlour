import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { verifyAndLoginGoogleUser } from '../../services/googleAuth.service';
import { sendResponse, sendError } from '../../utils/response';
import { sendRefreshTokenCookie, clearRefreshTokenCookie } from '../../utils/token';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { UserModel } from '../users/user.model';

export class AuthController {
  static async register(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { name, email, password, phone } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.register({
        name,
        email,
        password,
        phone,
      });

      sendRefreshTokenCookie(res, refreshToken);
      sendResponse(res, 201, true, 'Account registered successfully', { user, accessToken });
    } catch (error: any) {
      sendError(res, 400, error.message || 'Registration failed');
    }
  }

  static async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.login({ email, password });

      sendRefreshTokenCookie(res, refreshToken);
      sendResponse(res, 200, true, 'Login successful', { user, accessToken });
    } catch (error: any) {
      sendError(res, 401, error.message || 'Login failed');
    }
  }

  static async googleLogin(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { email, name } = req.body;
      if (!email) {
        sendError(res, 400, 'Google Account Email is required.');
        return;
      }

      const { user, tokens } = await verifyAndLoginGoogleUser({
        email,
        name: name || 'Google Customer',
      });

      sendRefreshTokenCookie(res, tokens.refreshToken);
      sendResponse(res, 200, true, '✨ Google 1-Click Login Successful!', {
        user,
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      sendError(res, 400, error.message || 'Google authentication failed');
    }
  }

  static async refresh(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);
      sendRefreshTokenCookie(res, newRefreshToken);
      sendResponse(res, 200, true, 'Token refreshed successfully', { accessToken });
    } catch (error) {
      sendError(res, 401, 'Invalid or expired refresh token');
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    clearRefreshTokenCookie(res);
    sendResponse(res, 200, true, 'Logged out successfully');
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 401, 'Unauthorized');
        return;
      }
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        sendError(res, 404, 'User not found');
        return;
      }
      sendResponse(res, 200, true, 'User profile fetched', { user: AuthService.sanitizeUser(user) });
    } catch (error) {
      next(error);
    }
  }
}
