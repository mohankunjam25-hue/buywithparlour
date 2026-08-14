import { Schema, model, Document } from 'mongoose';

export interface IAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  isSellerVerified?: boolean;
  businessName?: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'CUSTOMER',
    },
    isSellerVerified: { type: Boolean, default: false },
    businessName: { type: String, trim: true },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);
