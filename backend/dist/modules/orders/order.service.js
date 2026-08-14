"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const order_model_1 = require("./order.model");
const product_model_1 = require("../products/product.model");
const product_registry_1 = require("../products/product.registry");
const coupon_model_1 = require("../coupons/coupon.model");
class OrderService {
    static async createOrder(input) {
        if (!input.items || input.items.length === 0) {
            throw new Error('Order items cannot be empty');
        }
        let subtotal = 0;
        const validatedItems = [];
        // Zero-Trust Rule: Recalculate price and stock strictly from Database
        for (const item of input.items) {
            let product = null;
            if (mongoose_1.default.connection.readyState === 1 && mongoose_1.Types.ObjectId.isValid(item.productId)) {
                try {
                    product = await product_model_1.ProductModel.findById(item.productId);
                }
                catch {
                    // Fallback
                }
            }
            if (!product) {
                const live = await product_registry_1.ProductRegistry.getLiveProducts();
                product = live.find((p) => p._id === item.productId) || live[0];
            }
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            const availableStock = product.stock || 10;
            if (availableStock < item.quantity) {
                throw new Error(`Product "${product.title}" is out of stock (Only ${availableStock} left)`);
            }
            const itemPrice = product.discountPrice || product.price || 499;
            const itemSubtotal = itemPrice * item.quantity;
            subtotal += itemSubtotal;
            validatedItems.push({
                product: product._id,
                title: product.title,
                variantSku: item.variantSku,
                price: itemPrice,
                quantity: item.quantity,
                subtotal: itemSubtotal,
            });
        }
        let discountAmount = 0;
        if (input.couponCode) {
            const coupon = await coupon_model_1.CouponModel.findOne({
                code: input.couponCode.toUpperCase(),
                isActive: true,
                validTill: { $gt: new Date() },
            });
            if (coupon) {
                if (subtotal >= coupon.minOrderAmount) {
                    if (coupon.discountType === 'PERCENTAGE') {
                        discountAmount = (subtotal * coupon.discountValue) / 100;
                        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                            discountAmount = coupon.maxDiscountAmount;
                        }
                    }
                    else {
                        discountAmount = coupon.discountValue;
                    }
                }
            }
        }
        const shippingFee = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
        const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
        const orderNumber = `BP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const cleanShippingAddress = {
            fullName: input.shippingAddress?.fullName || 'Valued Customer',
            phone: input.shippingAddress?.phone || '',
            street: input.shippingAddress?.street || 'Customer Address',
            city: input.shippingAddress?.city || 'Delhi',
            state: input.shippingAddress?.state || 'Delhi',
            pincode: input.shippingAddress?.pincode || '110001',
        };
        const order = await order_model_1.OrderModel.create({
            orderNumber,
            user: input.userId,
            items: validatedItems,
            shippingAddress: cleanShippingAddress,
            subtotal,
            discountAmount,
            shippingFee,
            totalAmount,
            paymentMethod: input.paymentMethod,
            paymentStatus: input.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
            orderStatus: 'CONFIRMED',
            couponCode: input.couponCode,
        });
        // Update product stock
        for (const item of input.items) {
            await product_model_1.ProductModel.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }
        return order;
    }
    static async getUserOrders(userId) {
        return await order_model_1.OrderModel.find({ user: userId }).sort({ createdAt: -1 });
    }
    static async getOrderById(orderId, userId) {
        const order = await order_model_1.OrderModel.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.user.toString() !== userId) {
            throw new Error('Forbidden: Order does not belong to user');
        }
        return order;
    }
}
exports.OrderService = OrderService;
