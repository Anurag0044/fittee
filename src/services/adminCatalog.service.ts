import { BannerSlot, ProductStatus, FitType, ProductBadge, JournalStatus, PageLockMode } from '@prisma/client';
import { prisma, withDbFallback } from '../config/prisma';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BANNERS, MOCK_JOURNAL_ARTICLES, StorefrontProductDto } from '../data/mockCatalog.data';
import { AppError } from '../utils/errors.util';

// In-memory caches for live modifications in mock/dev mode
export const IN_MEMORY_ADMIN_BANNERS: any[] = [...MOCK_BANNERS];
export const IN_MEMORY_ADMIN_CATEGORIES: any[] = [...MOCK_CATEGORIES];
export const IN_MEMORY_ADMIN_PRODUCTS: any[] = [...MOCK_PRODUCTS];
export const IN_MEMORY_ADMIN_JOURNAL: any[] = [...MOCK_JOURNAL_ARTICLES];
export const IN_MEMORY_PAGE_LOCKS: any[] = [
  {
    id: 'lock_root',
    routePath: '/*',
    mode: 'MAINTENANCE',
    isLocked: false,
    title: 'Storefront Online',
    message: 'All systems operational',
    contactEmail: 'contact@fittee.in',
    lastChangedBy: 'Super Admin',
    lastChangedAt: new Date().toISOString(),
  },
  {
    id: 'lock_custom_design',
    routePath: '/custom-design',
    mode: 'COMING_SOON',
    isLocked: false,
    title: 'Custom Tribal Studio Coming Soon',
    message: 'Interactive AI & Artisan Co-Creation Portal',
    contactEmail: 'artisans@fittee.in',
    lastChangedBy: 'Super Admin',
    lastChangedAt: new Date().toISOString(),
  },
];

export class AdminCatalogService {
  // ---------------------------------------------------------------------------
  // 1. Festive Banners
  // ---------------------------------------------------------------------------
  static async listBanners() {
    return withDbFallback(
      () => prisma.festiveBanner.findMany({ orderBy: { priority: 'asc' } }),
      () => IN_MEMORY_ADMIN_BANNERS
    );
  }

