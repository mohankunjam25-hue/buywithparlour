"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("./user.model");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const password_1 = require("../../utils/password");
const response_1 = require("../../utils/response");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// 1. Update Profile (Name, Phone)
router.put('/profile', async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const userId = req.user.userId;
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            (0, response_1.sendError)(res, 404, 'User not found');
            return;
        }
        if (name && name.trim().length >= 2)
            user.name = name.trim();
        if (phone !== undefined)
            user.phone = phone.trim() || undefined;
        await user.save();
        (0, response_1.sendResponse)(res, 200, true, 'Profile updated successfully', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// 2. Add New Address
router.post('/addresses', async (req, res, next) => {
    try {
        const { fullName, phone, street, city, state, pincode, isDefault } = req.body;
        const userId = req.user.userId;
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            (0, response_1.sendError)(res, 404, 'User not found');
            return;
        }
        if (!street || !city || !state || !pincode) {
            (0, response_1.sendError)(res, 400, 'Street, City, State, and Pincode are required.');
            return;
        }
        const newAddress = {
            fullName: fullName?.trim() || user.name,
            phone: phone?.trim() || user.phone || '9876543210',
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            isDefault: Boolean(isDefault),
        };
        if (isDefault) {
            user.addresses.forEach((a) => (a.isDefault = false));
        }
        user.addresses.push(newAddress);
        await user.save();
        (0, response_1.sendResponse)(res, 201, true, 'Address added successfully', {
            addresses: user.addresses,
        });
    }
    catch (error) {
        next(error);
    }
});
// 3. Delete Address
router.delete('/addresses/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            (0, response_1.sendError)(res, 404, 'User not found');
            return;
        }
        user.addresses = user.addresses.filter((a) => a._id?.toString() !== id && a.id !== id);
        await user.save();
        (0, response_1.sendResponse)(res, 200, true, 'Address deleted successfully', {
            addresses: user.addresses,
        });
    }
    catch (error) {
        next(error);
    }
});
// 4. Change Password
router.put('/change-password', async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;
        if (!oldPassword || !newPassword || newPassword.length < 6) {
            (0, response_1.sendError)(res, 400, 'New password must be at least 6 characters.');
            return;
        }
        const user = await user_model_1.UserModel.findById(userId);
        if (!user) {
            (0, response_1.sendError)(res, 404, 'User not found');
            return;
        }
        const isMatch = await (0, password_1.comparePassword)(oldPassword, user.passwordHash);
        if (!isMatch) {
            (0, response_1.sendError)(res, 400, 'Incorrect current password.');
            return;
        }
        user.passwordHash = await (0, password_1.hashPassword)(newPassword);
        await user.save();
        (0, response_1.sendResponse)(res, 200, true, 'Password changed successfully');
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
