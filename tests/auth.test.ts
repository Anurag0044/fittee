import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { AuthService } from '../src/services/auth.service';
import { AdminRole } from '@prisma/client';

describe('Admin Authentication & RBAC Middleware', () => {
  const app = createApp();
  let validToken: string;

  it('POST /api/v1/admin/auth/login should fail with 400 for malformed payload', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'not-an-email', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/v1/admin/auth/login should reject invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@fittee.in', password: 'WrongPassword123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid credentials');
  });

  it('POST /api/v1/admin/auth/login should succeed with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@fittee.in', password: 'Admin@Fittee2026' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe('admin@fittee.in');
    expect(res.body.data.user.role).toBe('SUPER_ADMIN');

    validToken = res.body.data.token;
  });

  it('GET /api/v1/admin/auth/me should reject unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/v1/admin/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/auth/me should succeed with valid JWT token', async () => {
    const res = await request(app)
      .get('/api/v1/admin/auth/me')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('admin@fittee.in');
    expect(res.body.data.role).toBe('SUPER_ADMIN');
  });

  it('AuthService should correctly sign and verify tokens for all admin roles', () => {
    const token = AuthService.generateToken({
      id: 'cust-cat-id',
      email: 'catalog@fittee.in',
      name: 'Catalog Manager',
      role: AdminRole.CATALOG_MGR,
    });

    const decoded = AuthService.verifyToken(token);
    expect(decoded.email).toBe('catalog@fittee.in');
    expect(decoded.role).toBe(AdminRole.CATALOG_MGR);
  });
});
