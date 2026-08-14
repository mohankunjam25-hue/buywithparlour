import mongoose from 'mongoose';
import { UserModel, IUser } from '../users/user.model';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/token';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string; // Optional
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * User Registration (Name, Email, Password required; Phone optional)
   */
  static async register(input: RegisterInput) {
    if (!input.name || input.name.trim().length < 2) {
      throw new Error('Full Name must be at least 2 characters.');
    }
    if (!input.email || !input.email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!input.password || input.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const cleanEmail = input.email.toLowerCase().trim();
    const cleanPhone = input.phone?.trim() || undefined;

    if (mongoose.connection.readyState === 1) {
      const existingUser = await UserModel.findOne({ email: cleanEmail });
      if (existingUser) {
        throw new Error('Email is already registered. Please log in.');
      }

      const passwordHash = await hashPassword(input.password);

      const newUser = await UserModel.create({
        name: input.name.trim(),
        email: cleanEmail,
        passwordHash,
        phone: cleanPhone,
        role: 'CUSTOMER',
      });

      const accessToken = generateAccessToken({ userId: newUser._id.toString(), role: newUser.role });
      const refreshToken = generateRefreshToken({ userId: newUser._id.toString(), role: newUser.role });

      return { user: this.sanitizeUser(newUser), accessToken, refreshToken };
    }

    // Dev Fallback
    const devUserId = new mongoose.Types.ObjectId().toHexString();
    const accessToken = generateAccessToken({ userId: devUserId, role: 'CUSTOMER' });
    const refreshToken = generateRefreshToken({ userId: devUserId, role: 'CUSTOMER' });

    return {
      user: {
        id: devUserId,
        name: input.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: 'CUSTOMER' as const,
        addresses: [],
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * User Login (Email & Password)
   */
  static async login(input: LoginInput) {
    if (!input.email || !input.password) {
      throw new Error('Please provide both email and password.');
    }

    const cleanEmail = input.email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ email: cleanEmail });
      if (!user) {
        throw new Error('Invalid email or password.');
      }

      const isMatch = await comparePassword(input.password, user.passwordHash);
      if (!isMatch) {
        throw new Error('Invalid email or password.');
      }

      const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

      return { user: this.sanitizeUser(user), accessToken, refreshToken };
    }

    // Dev Fallback
    const devUserId = new mongoose.Types.ObjectId().toHexString();
    const accessToken = generateAccessToken({ userId: devUserId, role: 'CUSTOMER' });
    const refreshToken = generateRefreshToken({ userId: devUserId, role: 'CUSTOMER' });

    return {
      user: {
        id: devUserId,
        name: 'Demo Customer',
        email: cleanEmail,
        phone: '9876543210',
        role: 'CUSTOMER' as const,
        addresses: [],
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Token Refresh
   */
  static async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Refresh token missing');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ userId: decoded.userId, role: decoded.role });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId, role: decoded.role });

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Strip sensitive fields from user object before sending to client
   */
  static sanitizeUser(user: IUser) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
      addresses: user.addresses || [],
    };
  }
}
