import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AdminAnalyticsService } from '../services/adminAnalytics.service';
import { AdminCatalogService } from '../services/adminCatalog.service';
import { ApiResponseHandler } from '../utils/apiResponse.util';

// Validation Schemas
export const createBannerSchema = z.object({
  campaignName: z.string().min(2, 'Campaign name is required'),
  slot: z.enum(['HERO_BANNER', 'ANNOUNCEMENT_BAR', 'CAROUSEL_CARD', 'MID_PAGE_STRIP']),
  headline: z.string().min(2, 'Headline is required'),
  subheadline: z.string().optional(),
  ctaText: z.string().optional(),
  redirectUrl: z.string().optional(),
  linkedCouponCode: z.string().optional(),
  priority: z.number().int().optional(),
  desktopImageUrl: z.string().optional(),
  mobileImageUrl: z.string().optional(),
  startDateTime: z.string().optional(),
  endDateTime: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  subtitle: z.string().optional(),
  storyExcerpt: z.string().optional(),
  iconMotif: z.string().optional(),
});

export const reorderCategoriesSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'Ordered category IDs required'),
});

export const createProductSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  categoryId: z.string().min(1, 'Category is required'),
  fitType: z.enum(['REGULAR_FIT', 'OVERSIZED_FIT']),
  sellingPrice: z.number().positive('Selling price must be positive'),
  originalMrp: z.number().positive('Original MRP must be positive'),
  badge: z.enum(['NEW', 'BESTSELLER', 'FESTIVE_SPECIAL']).nullable().optional(),
  artworkStory: z.string().min(5, 'Artwork story is required'),
  fabricDetails: z.string().min(5, 'Fabric details are required'),
  variants: z.array(z.any()).optional(),
  images: z.array(z.any()).optional(),
});

export const createJournalSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  excerpt: z.string().min(5, 'Excerpt is required'),
  body: z.string().min(10, 'Body content is required'),
  coverImage: z.string().min(1, 'Cover image is required'),
  authorName: z.string().optional(),
  categoryTags: z.array(z.string()).optional(),
  taggedProductIds: z.array(z.string()).optional(),
});

export const togglePageLockSchema = z.object({
  routePath: z.string().min(1, 'Route path is required'),
});

export class AdminControlController {
  // 1. Dashboard Analytics
  static async getDashboardAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await AdminAnalyticsService.getDashboardMetrics();
      ApiResponseHandler.success(res, metrics, 'Dashboard metrics retrieved');
    } catch (error) {
      next(error);
    }
  }

  // 2. Festive Banners
  static async listBanners(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await AdminCatalogService.listBanners();
      ApiResponseHandler.success(res, banners, 'Banners retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = await AdminCatalogService.createBanner(req.body);
      ApiResponseHandler.created(res, banner, 'Banner created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const banner = await AdminCatalogService.toggleBanner(id);
      ApiResponseHandler.success(res, banner, 'Banner status toggled');
    } catch (error) {
      next(error);
    }
  }

  static async deleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await AdminCatalogService.deleteBanner(id);
      ApiResponseHandler.success(res, null, 'Banner deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // 3. Categories
  static async listCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await AdminCatalogService.listCategories();
      ApiResponseHandler.success(res, categories, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await AdminCatalogService.createCategory(req.body);
      ApiResponseHandler.created(res, category, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async reorderCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await AdminCatalogService.reorderCategories(req.body.orderedIds);
      ApiResponseHandler.success(res, categories, 'Categories reordered successfully');
    } catch (error) {
      next(error);
    }
  }

  // 4. Products
  static async listProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await AdminCatalogService.listProducts();
      ApiResponseHandler.success(res, products, 'Products retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await AdminCatalogService.createProduct(req.body);
      ApiResponseHandler.created(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await AdminCatalogService.updateProduct(id, req.body);
      ApiResponseHandler.success(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // 5. Journal CMS
  static async listJournal(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const journal = await AdminCatalogService.listJournal();
      ApiResponseHandler.success(res, journal, 'Journal articles retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createJournalArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await AdminCatalogService.createJournalArticle(req.body);
      ApiResponseHandler.created(res, article, 'Journal article published');
    } catch (error) {
      next(error);
    }
  }

  // 6. Page Locks
  static async listPageLocks(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const locks = await AdminCatalogService.listPageLocks();
      ApiResponseHandler.success(res, locks, 'Page locks retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async togglePageLock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { routePath } = req.body;
      const actor = req.adminUser?.name || 'Super Admin';
      const lock = await AdminCatalogService.togglePageLock(routePath, actor);
      ApiResponseHandler.success(res, lock, `Route lock for ${routePath} toggled`);
    } catch (error) {
      next(error);
    }
  }
}
