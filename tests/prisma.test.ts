import { describe, it, expect } from 'vitest';
import { prisma } from '../src/config/prisma';

describe('Prisma Client & Model Definition Integrity', () => {
  it('should initialize Prisma Client singleton with all required model delegates', () => {
    expect(prisma).toBeDefined();
    expect(prisma.adminUser).toBeDefined();
    expect(prisma.customer).toBeDefined();
    expect(prisma.address).toBeDefined();
    expect(prisma.category).toBeDefined();
    expect(prisma.product).toBeDefined();
    expect(prisma.productVariant).toBeDefined();
    expect(prisma.productImage).toBeDefined();
    expect(prisma.order).toBeDefined();
    expect(prisma.orderItem).toBeDefined();
    expect(prisma.orderStatusTimeline).toBeDefined();
    expect(prisma.festiveBanner).toBeDefined();
    expect(prisma.journalPost).toBeDefined();
    expect(prisma.pageLockSetting).toBeDefined();
    expect(prisma.dailySiteMetric).toBeDefined();
    expect(prisma.customInquiry).toBeDefined();
    expect(prisma.newsletterSubscriber).toBeDefined();
    expect(prisma.auditLog).toBeDefined();
  });
});
