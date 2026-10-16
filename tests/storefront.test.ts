import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('Storefront Customer APIs', () => {
  const app = createApp();

  it('GET /api/v1/store/products should return list of products matching frontend Product contract', async () => {
    const res = await request(app).get('/api/v1/store/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('products');
    expect(Array.isArray(res.body.data.products)).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);

    const first = res.body.data.products[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('fit');
    expect(first).toHaveProperty('price');
    expect(first).toHaveProperty('image');
    expect(Array.isArray(first.colors)).toBe(true);
  });

  it('GET /api/v1/store/products with ?fit=oversized should filter results', async () => {
    const res = await request(app).get('/api/v1/store/products?fit=oversized');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    for (const p of res.body.data.products) {
      expect(p.fit).toContain('Oversized');
    }
  });

  it('GET /api/v1/store/products/:slug should return complete PDP details', async () => {
    const res = await request(app).get('/api/v1/store/products/sohrai-spirit');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('sohrai-spirit');
    expect(res.body.data).toHaveProperty('artworkStory');
    expect(res.body.data).toHaveProperty('fabricDetails');
    expect(res.body.data).toHaveProperty('variants');
    expect(res.body.data).toHaveProperty('images');
  });

  it('GET /api/v1/store/products/non-existent-product should return 404', async () => {
    const res = await request(app).get('/api/v1/store/products/non-existent-product');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/store/categories should return active categories sorted by order', async () => {
    const res = await request(app).get('/api/v1/store/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].displayOrder).toBeLessThanOrEqual(res.body.data[1]?.displayOrder || 999);
  });

  it('GET /api/v1/store/festive-banners should return active sales banners', async () => {
    const res = await request(app).get('/api/v1/store/festive-banners');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/store/journal should return published articles', async () => {
    const res = await request(app).get('/api/v1/store/journal');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('articles');
    expect(Array.isArray(res.body.data.articles)).toBe(true);
  });

  it('GET /api/v1/store/journal/:slug should return article with shoppable products', async () => {
    const res = await request(app).get('/api/v1/store/journal/living-lines-of-sohrai');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('living-lines-of-sohrai');
    expect(res.body.data).toHaveProperty('taggedProducts');
  });

  it('POST /api/v1/store/custom-inquiries should capture valid design submissions', async () => {
    const res = await request(app)
      .post('/api/v1/store/custom-inquiries')
      .send({
        customerEmail: 'artisan.enthusiast@example.com',
        styleChoice: 'sohrai',
        garmentChoice: 'oversized',
        placementChoice: 'back',
        customPrompt: 'Create a soaring peacock mural with tribal sun rays on the back.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('POST /api/v1/store/custom-inquiries should reject malformed payload with 400', async () => {
    const res = await request(app)
      .post('/api/v1/store/custom-inquiries')
      .send({
        customerEmail: 'invalid-email',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/store/newsletter/subscribe should save subscriber email', async () => {
    const res = await request(app)
      .post('/api/v1/store/newsletter/subscribe')
      .send({ email: 'tribal.fashion.fan@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('tribal.fashion.fan@example.com');
  });

  it('GET /api/v1/store/maintenance-status should return ultra-fast status for edge middleware', async () => {
    const res = await request(app).get('/api/v1/store/maintenance-status?path=/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('isLocked');
  });
});
