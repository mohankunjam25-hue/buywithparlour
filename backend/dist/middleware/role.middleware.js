"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const response_1 = require("../utils/response");
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendError)(res, 401, 'Unauthorized: User authentication required');
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            (0, response_1.sendError)(res, 403, 'Forbidden: Insufficient privileges for this action');
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
