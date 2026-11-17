import 'dotenv/config';

import app from './app.js';
import config from './config/index.js';
import { logger, pingDocker } from './shared/index.js';
import { stopContainersWatchService } from './modules/containers/index.js';

const SHUTDOWN_TIMEOUT_MS = 10000;

async function startServer() {
  try {
    logger.startup('Starting Brixwall server...');

    const server = app.listen(config.port, config.host, async () => {
      logger.success(`Server running on http://${config.host}:${config.port}`);
      logger.info(`🔍 Health Check: http://${config.host}:${config.port}/v1/health`);
      logger.info(`🌍 Environment: ${config.env}`);

      const dockerOnline = await pingDocker();
      if (dockerOnline) {
        logger.success(`Docker reachable at ${config.docker.socketPath}`);
      } else {
        logger.warn(`🐳 Docker not reachable at ${config.docker.socketPath}. Start Docker.`);
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

    const gracefulShutdown = (signal) => {
      logger.warn(`🛑 Received ${signal}, shutting down gracefully...`);

      stopContainersWatchService();

      server.close(() => {
        logger.success('HTTP server closed');
        process.exit(0);
      });
      server.closeAllConnections();

      setTimeout(() => {
        logger.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, SHUTDOWN_TIMEOUT_MS).unref();
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
