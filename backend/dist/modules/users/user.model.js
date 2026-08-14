"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
        type: String,
        enum: ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'],
        default: 'CUSTOMER',
    },
    isSellerVerified: { type: Boolean, default: false },
    businessName: { type: String, trim: true },
    addresses: [AddressSchema],
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
