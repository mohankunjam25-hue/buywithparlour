import { CartModel } from './cart.model';
import { ProductModel } from '../products/product.model';
import { Types } from 'mongoose';

export class CartService {
  static async getCart(userId: string) {
    let cart = await CartModel.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = await CartModel.create({ user: userId, items: [] });
    }
    return cart;
  }

  static async addToCart(userId: string, productId: string, quantity: number, variantSku?: string) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock available (Only ${product.stock} left)`);
    }

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variantSku === variantSku
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ product: product._id as Types.ObjectId, quantity, variantSku });
    }

    await cart.save();
    return await cart.populate('items.product');
  }

  static async removeFromCart(userId: string, productId: string, variantSku?: string) {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.variantSku === variantSku)
    );

    await cart.save();
    return await cart.populate('items.product');
  }
}
