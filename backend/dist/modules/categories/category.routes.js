"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = require("./category.model");
const response_1 = require("../../utils/response");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
const mockCategories = [
    { _id: '66bc22222222222222222222', name: 'Skin Care', slug: 'skin-care', description: 'Serums, moisturizers, and face masks' },
    { _id: '66bc22222222222222222223', name: 'Hair Care', slug: 'hair-care', description: 'Keratin treatments, shampoos, and oils' },
    { _id: '66bc22222222222222222224', name: 'Makeup', slug: 'makeup', description: 'Lipsticks, foundations, and eye makeup' },
    { _id: '66bc22222222222222222225', name: 'Hair Styling', slug: 'hair-styling', description: 'Professional dryers and straighteners' },
    { _id: '66bc22222222222222222226', name: 'Salon Equipment', slug: 'salon-equipment', description: 'Bulk salon equipment and accessories' },
];
router.get('/', async (_req, res, _next) => {
    if (mongoose_1.default.connection.readyState === 1) {
        try {
            const categories = await category_model_1.CategoryModel.find().populate('parentCategory', 'name slug');
            if (categories.length > 0) {
                (0, response_1.sendResponse)(res, 200, true, 'Categories fetched', { categories });
                return;
            }
        }
        catch (error) {
            console.warn('[CategoryRoutes] Database lookup skipped, serving mock categories');
        }
    }
    (0, response_1.sendResponse)(res, 200, true, 'Categories fetched', { categories: mockCategories });
});
router.post('/', auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
    try {
        const category = await category_model_1.CategoryModel.create(req.body);
        (0, response_1.sendResponse)(res, 201, true, 'Category created', { category });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
    try {
        const category = await category_model_1.CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        (0, response_1.sendResponse)(res, 200, true, 'Category updated', { category });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
    try {
        await category_model_1.CategoryModel.findByIdAndDelete(req.params.id);
        (0, response_1.sendResponse)(res, 200, true, 'Category deleted successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
