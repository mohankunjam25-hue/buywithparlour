import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // 5000 requests per 15 min for seamless multi-tab e-commerce browsing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 min for auth/payment
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many sensitive requests from this IP, please try again later.',
  },
});
