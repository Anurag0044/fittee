import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger.util';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 FITTEE Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🔗 Health Check: http://localhost:${env.PORT}/health`);
  logger.info(`🔗 API Prefix:   http://localhost:${env.PORT}${env.API_PREFIX}`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Gracefully shutting down FITTEE server...`);

  server.close(() => {
    logger.info('HTTP server closed successfully. Exiting process.');
    process.exit(0);
  });

  // Force close after 10 seconds if hanging connections persist
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
