"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndLoginGoogleUser = verifyAndLoginGoogleUser;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../modules/users/user.model");
const token_1 = require("../utils/token");
async function verifyAndLoginGoogleUser(googlePayload) {
    const { email, name } = googlePayload;
    const cleanEmail = email.toLowerCase().trim();
    let userId = 'google_' + Date.now();
    let userRole = 'CUSTOMER';
    let userName = name || 'Google Customer';
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            let dbUser = await user_model_1.UserModel.findOne({ email: cleanEmail });
            if (!dbUser) {
                dbUser = await user_model_1.UserModel.create({
                    name: userName,
                    email: cleanEmail,
                    passwordHash: 'GOOGLE_OAUTH_PROTECTED_USER',
                    role: 'CUSTOMER',
                    isEmailVerified: true,
                });
            }
            userId = dbUser._id.toString();
            userRole = dbUser.role;
            userName = dbUser.name;
        }
    }
    catch (err) {
        console.warn('[Google Auth Service] Database lookup fallback:', err.message);
    }
    const payload = {
        userId,
        role: userRole,
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    return {
        user: {
            id: userId,
            name: userName,
            email: cleanEmail,
            role: userRole,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}
