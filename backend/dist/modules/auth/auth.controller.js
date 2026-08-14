"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const googleAuth_service_1 = require("../../services/googleAuth.service");
const response_1 = require("../../utils/response");
const token_1 = require("../../utils/token");
const user_model_1 = require("../users/user.model");
class AuthController {
    static async register(req, res, _next) {
        try {
            const { name, email, password, phone } = req.body;
            const { user, accessToken, refreshToken } = await auth_service_1.AuthService.register({
                name,
                email,
                password,
                phone,
            });
            (0, token_1.sendRefreshTokenCookie)(res, refreshToken);
            (0, response_1.sendResponse)(res, 201, true, 'Account registered successfully', { user, accessToken });
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message || 'Registration failed');
        }
    }
    static async login(req, res, _next) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await auth_service_1.AuthService.login({ email, password });
            (0, token_1.sendRefreshTokenCookie)(res, refreshToken);
            (0, response_1.sendResponse)(res, 200, true, 'Login successful', { user, accessToken });
        }
        catch (error) {
            (0, response_1.sendError)(res, 401, error.message || 'Login failed');
        }
    }
    static async googleLogin(req, res, _next) {
        try {
            const { email, name } = req.body;
            if (!email) {
                (0, response_1.sendError)(res, 400, 'Google Account Email is required.');
                return;
            }
            const { user, tokens } = await (0, googleAuth_service_1.verifyAndLoginGoogleUser)({
                email,
                name: name || 'Google Customer',
            });
            (0, token_1.sendRefreshTokenCookie)(res, tokens.refreshToken);
            (0, response_1.sendResponse)(res, 200, true, '✨ Google 1-Click Login Successful!', {
                user,
                accessToken: tokens.accessToken,
            });
        }
        catch (error) {
            (0, response_1.sendError)(res, 400, error.message || 'Google authentication failed');
        }
    }
    static async refresh(req, res, _next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            const { accessToken, refreshToken: newRefreshToken } = await auth_service_1.AuthService.refresh(refreshToken);
            (0, token_1.sendRefreshTokenCookie)(res, newRefreshToken);
            (0, response_1.sendResponse)(res, 200, true, 'Token refreshed successfully', { accessToken });
        }
        catch (error) {
            (0, response_1.sendError)(res, 401, 'Invalid or expired refresh token');
        }
    }
    static async logout(_req, res) {
        (0, token_1.clearRefreshTokenCookie)(res);
        (0, response_1.sendResponse)(res, 200, true, 'Logged out successfully');
    }
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, 401, 'Unauthorized');
                return;
            }
            const user = await user_model_1.UserModel.findById(req.user.userId);
            if (!user) {
                (0, response_1.sendError)(res, 404, 'User not found');
                return;
            }
            (0, response_1.sendResponse)(res, 200, true, 'User profile fetched', { user: auth_service_1.AuthService.sanitizeUser(user) });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
