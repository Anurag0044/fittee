import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from '../utils/logger.util';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isDev ? ['warn', 'error'] : ['error'],
  });

if (env.isDev) {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info(' Connected to Neon PostgreSQL database');
    return true;
  } catch (error) {
    logger.warn(' Database connection failed (running with mock fallback / offline mode):', error);
    return false;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info(' Disconnected from database');
};

let isDatabaseAvailable: boolean | null = null;

export const withDbFallback = async <T>(
  dbQuery: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> => {
  if (isDatabaseAvailable === false) {
    return await fallback();
  }

  try {
    const queryPromise = dbQuery();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DB_TIMEOUT')), 500)
    );
    const result = await Promise.race([queryPromise, timeoutPromise]);
    isDatabaseAvailable = true;
    return result;
  } catch {
    isDatabaseAvailable = false;
    return await fallback();
  }
};

