import { Schema, model, Document, Types } from 'mongoose';

export interface IProductVariant {
  name: string; // e.g. "50ml", "Shade 01 Red", "Standard"
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  brand: string;
  seller?: Types.ObjectId;
  category: Types.ObjectId;
  description: string;
  ingredients?: string;
  howToUse?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  isPublished: boolean;
  variants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, min: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    description: { type: String, required: true },
    ingredients: { type: String },
    howToUse: { type: String },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: { type: String },
    isPublished: { type: Boolean, default: false, index: true },
    variants: [VariantSchema],
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', brand: 'text', description: 'text' });

export const ProductModel = model<IProduct>('Product', ProductSchema);
