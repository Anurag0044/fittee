import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { AuthService } from '../src/services/auth.service';
import { OrderService } from '../src/services/order.service';
import { AdminRole, PaymentMethod } from '@prisma/client';

describe('Ekart Logistics, PDF Generation & Customer Viewing Dossier', () => {
  const app = createApp();
  let adminToken: string;
  let testOrderId: string;
  let testOrderNumber: string;

  beforeAll(async () => {
    // Generate valid Super Admin token
    adminToken = AuthService.generateToken({
      id: 'admin_test_operator',
      email: 'admin@fittee.in',
      name: 'Super Admin',
      role: AdminRole.SUPER_ADMIN,
    });

    // Seed test order for customer dossier inspection
    const { order } = await OrderService.createOrder({
      customer: {
        fullName: 'Birsa Bhagat',
        email: 'birsa.bhagat@example.com',
        phone: '+919876543210',
      },
      shippingAddress: {
        fullName: 'Birsa Bhagat',
        phone: '+919876543210',
        addressLine1: 'Hatia Chowk, Near Railway Station',
        addressLine2: 'House No. 52',
        landmark: 'Near Hatia Station',
        city: 'Ranchi',
        state: 'Jharkhand',
        pincode: '834003',
      },
      items: [
        {
          productId: 'sohrai-spirit',
          size: 'XL',
          colorName: 'Slate Teal',
          colorHex: '#2F4F4F',
          quantity: 1,
        },
      ],
      paymentMethod: PaymentMethod.COD,
    });

    testOrderId = order.id;
    testOrderNumber = order.orderNumber;
  });

  it('POST /api/v1/store/logistics/pincode-check should validate Indian pin serviceability', async () => {
    const res = await request(app)
      .post('/api/v1/store/logistics/pincode-check')
      .send({ pincode: '834002' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pincode).toBe('834002');
    expect(res.body.data.isServiceable).toBe(true);
    expect(res.body.data.state).toBe('Jharkhand');
    expect(res.body.data.estimatedDays).toBe(2);
  });

  it('POST /api/v1/store/logistics/pincode-check should reject invalid 5-digit pin with 400', async () => {
    const res = await request(app)
      .post('/api/v1/store/logistics/pincode-check')
      .send({ pincode: '12345' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/orders/:id should return complete customer viewing dossier', async () => {
    const res = await request(app)
      .get(`/api/v1/admin/orders/${testOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const order = res.body.data;
    expect(order.customerCode).toMatch(/^FIT-CUST-\d{4}$/);
    expect(order.customerName).toBe('Birsa Bhagat');
    expect(order.customerEmail).toBe('birsa.bhagat@example.com');
    expect(order.customerPhone).toBe('+919876543210');
    expect(order.shippingAddress.pincode).toBe('834003');
    expect(order.shippingAddress.isServiceable).toBe(true);
    expect(Array.isArray(order.items)).toBe(true);
    expect(Array.isArray(order.timeline)).toBe(true);
  });

  it('POST /api/v1/admin/orders/:id/notes should append operator internal note', async () => {
    const res = await request(app)
      .post(`/api/v1/admin/orders/${testOrderId}/notes`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ note: 'Customer called confirming landmark near Hatia Chowk.' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.internalNotes.length).toBeGreaterThan(0);
    expect(res.body.data.internalNotes[0]).toContain('Hatia Chowk');
  });

  it('POST /api/v1/admin/orders/:id/dispatch-ekart should book Ekart shipment and assign AWB', async () => {
    const res = await request(app)
      .post(`/api/v1/admin/orders/${testOrderId}/dispatch-ekart`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('Idempotency-Key', 'dispatch_test_key_001');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.awbNumber).toMatch(/^EKT-IND-\d{6}$/);
    expect(res.body.data.courierName).toBe('Ekart Logistics');

    const firstAwb = res.body.data.awbNumber;

    // Test Idempotency: Duplicate call should NOT generate a new AWB
    const duplicateRes = await request(app)
      .post(`/api/v1/admin/orders/${testOrderId}/dispatch-ekart`)
      .set('Authorization', `Bearer ${adminToken}`)
      .set('Idempotency-Key', 'dispatch_test_key_001');

    expect(duplicateRes.status).toBe(200);
    expect(duplicateRes.body.data.awbNumber).toBe(firstAwb);
    expect(duplicateRes.body.data.isDuplicateCall).toBe(true);
  });

  it('GET /api/v1/admin/orders/:id/label should stream 4x6" thermal PDF shipping label', async () => {
    const res = await request(app)
      .get(`/api/v1/admin/orders/${testOrderId}/label`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body.length).toBeGreaterThan(500); // Valid PDF binary
  });

  it('GET /api/v1/admin/orders/:id/invoice should stream formal GST Tax Invoice PDF', async () => {
    const res = await request(app)
      .get(`/api/v1/admin/orders/${testOrderId}/invoice`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body.length).toBeGreaterThan(500); // Valid PDF binary
  });

  it('POST /api/v1/admin/media/sign-upload should generate Cloudinary signed upload credentials', async () => {
    const res = await request(app)
      .post('/api/v1/admin/media/sign-upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ folder: 'fittee/products' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('signature');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(res.body.data).toHaveProperty('apiKey');
    expect(res.body.data).toHaveProperty('uploadUrl');
  });
});
