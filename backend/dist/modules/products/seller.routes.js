"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_registry_1 = require("./product.registry");
const cloudinary_service_1 = require("../../services/cloudinary.service");
const response_1 = require("../../utils/response");
const user_model_1 = require("../users/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// 0. Seller Profile & Store Info Endpoints
router.get('/profile', async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (userId && mongoose_1.default.connection.readyState === 1) {
            const user = await user_model_1.UserModel.findById(userId).lean();
            if (user) {
                (0, response_1.sendResponse)(res, 200, true, 'Seller profile fetched', {
                    seller: {
                        businessName: user.businessName || 'BuyWithParlour Beauty Merchant',
                        email: user.email,
                        phone: user.phone || '9876543210',
                        storeDescription: user.storeDescription || 'Premium Salon & Parlour Cosmetic Supplier',
                        gstin: user.gstin || '07AAACB1234F1Z5',
                        pickupAddress: user.pickupAddress || 'Connaught Place, New Delhi - 110001',
                        isSellerVerified: user.isSellerVerified || true,
                        isKycCompleted: user.isKycCompleted || true,
                    },
                });
                return;
            }
        }
        (0, response_1.sendResponse)(res, 200, true, 'Default seller profile fetched', {
            seller: {
                businessName: 'BuyWithParlour Beauty Merchant',
                email: 'seller@buywithparlour.com',
                phone: '9876543210',
                storeDescription: 'Premium Salon & Parlour Cosmetic Supplier',
                gstin: '07AAACB1234F1Z5',
                pickupAddress: 'Connaught Place, New Delhi - 110001',
                isSellerVerified: true,
                isKycCompleted: true,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/profile', async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { businessName, phone, storeDescription, gstin, pickupAddress } = req.body;
        if (userId && mongoose_1.default.connection.readyState === 1) {
            await user_model_1.UserModel.findByIdAndUpdate(userId, {
                businessName,
                phone,
                storeDescription,
                gstin,
                pickupAddress,
            });
        }
        (0, response_1.sendResponse)(res, 200, true, 'Seller profile updated successfully', {
            seller: {
                businessName,
                phone,
                storeDescription,
                gstin,
                pickupAddress,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// 1. Get all products submitted by seller with optional QC status filter
router.get('/products', async (req, res, next) => {
    try {
        const status = req.query.status;
        const products = await product_registry_1.ProductRegistry.getSellerProducts(status);
        (0, response_1.sendResponse)(res, 200, true, 'Seller products retrieved successfully', { products });
    }
    catch (error) {
        next(error);
    }
});
// 2. Submit new product for QC or save as Draft (with Cloudinary photo upload)
router.post('/products', async (req, res, _next) => {
    try {
        const { title, brand, sku, price, discountPrice, stock, category, hsnCode, description, highlights, ingredients, howToUse, images, isDraft, } = req.body;
        const slug = title
            ? title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '') +
                '-' +
                Date.now().toString().slice(-4)
            : `product-${Date.now()}`;
        // Upload photos to Cloudinary CDN
        let cdnImages = [];
        if (images && Array.isArray(images) && images.length > 0) {
            cdnImages = await cloudinary_service_1.CloudinaryService.uploadMultipleImages(images, 'smreen_products');
        }
        const newProduct = await product_registry_1.ProductRegistry.addProduct({
            title,
            brand,
            sku,
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : undefined,
            stock: Number(stock) || 10,
            category,
            hsnCode,
            description,
            highlights: Array.isArray(highlights) ? highlights : [],
            ingredients,
            howToUse,
            slug,
            images: cdnImages.length > 0 ? cdnImages : images,
            approvalStatus: isDraft ? 'DRAFT' : 'PENDING',
        });
        const msg = isDraft
            ? 'Product saved as Draft'
            : 'Product submitted successfully for Admin Quality Check (QC)';
        (0, response_1.sendResponse)(res, 201, true, msg, { product: newProduct });
    }
    catch (error) {
        console.error('Error in POST /api/seller/products:', error);
        (0, response_1.sendError)(res, 400, error.message || 'Failed to submit product', error);
    }
});
// 3. Update or Resubmit an existing listing (e.g. fix QC Failed errors)
router.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, brand, sku, price, discountPrice, stock, category, hsnCode, description, highlights, ingredients, howToUse, images, resubmitForQc, } = req.body;
        let cdnImages = [];
        if (images && Array.isArray(images) && images.length > 0) {
            cdnImages = await cloudinary_service_1.CloudinaryService.uploadMultipleImages(images, 'smreen_products');
        }
        const updated = await product_registry_1.ProductRegistry.updateProduct(id, {
            title,
            brand,
            sku,
            price: price !== undefined ? Number(price) : undefined,
            discountPrice: discountPrice !== undefined ? Number(discountPrice) : undefined,
            stock: stock !== undefined ? Number(stock) : undefined,
            category,
            hsnCode,
            description,
            highlights,
            ingredients,
            howToUse,
            images: cdnImages.length > 0 ? cdnImages : images,
            approvalStatus: resubmitForQc ? 'PENDING' : undefined,
        });
        if (!updated) {
            (0, response_1.sendError)(res, 404, 'Product not found');
            return;
        }
        (0, response_1.sendResponse)(res, 200, true, 'Product updated & resubmitted for QC review', { product: updated });
    }
    catch (error) {
        next(error);
    }
});
// 4. Delete product listing
router.delete('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await product_registry_1.ProductRegistry.deleteProduct(id);
        (0, response_1.sendResponse)(res, 200, true, 'Product listing deleted successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
