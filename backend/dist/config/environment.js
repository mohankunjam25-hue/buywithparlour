"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
exports.config = {
    port: parseInt(process.env.PORT || '8080', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/beauty_parlour_db',
    jwtSecret: process.env.JWT_SECRET || 'fallback_dev_access_secret_2026',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_dev_refresh_secret_2026',
    cookieSecret: process.env.COOKIE_SECRET || 'fallback_cookie_secret_2026',
    // Razorpay Online Payment Gateway Keys
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || process.env.PAYMENT_GATEWAY_KEY_ID || 'rzp_test_fallback',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_GATEWAY_KEY_SECRET || 'fallback_secret',
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
    // Google OAuth 2.0 Client Keys
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // Indian Banking & Verification API Keys
    verificationProvider: process.env.VERIFICATION_API_PROVIDER || 'cashfree',
    verificationClientId: process.env.VERIFICATION_CLIENT_ID || '',
    verificationClientSecret: process.env.VERIFICATION_CLIENT_SECRET || '',
    verificationSandboxMode: process.env.VERIFICATION_SANDBOX_MODE !== 'false',
    // Cloud Image Storage API Keys
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
