"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const VariantSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
});
const ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    description: { type: String, required: true },
    ingredients: { type: String },
    howToUse: { type: String },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    approvalStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
        index: true,
    },
    rejectionReason: { type: String },
    isPublished: { type: Boolean, default: false, index: true },
    variants: [VariantSchema],
}, { timestamps: true });
ProductSchema.index({ title: 'text', brand: 'text', description: 'text' });
exports.ProductModel = (0, mongoose_1.model)('Product', ProductSchema);
