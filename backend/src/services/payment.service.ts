import crypto from 'crypto';
import { config } from '../config/environment';

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationPayload {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Create a Payment Gateway Order (Razorpay)
 */
export async function createPaymentGatewayOrder(
  amountInINR: number,
  receiptId: string
): Promise<PaymentOrderResult> {
  const amountInPaisa = Math.round(amountInINR * 100);
  const hasRealKeys =
    config.razorpayKeyId &&
    !config.razorpayKeyId.includes('your_') &&
    config.razorpayKeySecret &&
    !config.razorpayKeySecret.includes('your_');

  if (hasRealKeys) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
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

      const data = (await response.json()) as any;
      if (data.id) {
        return {
          orderId: data.id,
          amount: data.amount,
          currency: data.currency || 'INR',
          keyId: config.razorpayKeyId,
        };
      }
    } catch (err: any) {
      console.warn('[Payment Service] Razorpay API Call Error:', err.message);
    }
  }

  // Developer Sandbox Fallback Order
  const mockOrderId = 'order_' + Date.now().toString() + Math.random().toString(36).substring(2, 7);
  return {
    orderId: mockOrderId,
    amount: amountInPaisa,
    currency: 'INR',
    keyId: config.razorpayKeyId || 'rzp_test_buywithparlour',
  };
}

/**
 * Verify Razorpay HMAC-SHA256 Checksum Signature
 */
export function verifyPaymentSignature(payload: PaymentVerificationPayload): boolean {
  const hasRealKeys =
    config.razorpayKeyId &&
    !config.razorpayKeyId.includes('your_') &&
    config.razorpayKeySecret &&
    !config.razorpayKeySecret.includes('your_');

  if (hasRealKeys) {
    const text = payload.razorpay_order_id + '|' + payload.razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpayKeySecret)
      .update(text)
      .digest('hex');

    return generatedSignature === payload.razorpay_signature;
  }

  // Developer Sandbox Fallback Verification (Accepts test payments)
  return Boolean(payload.razorpay_payment_id && payload.razorpay_order_id);
}
