export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface ProductVariant {
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  category: { _id: string; name: string; slug: string };
  description: string;
  ingredients?: string;
  highlights?: string[];
  howToUse?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  variantSku?: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}
