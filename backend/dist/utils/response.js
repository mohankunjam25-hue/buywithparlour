"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, success, message, data) => {
    return res.status(statusCode).json({
        success,
        message,
        ...(data !== undefined && { data }),
    });
};
exports.sendResponse = sendResponse;
const sendError = (res, statusCode, message, error) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && error !== undefined && { error }),
    });
};
exports.sendError = sendError;
