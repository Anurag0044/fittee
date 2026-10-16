import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { StoreCatalogService } from '../services/storeCatalog.service';
import { ApiResponseHandler } from '../utils/apiResponse.util';

export const customInquirySchema = z.object({
  customerEmail: z.string().email('Valid email address required'),
  styleChoice: z.string().min(1, 'Style choice is required'),
  garmentChoice: z.string().min(1, 'Garment choice is required'),
  placementChoice: z.string().min(1, 'Placement choice is required'),
  customPrompt: z.string().min(5, 'Custom prompt must be at least 5 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Valid email address required'),
});

export class StoreCatalogController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, fit, sort, page, limit } = req.query as any;
      const result = await StoreCatalogService.getProducts({ category, fit, sort, page, limit });
      ApiResponseHandler.success(res, result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await StoreCatalogService.getProductBySlug(slug);
      ApiResponseHandler.success(res, product, 'Product detail retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await StoreCatalogService.getCategories();
      ApiResponseHandler.success(res, categories, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getFestiveBanners(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await StoreCatalogService.getFestiveBanners();
      ApiResponseHandler.success(res, banners, 'Festive banners retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getJournalPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const posts = await StoreCatalogService.getJournalPosts(page, limit);
      ApiResponseHandler.success(res, posts, 'Journal articles retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getJournalBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await StoreCatalogService.getJournalBySlug(slug);
      ApiResponseHandler.success(res, post, 'Journal article retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async submitCustomInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await StoreCatalogService.submitCustomInquiry(req.body);
      ApiResponseHandler.created(res, result, 'Custom inquiry submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async subscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await StoreCatalogService.subscribeNewsletter(req.body.email);
      ApiResponseHandler.success(res, result, 'Subscribed to newsletter successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMaintenanceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routePath = (req.query.path as string) || '/*';
      const status = await StoreCatalogService.getMaintenanceStatus(routePath);
      ApiResponseHandler.success(res, status, 'Maintenance status retrieved');
    } catch (error) {
      next(error);
    }
  }
}
