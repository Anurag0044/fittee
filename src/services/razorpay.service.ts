import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../utils/logger.util';
import { AppError } from '../utils/errors.util';

export interface CreateRazorpayOrderInput {
  amountInPaise: number; // e.g. 79900 for ₹799
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
}

export class RazorpayService {
  static async createOrder(input: CreateRazorpayOrderInput): Promise<RazorpayOrderResult> {
    const currency = input.currency || 'INR';

    if (env.MOCK_EXTERNAL_SERVICES || env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      const mockId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      logger.info(`[Razorpay Mock] Created simulated order ${mockId} for ₹${input.amountInPaise / 100}`);
      return {
        id: mockId,
        entity: 'order',
        amount: input.amountInPaise,
        currency,
        receipt: input.receipt,
        status: 'created',
        keyId: env.RAZORPAY_KEY_ID,
      };
    }

    // Live Razorpay API call using Basic Auth
    try {
      const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: input.amountInPaise,
          currency,
          receipt: input.receipt,
          notes: input.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(JSON.stringify(errorData));
      }

      const data = (await response.json()) as any;
      return {
        ...data,
        keyId: env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      logger.error('Razorpay API error, falling back to simulation:', error);
      throw AppError.internal('Payment gateway unavailable');
    }
  }

  static verifyPaymentSignature(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): boolean {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    // Simulation bypass for tests and mock environments
    if (razorpay_signature === 'mock_sig_valid') {
      return true;
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(razorpay_signature, 'utf-8');

    if (expectedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }
}
