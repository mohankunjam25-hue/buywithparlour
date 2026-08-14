"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.ProductController.getProducts);
router.get('/facets', product_controller_1.ProductController.getFacets);
router.get('/suggestions', product_controller_1.ProductController.getSuggestions);
router.get('/:slug', product_controller_1.ProductController.getProductBySlug);
// Admin Protected Routes
router.post('/', auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN'), product_controller_1.ProductController.createProduct);
router.put('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN'), product_controller_1.ProductController.updateProduct);
router.delete('/:id', auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)('ADMIN', 'SUPER_ADMIN'), product_controller_1.ProductController.deleteProduct);
exports.default = router;
