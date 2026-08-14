"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRefreshTokenCookie = exports.sendRefreshTokenCookie = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, environment_1.config.jwtSecret, { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, environment_1.config.jwtRefreshSecret, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, environment_1.config.jwtSecret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, environment_1.config.jwtRefreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const sendRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: environment_1.config.nodeEnv === 'production',
        sameSite: environment_1.config.nodeEnv === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/auth/refresh',
    });
};
exports.sendRefreshTokenCookie = sendRefreshTokenCookie;
const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: environment_1.config.nodeEnv === 'production',
        sameSite: environment_1.config.nodeEnv === 'production' ? 'strict' : 'lax',
        path: '/api/auth/refresh',
    });
};
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
