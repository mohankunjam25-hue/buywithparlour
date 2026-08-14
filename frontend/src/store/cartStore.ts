import { create } from 'zustand';
import { Product } from '../types/index.js';

export interface LocalCartItem {
  product: Product;
  quantity: number;
  variantSku?: string;
}

interface CartStore {
  items: LocalCartItem[];
  addToCart: (product: Product, quantity?: number, variantSku?: string) => void;
  removeFromCart: (productId: string, variantSku?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantSku?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (product, quantity = 1, variantSku) => {
    const maxLimit = Math.min(10, product.stock || 10);
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.product._id === product._id && i.variantSku === variantSku
      );
      if (existingIndex > -1) {
        const updated = [...state.items];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(maxLimit, Math.max(1, newQty));
        return { items: updated };
      }
      return { items: [...state.items, { product, quantity: Math.min(maxLimit, Math.max(1, quantity)), variantSku }] };
    });
  },
  removeFromCart: (productId, variantSku) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product._id === productId && i.variantSku === variantSku)
      ),
    }));
  },
  updateQuantity: (productId, quantity, variantSku) => {
    set((state) => ({
      items: state.items.map((i) => {
        if (i.product._id === productId && i.variantSku === variantSku) {
          const maxLimit = Math.min(10, i.product.stock || 10);
          return { ...i, quantity: Math.min(maxLimit, Math.max(1, quantity)) };
        }
        return i;
      }),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getSubtotal: () =>
    get().items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0),
}));
