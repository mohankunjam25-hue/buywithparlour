"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_service_1 = require("./cart.service");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const response_1 = require("../../utils/response");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', async (req, res, next) => {
    try {
        const cart = await cart_service_1.CartService.getCart(req.user.userId);
        (0, response_1.sendResponse)(res, 200, true, 'Cart retrieved', { cart });
    }
    catch (error) {
        next(error);
    }
});
router.post('/items', async (req, res, next) => {
    try {
        const { productId, quantity, variantSku } = req.body;
        const cart = await cart_service_1.CartService.addToCart(req.user.userId, productId, quantity || 1, variantSku);
        (0, response_1.sendResponse)(res, 200, true, 'Item added to cart', { cart });
    }
    catch (error) {
        if (error instanceof Error && (error.message.includes('not found') || error.message.includes('stock'))) {
            (0, response_1.sendError)(res, 400, error.message);
            return;
        }
        next(error);
    }
});
router.delete('/items/:productId', async (req, res, next) => {
    try {
        const { variantSku } = req.query;
        const cart = await cart_service_1.CartService.removeFromCart(req.user.userId, req.params.productId, variantSku);
        (0, response_1.sendResponse)(res, 200, true, 'Item removed from cart', { cart });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
