"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const environment_1 = require("../config/environment");
const errorHandler = (err, _req, res, _next) => {
    console.error('[Error Middleware]:', err.message);
    const statusCode = err.statusCode || 500;
    const isProduction = environment_1.config.nodeEnv === 'production';
    const userSafeMessage = isProduction && statusCode === 500
        ? 'An unexpected error occurred. Please try again later.'
        : err.message || 'Internal Server Error';
    // In production, never return stack traces or internal DB error objects to client
    const errorDetails = isProduction ? undefined : { message: err.message };
    (0, response_1.sendError)(res, statusCode, userSafeMessage, errorDetails);
};
exports.errorHandler = errorHandler;
