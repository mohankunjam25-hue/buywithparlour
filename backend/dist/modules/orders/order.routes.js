"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_model_1 = require("./order.model");
const order_service_1 = require("./order.service");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const payment_service_1 = require("../../services/payment.service");
const response_1 = require("../../utils/response");
const router = (0, express_1.Router)();
// PUBLIC PAYMENT ENDPOINTS (Allows guest & logged-in checkout)
router.post('/payment/create-order', async (req, res, next) => {
    try {
        const { amount, receipt } = req.body;
        if (!amount) {
            (0, response_1.sendError)(res, 400, 'Amount in INR is required.');
            return;
        }
        const orderData = await (0, payment_service_1.createPaymentGatewayOrder)(amount, receipt || `receipt_${Date.now()}`);
        (0, response_1.sendResponse)(res, 200, true, 'Payment Order Created', { paymentOrder: orderData });
    }
    catch (error) {
        next(error);
    }
});
router.post('/payment/verify', async (req, res, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const isValid = (0, payment_service_1.verifyPaymentSignature)({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        });
        if (!isValid) {
            (0, response_1.sendError)(res, 400, 'Invalid payment signature. Payment verification failed.');
            return;
        }
        (0, response_1.sendResponse)(res, 200, true, '✨ Payment Verified Successfully!', {
            paymentStatus: 'PAID',
            paymentId: razorpay_payment_id,
        });
    }
    catch (error) {
        next(error);
    }
});
// PUBLIC ORDER TRACKING & COURIER STATUS ENDPOINT
router.post('/track', async (req, res, next) => {
    try {
        const { orderNumber } = req.body;
        if (!orderNumber || typeof orderNumber !== 'string') {
            (0, response_1.sendError)(res, 400, 'Order Number (e.g. BP-...) is required.');
            return;
        }
        const cleanOrderNumber = orderNumber.trim();
        let order = await order_model_1.OrderModel.findOne({ orderNumber: cleanOrderNumber });
        if (!order && cleanOrderNumber.startsWith('BP-')) {
            // Check case-insensitively
            order = await order_model_1.OrderModel.findOne({ orderNumber: new RegExp(`^${cleanOrderNumber}$`, 'i') });
        }
        if (!order) {
            (0, response_1.sendError)(res, 404, `No active parcel found for Order ID: ${cleanOrderNumber}. Please check the Order ID.`);
            return;
        }
        const createdAt = order.createdAt || new Date();
        const orderDate = new Date(createdAt);
        const edd = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
        const trackingPayload = {
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus || 'CONFIRMED',
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            placedAt: orderDate.toISOString(),
            estimatedDelivery: edd.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
            carrier: 'Delhivery Express Logistics',
            awbNumber: `DEL${order.orderNumber.replace(/[^0-9]/g, '').slice(-9)}IN`,
            currentHub: order.orderStatus === 'DELIVERED'
                ? 'Delivered to Customer Doorstep'
                : order.orderStatus === 'SHIPPED'
                    ? 'In Transit - Out for Regional Delivery Hub'
                    : order.orderStatus === 'PACKED'
                        ? 'Packed & Handed to Courier at Delhi Dispatch Hub'
                        : 'Order Verified - Processing at Cosmetic Fulfillment Center',
            destination: {
                city: order.shippingAddress?.city || 'Delhi',
                state: order.shippingAddress?.state || 'Delhi',
                pincode: order.shippingAddress?.pincode || '110001',
            },
            items: order.items.map((it) => ({
                title: it.title,
                quantity: it.quantity,
                price: it.price,
                subtotal: it.subtotal,
            })),
            timeline: [
                {
                    stage: 'CONFIRMED',
                    title: 'Order Placed & Verified',
                    desc: 'Payment confirmed & inventory reserved.',
                    timestamp: orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    completed: true,
                },
                {
                    stage: 'PACKED',
                    title: 'Quality Checked & Packed',
                    desc: 'Sealed with tamper-evident security tape.',
                    timestamp: 'Expected within 12 Hours',
                    completed: order.orderStatus === 'PACKED' || order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED',
                },
                {
                    stage: 'SHIPPED',
                    title: 'In Transit with Courier',
                    desc: 'Scanned at Delhi Logistics Hub (AWB assigned).',
                    timestamp: 'Express Surface Transit',
                    completed: order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED',
                },
                {
                    stage: 'DELIVERED',
                    title: 'Delivered to Recipient',
                    desc: 'Handed over with signature verification.',
                    timestamp: 'Expected by ' + edd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    completed: order.orderStatus === 'DELIVERED',
                },
            ],
        };
        (0, response_1.sendResponse)(res, 200, true, 'Live shipment tracking fetched', { tracking: trackingPayload });
    }
    catch (error) {
        next(error);
    }
});
// AUTHENTICATED ORDER ENDPOINTS
router.use(auth_middleware_1.authenticate);
router.post('/', async (req, res, next) => {
    try {
        const order = await order_service_1.OrderService.createOrder({
            userId: req.user.userId,
            items: req.body.items,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            couponCode: req.body.couponCode,
        });
        (0, response_1.sendResponse)(res, 201, true, 'Order created successfully', { order });
    }
    catch (error) {
        if (error instanceof Error && (error.message.includes('out of stock') || error.message.includes('empty'))) {
            (0, response_1.sendError)(res, 400, error.message);
            return;
        }
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const orders = await order_service_1.OrderService.getUserOrders(req.user.userId);
        (0, response_1.sendResponse)(res, 200, true, 'User orders fetched', { orders });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const order = await order_service_1.OrderService.getOrderById(req.params.id, req.user.userId);
        (0, response_1.sendResponse)(res, 200, true, 'Order details fetched', { order });
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('Forbidden')) {
            (0, response_1.sendError)(res, 403, error.message);
            return;
        }
        next(error);
    }
});
// Update Order & Courier Status (CONFIRMED -> PACKED -> SHIPPED -> DELIVERED)
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            (0, response_1.sendError)(res, 400, `Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
            return;
        }
        const order = await order_model_1.OrderModel.findById(req.params.id);
        if (!order) {
            (0, response_1.sendError)(res, 404, 'Order not found');
            return;
        }
        order.orderStatus = status;
        if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
            order.paymentStatus = 'PAID';
        }
        await order.save();
        (0, response_1.sendResponse)(res, 200, true, `Order status updated to ${status}`, { order });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
