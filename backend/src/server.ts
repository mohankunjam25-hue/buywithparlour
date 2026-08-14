import app from './app';
import { config } from './config/environment';
import { connectDatabase } from './config/database';

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`[Server] Beauty Parlour API running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
