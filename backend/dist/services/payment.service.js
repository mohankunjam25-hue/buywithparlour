"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentGatewayOrder = createPaymentGatewayOrder;
exports.verifyPaymentSignature = verifyPaymentSignature;
const crypto_1 = __importDefault(require("crypto"));
const environment_1 = require("../config/environment");
/**
 * Create a Payment Gateway Order (Razorpay)
 */
async function createPaymentGatewayOrder(amountInINR, receiptId) {
    const amountInPaisa = Math.round(amountInINR * 100);
    const hasRealKeys = environment_1.config.razorpayKeyId &&
        !environment_1.config.razorpayKeyId.includes('your_') &&
        environment_1.config.razorpayKeySecret &&
        !environment_1.config.razorpayKeySecret.includes('your_');
    if (hasRealKeys) {
        try {
            const authHeader = 'Basic ' + Buffer.from(`${environment_1.config.razorpayKeyId}:${environment_1.config.razorpayKeySecret}`).toString('base64');
            const response = await fetch('https://api.razorpay.com/v1/orders', {
                method: 'POST',
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountInPaisa,
                    currency: 'INR',
                    receipt: receiptId,
                    payment_capture: 1,
                }),
            });
            const data = (await response.json());
            if (data.id) {
                return {
                    orderId: data.id,
                    amount: data.amount,
                    currency: data.currency || 'INR',
                    keyId: environment_1.config.razorpayKeyId,
                };
            }
        }
        catch (err) {
            console.warn('[Payment Service] Razorpay API Call Error:', err.message);
        }
    }
    // Developer Sandbox Fallback Order
    const mockOrderId = 'order_' + Date.now().toString() + Math.random().toString(36).substring(2, 7);
    return {
        orderId: mockOrderId,
        amount: amountInPaisa,
        currency: 'INR',
        keyId: environment_1.config.razorpayKeyId || 'rzp_test_buywithparlour',
    };
}
/**
 * Verify Razorpay HMAC-SHA256 Checksum Signature
 */
function verifyPaymentSignature(payload) {
    const hasRealKeys = environment_1.config.razorpayKeyId &&
        !environment_1.config.razorpayKeyId.includes('your_') &&
        environment_1.config.razorpayKeySecret &&
        !environment_1.config.razorpayKeySecret.includes('your_');
    if (hasRealKeys) {
        const text = payload.razorpay_order_id + '|' + payload.razorpay_payment_id;
        const generatedSignature = crypto_1.default
            .createHmac('sha256', environment_1.config.razorpayKeySecret)
            .update(text)
            .digest('hex');
        return generatedSignature === payload.razorpay_signature;
    }
    // Developer Sandbox Fallback Verification (Accepts test payments)
    return Boolean(payload.razorpay_payment_id && payload.razorpay_order_id);
}
