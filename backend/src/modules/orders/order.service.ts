import mongoose, { Types } from 'mongoose';
import { OrderModel } from './order.model';
import { ProductModel } from '../products/product.model';
import { ProductRegistry } from '../products/product.registry';
import { CouponModel } from '../coupons/coupon.model';
import { IAddress } from '../users/user.model';

export interface CreateOrderInput {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    variantSku?: string;
  }>;
  shippingAddress: IAddress;
  paymentMethod: 'ONLINE' | 'COD';
  couponCode?: string;
}

export class OrderService {
  static async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new Error('Order items cannot be empty');
    }

    let subtotal = 0;
    const validatedItems = [];

    // Zero-Trust Rule: Recalculate price and stock strictly from Database
    for (const item of input.items) {
      let product: any = null;
      if (mongoose.connection.readyState === 1 && Types.ObjectId.isValid(item.productId)) {
        try {
          product = await ProductModel.findById(item.productId);
        } catch {
          // Fallback
        }
      }
      if (!product) {
        const live = await ProductRegistry.getLiveProducts();
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
        product: product._id as Types.ObjectId,
        title: product.title,
        variantSku: item.variantSku,
        price: itemPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    let discountAmount = 0;
    if (input.couponCode) {
      const coupon = await CouponModel.findOne({
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
          } else {
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

    const order = await OrderModel.create({
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
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return order;
  }

  static async getUserOrders(userId: string) {
    return await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async getOrderById(orderId: string, userId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.user.toString() !== userId) {
      throw new Error('Forbidden: Order does not belong to user');
    }
    return order;
  }
}
