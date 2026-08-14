"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const environment_1 = require("./config/environment");
const database_1 = require("./config/database");
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app_1.default.listen(environment_1.config.port, () => {
            console.log(`[Server] Beauty Parlour API running on port ${environment_1.config.port} in ${environment_1.config.nodeEnv} mode`);
        });
    }
    catch (error) {
        console.error('[Server] Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
