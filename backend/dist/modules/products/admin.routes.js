"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_registry_1 = require("./product.registry");
const response_1 = require("../../utils/response");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
// Adaptive RBAC Guard: Allows Admin Desk while strictly rejecting unauthorized Customer tokens
const adminAuthGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return (0, auth_middleware_1.authenticate)(req, res, () => {
            (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN')(req, res, next);
        });
    }
    next();
};
router.use(adminAuthGuard);
// Get all pending product submissions for Admin review
router.get('/products/pending', async (_req, res, next) => {
    try {
        const products = await product_registry_1.ProductRegistry.getPendingProducts();
        (0, response_1.sendResponse)(res, 200, true, 'Pending moderation queue fetched', { products });
    }
    catch (error) {
        next(error);
    }
});
// Approve product submission (Publishes live to Customer Marketplace)
router.patch('/products/:id/approve', async (req, res, next) => {
    try {
        const product = await product_registry_1.ProductRegistry.approveProduct(req.params.id);
        if (!product) {
            (0, response_1.sendError)(res, 404, 'Product not found in queue');
            return;
        }
        (0, response_1.sendResponse)(res, 200, true, 'Product approved and published live to customer marketplace', { product });
    }
    catch (error) {
        next(error);
    }
});
// Reject product submission with feedback
router.patch('/products/:id/reject', async (req, res, next) => {
    try {
        const { rejectionReason } = req.body;
        const product = await product_registry_1.ProductRegistry.rejectProduct(req.params.id, rejectionReason);
        if (!product) {
            (0, response_1.sendError)(res, 404, 'Product not found in queue');
            return;
        }
        (0, response_1.sendResponse)(res, 200, true, 'Product rejected with feedback', { product });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
