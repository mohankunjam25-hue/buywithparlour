"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const cart_model_1 = require("./cart.model");
const product_model_1 = require("../products/product.model");
class CartService {
    static async getCart(userId) {
        let cart = await cart_model_1.CartModel.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            cart = await cart_model_1.CartModel.create({ user: userId, items: [] });
        }
        return cart;
    }
    static async addToCart(userId, productId, quantity, variantSku) {
        const product = await product_model_1.ProductModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.stock < quantity) {
            throw new Error(`Insufficient stock available (Only ${product.stock} left)`);
        }
        let cart = await cart_model_1.CartModel.findOne({ user: userId });
        if (!cart) {
            cart = new cart_model_1.CartModel({ user: userId, items: [] });
        }
        const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.variantSku === variantSku);
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        }
        else {
            cart.items.push({ product: product._id, quantity, variantSku });
        }
        await cart.save();
        return await cart.populate('items.product');
    }
    static async removeFromCart(userId, productId, variantSku) {
        const cart = await cart_model_1.CartModel.findOne({ user: userId });
        if (!cart)
            throw new Error('Cart not found');
        cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.variantSku === variantSku));
        await cart.save();
        return await cart.populate('items.product');
    }
}
exports.CartService = CartService;
