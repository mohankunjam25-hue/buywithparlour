"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const verification_service_1 = require("../../services/verification.service");
const response_1 = require("../../utils/response");
const user_model_1 = require("./user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// 1. Verify Bank Account (Penny Drop ₹1 Test API)
router.post('/verify-bank', async (req, res, next) => {
    try {
        const { accountNumber, ifsc, holderName } = req.body;
        if (!accountNumber || !ifsc) {
            (0, response_1.sendError)(res, 400, 'Account Number and IFSC Code are required.');
            return;
        }
        const result = await (0, verification_service_1.verifyBankAccount)(accountNumber, ifsc, holderName);
        if (!result.verified) {
            (0, response_1.sendError)(res, 400, result.message, result);
            return;
        }
        (0, response_1.sendResponse)(res, 200, true, result.message, { verification: result });
    }
    catch (error) {
        next(error);
    }
});
// 2. Verify GSTIN Document
router.post('/verify-gstin', async (req, res, next) => {
    try {
        const { gstin } = req.body;
        if (!gstin) {
            (0, response_1.sendError)(res, 400, 'GSTIN Number is required.');
            return;
        }
        const result = await (0, verification_service_1.verifyGstin)(gstin);
        if (!result.verified) {
            (0, response_1.sendError)(res, 400, result.message, result);
            return;
        }
        (0, response_1.sendResponse)(res, 200, true, result.message, { verification: result });
    }
    catch (error) {
        next(error);
    }
});
// 3. Complete Mandatory Seller Business Onboarding & Unlock Dashboard
router.post('/complete', async (req, res, _next) => {
    try {
        const { businessName, phone, accountNumber, ifsc } = req.body;
        if (!businessName || !phone || !accountNumber || !ifsc) {
            (0, response_1.sendError)(res, 400, 'Please complete all required onboarding fields (*).');
            return;
        }
        if (mongoose_1.default.connection.readyState === 1) {
            await user_model_1.UserModel.findByIdAndUpdate(req.user.userId, {
                businessName,
                phone,
                isSellerVerified: true,
                isKycCompleted: true,
                kycStatus: 'VERIFIED',
            });
        }
        (0, response_1.sendResponse)(res, 200, true, '🎉 Seller Business Onboarding & KYC Completed! Studio Dashboard Unlocked.', {
            isKycCompleted: true,
            businessName,
        });
    }
    catch (error) {
        (0, response_1.sendError)(res, 500, 'Failed to complete seller onboarding', error);
    }
});
exports.default = router;