  static async createBanner(data: {
    campaignName: string;
    slot: BannerSlot;
    headline: string;
    subheadline?: string;
    ctaText?: string;
    redirectUrl?: string;
    linkedCouponCode?: string;
    priority?: number;
    desktopImageUrl?: string;
    mobileImageUrl?: string;
    startDateTime?: string;
    endDateTime?: string;
  }) {
    const banner = {
      id: `ban_${Date.now()}`,
      campaignName: data.campaignName,
      slot: data.slot,
      headline: data.headline,
      subheadline: data.subheadline || null,
      ctaText: data.ctaText || 'Shop Now',
      redirectUrl: data.redirectUrl || '/#featured',
      linkedCouponCode: data.linkedCouponCode || null,
      priority: data.priority || 1,
      desktopImageUrl: data.desktopImageUrl || null,
      mobileImageUrl: data.mobileImageUrl || null,
      startDateTime: data.startDateTime ? new Date(data.startDateTime) : new Date(),
      endDateTime: data.endDateTime ? new Date(data.endDateTime) : new Date(Date.now() + 30 * 86400000),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_ADMIN_BANNERS.unshift(banner);

    await withDbFallback<any>(
      () => prisma.festiveBanner.create({ data: banner as any }),
      () => null
    );

    return banner;
  }

  static async toggleBanner(id: string) {
    const banner = IN_MEMORY_ADMIN_BANNERS.find((b) => b.id === id);
    if (!banner) throw AppError.notFound('Banner not found');
    banner.isActive = !banner.isActive;
    banner.updatedAt = new Date().toISOString();

    await withDbFallback<any>(
      () => prisma.festiveBanner.update({ where: { id }, data: { isActive: banner.isActive } }),
      () => null
    );

    return banner;
  }

  static async deleteBanner(id: string) {
    const index = IN_MEMORY_ADMIN_BANNERS.findIndex((b) => b.id === id);
    if (index !== -1) IN_MEMORY_ADMIN_BANNERS.splice(index, 1);

    await withDbFallback<any>(
      () => prisma.festiveBanner.delete({ where: { id } }),
      () => null
    );

    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // 2. Categories
  // ---------------------------------------------------------------------------
  static async listCategories() {
    return withDbFallback(
      async () => {
        const cats = await prisma.category.findMany({
          orderBy: { displayOrder: 'asc' },
          include: { _count: { select: { products: true } } },
        });
        return cats.map((c) => ({ ...c, productCount: c._count.products }));
      },
      () => IN_MEMORY_ADMIN_CATEGORIES
    );
  }

  static async createCategory(data: {
    name: string;
    slug: string;
    subtitle?: string;
    storyExcerpt?: string;
    iconMotif?: string;
  }) {
    const category = {
      id: `cat_${data.slug.replace(/[^a-z0-9]/g, '_')}`,
      name: data.name,
      slug: data.slug,
      subtitle: data.subtitle || '',
      storyExcerpt: data.storyExcerpt || '',
      iconMotif: data.iconMotif || 'sparkles',
      displayOrder: IN_MEMORY_ADMIN_CATEGORIES.length + 1,
      isActive: true,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_ADMIN_CATEGORIES.push(category);

    await withDbFallback<any>(
      () => prisma.category.create({ data: category as any }),
      () => null
    );

    return category;
  }

  static async reorderCategories(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const cat = IN_MEMORY_ADMIN_CATEGORIES.find((c) => c.id === id);
      if (cat) cat.displayOrder = index + 1;
    });

    await withDbFallback<any>(
      async () => {
        for (let i = 0; i < orderedIds.length; i++) {
          await prisma.category.update({
            where: { id: orderedIds[i] },
            data: { displayOrder: i + 1 },
          });
        }
      },
      () => null
    );

    return IN_MEMORY_ADMIN_CATEGORIES;
  }

  // ---------------------------------------------------------------------------
  // 3. Products
  // ---------------------------------------------------------------------------
  static async listProducts() {
    return withDbFallback(
      () => prisma.product.findMany({
        include: { category: true, variants: true, images: true },
        orderBy: { createdAt: 'desc' },
      }),
      () => IN_MEMORY_ADMIN_PRODUCTS
    );
  }

  static async createProduct(data: {
    title: string;
    slug: string;
    categoryId: string;
    fitType: FitType;
    sellingPrice: number;
    originalMrp: number;
    badge?: ProductBadge;
    artworkStory: string;
    fabricDetails: string;
    variants?: any[];
    images?: any[];
  }) {
    const discountPercent = Math.round(((data.originalMrp - data.sellingPrice) / data.originalMrp) * 100);

    const product: any = {
      id: `prod_${data.slug.replace(/[^a-z0-9]/g, '_')}`,
      displayId: IN_MEMORY_ADMIN_PRODUCTS.length + 1,
      title: data.title,
      name: data.title,
      slug: data.slug,
      categoryId: data.categoryId,
      fitType: data.fitType,
      fit: data.fitType === 'OVERSIZED_FIT' ? 'Oversized Fit Tee' : 'Regular Fit Tee',
      badge: data.badge || null,
      sellingPrice: data.sellingPrice,
      price: data.sellingPrice,
      originalMrp: data.originalMrp,
      originalPrice: data.originalMrp,
      discountPercent,
      status: 'ACTIVE',
      artworkStory: data.artworkStory,
      fabricDetails: data.fabricDetails,
      hsnCode: '61091000',
      gstRate: 5.0,
      rating: 5.0,
      reviewsCount: 1,
      image: data.images?.[0]?.url || `/images/products/${data.slug}.jpg`,
      colors: ['#1C1C1C'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      variants: data.variants || [],
      images: data.images || [{ id: 'img_1', url: `/images/products/${data.slug}.jpg`, altText: data.title, isHero: true }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_ADMIN_PRODUCTS.unshift(product);

    await withDbFallback<any>(
      () => prisma.product.create({
        data: {
          title: data.title,
          slug: data.slug,
          categoryId: data.categoryId,
          fitType: data.fitType,
          sellingPrice: data.sellingPrice,
          originalMrp: data.originalMrp,
          discountPercent,
          artworkStory: data.artworkStory,
          fabricDetails: data.fabricDetails,
          badge: data.badge,
        },
      }),
      () => null
    );

    return product;
  }

  static async updateProduct(id: string, updates: Partial<StorefrontProductDto>) {
    const product = IN_MEMORY_ADMIN_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (!product) throw AppError.notFound('Product not found');

    Object.assign(product, updates, { updatedAt: new Date().toISOString() });

    await withDbFallback<any>(
      () => prisma.product.update({
        where: { id: product.id },
        data: {
          title: updates.title || updates.name,
          sellingPrice: updates.sellingPrice || updates.price,
          originalMrp: updates.originalMrp || updates.originalPrice,
          artworkStory: updates.artworkStory,
          fabricDetails: updates.fabricDetails,
        },
      }),
      () => null
    );

    return product;
  }

  // ---------------------------------------------------------------------------
  // 4. Cultural Journal
  // ---------------------------------------------------------------------------
  static async listJournal() {
    return withDbFallback(
      () => prisma.journalPost.findMany({ orderBy: { publishedAt: 'desc' } }),
      () => IN_MEMORY_ADMIN_JOURNAL
    );
  }

  static async createJournalArticle(data: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    coverImage: string;
    authorName?: string;
    categoryTags?: string[];
    taggedProductIds?: string[];
  }) {
    const article = {
      id: `art_${Date.now()}`,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: data.body,
      coverImage: data.coverImage,
      authorName: data.authorName || 'FITTEE Collective',
      readingTimeMinutes: Math.max(2, Math.ceil(data.body.split(/\s+/).length / 200)),
      categoryTags: data.categoryTags || [],
      taggedProductIds: data.taggedProductIds || [],
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_ADMIN_JOURNAL.unshift(article);

    await withDbFallback<any>(
      () => prisma.journalPost.create({
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          body: data.body,
          coverImage: data.coverImage,
          authorName: article.authorName,
          categoryTags: article.categoryTags,
        },
      }),
      () => null
    );

    return article;
  }

  // ---------------------------------------------------------------------------
  // 5. Page Locks
  // ---------------------------------------------------------------------------
  static async listPageLocks() {
    return withDbFallback(
      () => prisma.pageLockSetting.findMany(),
      () => IN_MEMORY_PAGE_LOCKS
    );
  }

  static async togglePageLock(routePath: string, actor: string = 'Super Admin') {
    let lock = IN_MEMORY_PAGE_LOCKS.find((l) => l.routePath === routePath);
    if (!lock) {
      lock = {
        id: `lock_${Date.now()}`,
        routePath,
        mode: 'MAINTENANCE',
        isLocked: true,
        title: 'Maintenance in Progress',
        message: 'This section is currently undergoing upgrades',
        contactEmail: 'contact@fittee.in',
        lastChangedBy: actor,
        lastChangedAt: new Date().toISOString(),
      };
      IN_MEMORY_PAGE_LOCKS.push(lock);
    } else {
      lock.isLocked = !lock.isLocked;
      lock.lastChangedBy = actor;
      lock.lastChangedAt = new Date().toISOString();
    }

    await withDbFallback<any>(
      () => prisma.pageLockSetting.upsert({
        where: { routePath },
        update: { isLocked: lock.isLocked, lastChangedBy: actor, lastChangedAt: new Date() },
        create: {
          routePath,
          mode: lock.mode as PageLockMode,
          isLocked: lock.isLocked,
          title: lock.title,
          message: lock.message,
          lastChangedBy: actor,
        },
      }),
      () => null
    );

    return lock;
  }
}
