import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { AuthService } from '../src/services/auth.service';
import { AdminRole } from '@prisma/client';

describe('The 7 Admin Control Center Modules & Analytics', () => {
  const app = createApp();
  let adminToken: string;

  beforeAll(() => {
    adminToken = AuthService.generateToken({
      id: 'admin_test_superadmin',
      email: 'admin@fittee.in',
      name: 'Super Admin',
      role: AdminRole.SUPER_ADMIN,
    });
  });

  // Module 1: Dashboard Analytics & Rolling MAU
  it('GET /api/v1/admin/analytics/dashboard should return complete analytics metrics', async () => {
    const res = await request(app)
      .get('/api/v1/admin/analytics/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const data = res.body.data;
    expect(data).toHaveProperty('rollingMau');
    expect(data).toHaveProperty('dau');
    expect(data).toHaveProperty('stickinessRatio');
    expect(data).toHaveProperty('grossRevenueThisMonth');
    expect(Array.isArray(data.historicalMau)).toBe(true);
    expect(Array.isArray(data.regionalDistribution)).toBe(true);
    expect(data.orderPipelineCounts).toHaveProperty('PLACED');
  });

  // Module 2: Festive Banners CRUD & Toggle
  it('Banners API: List, Create & Toggle Banner', async () => {
    // 1. List
    const listRes = await request(app)
      .get('/api/v1/admin/banners')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    // 2. Create
    const createRes = await request(app)
      .post('/api/v1/admin/banners')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        campaignName: 'Sarhul Spring Festival Sale',
        slot: 'HERO_BANNER',
        headline: 'Embrace the Sarna Bloom with 20% Off',
        ctaText: 'Discover Sarhul Collection',
        priority: 2,
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.campaignName).toBe('Sarhul Spring Festival Sale');

    const createdId = createRes.body.data.id;

    // 3. Toggle Kill-Switch
    const toggleRes = await request(app)
      .patch(`/api/v1/admin/banners/${createdId}/toggle`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.data.isActive).toBe(false);
  });

  // Module 3: Cultural Journal CMS
  it('Journal CMS API: List & Create Article', async () => {
    const createRes = await request(app)
      .post('/api/v1/admin/journal')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Weaving the Sacred Karam: Symbols of Unity',
        slug: 'weaving-sacred-karam',
        excerpt: 'An exploration of seasonal karma rituals transformed into embroidery.',
        body: 'During the vibrant autumn Karam festival, indigenous communities venerate the Karam bough. This sacred bond with nature inspired our latest heavyweight tee.',
        coverImage: '/images/products/karam-rhythm.jpg',
        authorName: 'FITTEE Artisan Collective',
        categoryTags: ['Karam', 'Tribal Rituals'],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.title).toBe('Weaving the Sacred Karam: Symbols of Unity');
    expect(createRes.body.data.readingTimeMinutes).toBeGreaterThan(0);

    const listRes = await request(app)
      .get('/api/v1/admin/journal')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);
  });

  // Module 4: Categories & Reordering
  it('Categories API: List, Create & Reorder', async () => {
    const createRes = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Limited Festive Editions',
        slug: 'festive-editions',
        subtitle: 'Celebratory Tribal Wear',
        iconMotif: 'sparkles',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.name).toBe('Limited Festive Editions');

    const catId = createRes.body.data.id;

    const reorderRes = await request(app)
      .put('/api/v1/admin/categories/reorder')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ orderedIds: [catId, 'cat_oversized_streetwear'] });

    expect(reorderRes.status).toBe(200);
    expect(reorderRes.body.success).toBe(true);
  });

  // Module 5: T-Shirt Catalog Manager
  it('Product Catalog API: List, Create & Update', async () => {
    const createRes = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Dokra Craft Artisan Tee',
        slug: 'dokra-craft-artisan-tee',
        categoryId: 'cat_oversized_streetwear',
        fitType: 'OVERSIZED_FIT',
        sellingPrice: 1099,
        originalMrp: 1599,
        badge: 'NEW',
        artworkStory: 'Ancient lost-wax bell metal casting motifs rendered on organic cotton.',
        fabricDetails: '240 GSM Heavy French Terry with enzyme wash.',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.slug).toBe('dokra-craft-artisan-tee');
    expect(createRes.body.data.discountPercent).toBe(31);

    const productId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/v1/admin/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ sellingPrice: 1199 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.sellingPrice).toBe(1199);
  });

  // Module 7: Dynamic Page Locks
  it('Page Locks API: List & Toggle Lock', async () => {
    const listRes = await request(app)
      .get('/api/v1/admin/page-locks')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    const toggleRes = await request(app)
      .post('/api/v1/admin/page-locks/toggle')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ routePath: '/custom-design' });

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.data.routePath).toBe('/custom-design');
  });
});
