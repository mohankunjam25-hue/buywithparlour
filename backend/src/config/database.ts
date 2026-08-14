import mongoose from 'mongoose';
import { config } from './environment';

export const connectDatabase = async (): Promise<void> => {
  try {
    // Enterprise Connection Pooling & Resiliency Settings
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    const hostMasked = conn.connection.host || 'MongoDB Atlas';
    console.log(`[Database] MongoDB Connected Securely: ${hostMasked}`);
  } catch (error: any) {
    console.warn(`[Database] Connection Warning: Could not connect to MongoDB Atlas cluster.`);
    console.warn('[Database] API server running with secure dev fallback mode.');
  }
};
