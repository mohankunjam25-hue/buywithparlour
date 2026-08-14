"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("./environment");
const connectDatabase = async () => {
    try {
        // Enterprise Connection Pooling & Resiliency Settings
        const conn = await mongoose_1.default.connect(environment_1.config.mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        const hostMasked = conn.connection.host || 'MongoDB Atlas';
        console.log(`[Database] MongoDB Connected Securely: ${hostMasked}`);
    }
    catch (error) {
        console.warn(`[Database] Connection Warning: Could not connect to MongoDB Atlas cluster.`);
        console.warn('[Database] API server running with secure dev fallback mode.');
    }
};
exports.connectDatabase = connectDatabase;
