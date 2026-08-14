import mongoose from 'mongoose';
import { UserModel } from '../modules/users/user.model';
import { generateAccessToken, generateRefreshToken } from '../utils/token';

export interface GoogleUserPayload {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

export async function verifyAndLoginGoogleUser(googlePayload: GoogleUserPayload) {
  const { email, name } = googlePayload;
  const cleanEmail = email.toLowerCase().trim();

  let userId = 'google_' + Date.now();
  let userRole: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN' = 'CUSTOMER';
  let userName = name || 'Google Customer';

  try {
    if (mongoose.connection.readyState === 1) {
      let dbUser = await UserModel.findOne({ email: cleanEmail });

      if (!dbUser) {
        dbUser = await UserModel.create({
          name: userName,
          email: cleanEmail,
          passwordHash: 'GOOGLE_OAUTH_PROTECTED_USER',
          role: 'CUSTOMER',
          isEmailVerified: true,
        });
      }

      userId = dbUser._id.toString();
      userRole = dbUser.role;
      userName = dbUser.name;
    }
  } catch (err: any) {
    console.warn('[Google Auth Service] Database lookup fallback:', err.message);
  }

  const payload = {
    userId,
    role: userRole,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: userId,
      name: userName,
      email: cleanEmail,
      role: userRole,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}
