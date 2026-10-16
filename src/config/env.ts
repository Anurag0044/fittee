import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8000),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3001,https://fittee.in,https://admin.fittee.in'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  MOCK_EXTERNAL_SERVICES: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .default(true),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_secret_placeholder'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('rzp_webhook_secret_placeholder'),
  EKART_MERCHANT_CODE: z.string().default('FITTEE_MOCK_MERCHANT'),
  EKART_ACCESS_TOKEN: z.string().default('ekart_mock_token_placeholder'),
  EKART_BASE_URL: z.string().default('https://api.ekartlogistics.com'),
  EKART_HMAC_SECRET: z.string().default('ekart_mock_hmac_placeholder'),
  CLOUDINARY_CLOUD_NAME: z.string().default('fittee-mock'),
  CLOUDINARY_API_KEY: z.string().default('mock_cloudinary_key'),
  CLOUDINARY_API_SECRET: z.string().default('mock_cloudinary_secret'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOriginsList: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  isDev: parsed.data.NODE_ENV === 'development',
  isProd: parsed.data.NODE_ENV === 'production',
  isTest: parsed.data.NODE_ENV === 'test',
};
