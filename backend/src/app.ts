import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import { globalLimiter } from './middleware/rateLimit.middleware';
import { noSqlSanitizer } from './middleware/sanitize.middleware';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes/index';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(globalLimiter);

// Body Parsers (Increased to 50mb to support multi-photo product uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// NoSQL Query & Input Sanitizer (Prevents MongoDB operator injection)
app.use(noSqlSanitizer);

// Welcome / Status Root Endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'BuyWithParlour E-Commerce API',
    version: '1.0.0',
    message: 'Backend server is running live and connected to MongoDB Atlas! 🚀',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/health',
    },
  });
});

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'BuyWithParlour E-Commerce API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Primary API Routes
app.use('/api', routes);

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
