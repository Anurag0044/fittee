import { prisma, withDbFallback } from '../config/prisma';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BANNERS, MOCK_JOURNAL_ARTICLES, StorefrontProductDto } from '../data/mockCatalog.data';
import { AppError } from '../utils/errors.util';

export interface ProductQueryFilters {
  category?: string;
  fit?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export class StoreCatalogService {
  static async getProducts(filters: ProductQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(filters.limit) || 12));

    const fallback = () => {
      let items = [...MOCK_PRODUCTS];

      if (filters.fit) {
        const isOversized = filters.fit.toLowerCase().includes('oversized');
        items = items.filter((p) => (isOversized ? p.fitType === 'OVERSIZED_FIT' : p.fitType === 'REGULAR_FIT'));
      }

      if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase();
        items = items.filter(
          (p) =>
            p.category.toLowerCase() === cat ||
            p.categoryId.toLowerCase().includes(cat) ||
            p.categoryName?.toLowerCase().includes(cat)
        );
      }

      if (filters.sort === 'price_asc') {
        items.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_desc') {
        items.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
      }

      const startIndex = (page - 1) * limit;
      const paginated = items.slice(startIndex, startIndex + limit);

      return {
        products: paginated,
        pagination: {
          page,
          limit,
          total: items.length,
        },
      };
    };

    return withDbFallback(async () => {
      const dbProducts = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          ...(filters.fit && {
            fitType: filters.fit.includes('OVERSIZED') ? 'OVERSIZED_FIT' : 'REGULAR_FIT',
          }),
        },
        include: {
          category: true,
          variants: true,
          images: { orderBy: { displayOrder: 'asc' } },
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      if (!dbProducts || dbProducts.length === 0) {
        return fallback();
      }

      const transformed = dbProducts.map((p) => {
        const colorHexList = Array.from(new Set(p.variants.map((v) => v.colorHex)));
        const sizesList = Array.from(new Set(p.variants.map((v) => v.size)));
        return {
          id: p.id,
          displayId: p.displayId,
          slug: p.slug,
          name: p.title,
          title: p.title,
          fit: p.fitType === 'OVERSIZED_FIT' ? ('Oversized Fit Tee' as const) : ('Regular Fit Tee' as const),
          fitType: p.fitType,
          category: p.category.slug.includes('oversized') ? ('oversized' as const) : ('regular' as const),
          categoryId: p.categoryId,
          categoryName: p.category.name,
          price: p.sellingPrice,
          sellingPrice: p.sellingPrice,
          originalPrice: p.originalMrp,
          originalMrp: p.originalMrp,
          discountPercent: p.discountPercent,
          badge: p.badge ? (p.badge === 'NEW' ? 'New' : p.badge === 'BESTSELLER' ? 'Bestseller' : 'Festive Special') : null,
          image: p.images[0]?.url || `/images/products/${p.slug}.jpg`,
          colors: colorHexList.length > 0 ? colorHexList : ['#1C1C1C'],
          sizes: sizesList.length > 0 ? sizesList : ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
          artworkStory: p.artworkStory,
          fabricDetails: p.fabricDetails,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          images: p.images,
          variants: p.variants,
        };
      });

      return {
        products: transformed,
        pagination: {
          page,
          limit,
          total: await prisma.product.count({ where: { status: 'ACTIVE' } }),
        },
      };
    }, fallback);
  }

  static async getProductBySlug(slugOrId: string): Promise<StorefrontProductDto> {
    const fallback = () => {
      const found = MOCK_PRODUCTS.find(
        (p) => p.slug === slugOrId || p.id.toString() === slugOrId || p.displayId.toString() === slugOrId
      );

      if (!found) {
        throw AppError.notFound(`Product with slug or ID "${slugOrId}" not found`);
      }

      return found;
    };

    return withDbFallback(async () => {
      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [{ slug: slugOrId }, { id: slugOrId }],
        },
        include: {
          category: true,
          variants: true,
          images: { orderBy: { displayOrder: 'asc' } },
        },
      });

      if (!dbProduct) {
        return fallback();
      }

      const colorHexList = Array.from(new Set(dbProduct.variants.map((v) => v.colorHex)));
      const sizesList = Array.from(new Set(dbProduct.variants.map((v) => v.size)));
      return {
        id: dbProduct.id,
        displayId: dbProduct.displayId,
        slug: dbProduct.slug,
        name: dbProduct.title,
        title: dbProduct.title,
        fit: dbProduct.fitType === 'OVERSIZED_FIT' ? 'Oversized Fit Tee' : 'Regular Fit Tee',
        fitType: dbProduct.fitType,
        category: dbProduct.category.slug.includes('oversized') ? 'oversized' : 'regular',
        categoryId: dbProduct.categoryId,
        categoryName: dbProduct.category.name,
        price: dbProduct.sellingPrice,
        sellingPrice: dbProduct.sellingPrice,
        originalPrice: dbProduct.originalMrp,
        originalMrp: dbProduct.originalMrp,
        discountPercent: dbProduct.discountPercent,
        badge: dbProduct.badge ? (dbProduct.badge === 'NEW' ? 'New' : dbProduct.badge === 'BESTSELLER' ? 'Bestseller' : 'Festive Special') : null,
        image: dbProduct.images[0]?.url || `/images/products/${dbProduct.slug}.jpg`,
        colors: colorHexList,
        colorways: dbProduct.variants.map((v) => ({ name: v.colorName, hex: v.colorHex })),
        sizes: sizesList,
        artworkStory: dbProduct.artworkStory,
        fabricDetails: dbProduct.fabricDetails,
        hsnCode: dbProduct.hsnCode,
        gstRate: dbProduct.gstRate,
        rating: dbProduct.rating,
        reviewsCount: dbProduct.reviewsCount,
        images: dbProduct.images,
        variants: dbProduct.variants,
      };
    }, fallback);
  }

  static async getCategories() {
    return withDbFallback(async () => {
      const dbCategories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: { _count: { select: { products: true } } },
      });

      if (!dbCategories || dbCategories.length === 0) {
        return MOCK_CATEGORIES;
      }

      return dbCategories.map((c) => ({
        ...c,
        productCount: c._count.products,
      }));
    }, () => MOCK_CATEGORIES);
  }

  static async getFestiveBanners() {
    return withDbFallback(async () => {
      const dbBanners = await prisma.festiveBanner.findMany({
        where: { isActive: true },
        orderBy: { priority: 'asc' },
      });

      if (!dbBanners || dbBanners.length === 0) {
        return MOCK_BANNERS;
      }

      return dbBanners;
    }, () => MOCK_BANNERS);
  }

  static async getJournalPosts(page: number = 1, limit: number = 10) {
    const fallback = () => ({
      articles: MOCK_JOURNAL_ARTICLES,
      pagination: { page, limit, total: MOCK_JOURNAL_ARTICLES.length },
    });

    return withDbFallback(async () => {
      const dbPosts = await prisma.journalPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      });

      if (!dbPosts || dbPosts.length === 0) {
        return fallback();
      }

      return {
        articles: dbPosts,
        pagination: { page, limit, total: await prisma.journalPost.count({ where: { status: 'PUBLISHED' } }) },
      };
    }, fallback);
  }

  static async getJournalBySlug(slug: string) {
    const fallback = () => {
      const article = MOCK_JOURNAL_ARTICLES.find((a) => a.slug === slug);
      if (!article) {
        throw AppError.notFound(`Journal article "${slug}" not found`);
      }

      const shoppableProducts = MOCK_PRODUCTS.filter((p) =>
        article.taggedProductIds?.includes(p.id.toString())
      );

      return {
        ...article,
        taggedProducts: shoppableProducts,
      };
    };

    return withDbFallback(async () => {
      const dbArticle = await prisma.journalPost.findUnique({
        where: { slug },
        include: { taggedProducts: { include: { product: true } } },
      });

      if (!dbArticle) {
        return fallback();
      }

      return dbArticle;
    }, fallback);
  }

  static async submitCustomInquiry(payload: {
    customerEmail: string;
    styleChoice: string;
    garmentChoice: string;
    placementChoice: string;
    customPrompt: string;
  }) {
    const fallback = () => ({
      id: `inq_mock_${Date.now()}`,
      customerEmail: payload.customerEmail,
      styleChoice: payload.styleChoice,
      garmentChoice: payload.garmentChoice,
      placementChoice: payload.placementChoice,
      customPrompt: payload.customPrompt,
      status: 'NEW' as const,
      internalNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return withDbFallback(async () => {
      return await prisma.customInquiry.create({
        data: {
          customerEmail: payload.customerEmail,
          styleChoice: payload.styleChoice,
          garmentChoice: payload.garmentChoice,
          placementChoice: payload.placementChoice,
          customPrompt: payload.customPrompt,
        },
      });
    }, fallback);
  }

  static async subscribeNewsletter(email: string) {
    const fallback = () => ({
      id: `sub_mock_${Date.now()}`,
      email,
      isActive: true,
      subscribedAt: new Date(),
    });

    return withDbFallback(async () => {
      return await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: { isActive: true },
        create: { email, isActive: true },
      });
    }, fallback);
  }

  static async getMaintenanceStatus(routePath: string = '/*') {
    const fallback = () => ({
      isLocked: false,
      mode: 'MAINTENANCE',
      title: 'Storefront Online',
      message: 'All systems operational',
      contactEmail: 'contact@fittee.in',
    });

    return withDbFallback(async () => {
      const lock = await prisma.pageLockSetting.findFirst({
        where: {
          OR: [{ routePath }, { routePath: '/*' }],
          isLocked: true,
        },
      });

      if (!lock) {
        return fallback();
      }

      return {
        isLocked: true,
        mode: lock.mode,
        title: lock.title,
        message: lock.message,
        contactEmail: lock.contactEmail,
        estimatedEndTime: lock.estimatedEndTime,
      };
    }, fallback);
  }
}
