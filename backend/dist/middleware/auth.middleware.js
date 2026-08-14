"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const response_1 = require("../utils/response");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        (0, response_1.sendError)(res, 401, 'Unauthorized: Access token missing or invalid format');
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, token_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        (0, response_1.sendError)(res, 401, 'Unauthorized: Token expired or invalid', error);
    }
};
exports.authenticate = authenticate;
