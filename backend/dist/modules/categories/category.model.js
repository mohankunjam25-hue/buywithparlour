"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    parentCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });
exports.CategoryModel = (0, mongoose_1.model)('Category', CategorySchema);
