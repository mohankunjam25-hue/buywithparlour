"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_2 = require("./config/cors");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const sanitize_middleware_1 = require("./middleware/sanitize.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(rateLimit_middleware_1.globalLimiter);
// Body Parsers (Increased to 50mb to support multi-photo product uploads)
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// NoSQL Query & Input Sanitizer (Prevents MongoDB operator injection)
app.use(sanitize_middleware_1.noSqlSanitizer);
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
app.use('/api', index_1.default);
// Global Centralized Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
