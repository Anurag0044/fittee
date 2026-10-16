import { Router } from 'express';
import {
  AdminControlController,
  createBannerSchema,
  createCategorySchema,
  reorderCategoriesSchema,
  createProductSchema,
  createJournalSchema,
  togglePageLockSchema,
} from '../controllers/adminControl.controller';
import { requireAdminAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

export const adminControlRouter = Router();

// Require admin authentication for all control center routes
adminControlRouter.use(requireAdminAuth);

// Module 1: Dashboard Analytics & Rolling MAU
adminControlRouter.get('/analytics/dashboard', AdminControlController.getDashboardAnalytics);

// Module 2: Festive Banners
adminControlRouter.get('/banners', AdminControlController.listBanners);
adminControlRouter.post('/banners', validateBody(createBannerSchema), AdminControlController.createBanner);
adminControlRouter.patch('/banners/:id/toggle', AdminControlController.toggleBanner);
adminControlRouter.delete('/banners/:id', AdminControlController.deleteBanner);

// Module 3: Cultural Journal CMS
adminControlRouter.get('/journal', AdminControlController.listJournal);
adminControlRouter.post('/journal', validateBody(createJournalSchema), AdminControlController.createJournalArticle);

// Module 4: Categories & Reordering
adminControlRouter.get('/categories', AdminControlController.listCategories);
adminControlRouter.post('/categories', validateBody(createCategorySchema), AdminControlController.createCategory);
adminControlRouter.put('/categories/reorder', validateBody(reorderCategoriesSchema), AdminControlController.reorderCategories);

// Module 5: T-Shirt Catalog Manager
adminControlRouter.get('/products', AdminControlController.listProducts);
adminControlRouter.post('/products', validateBody(createProductSchema), AdminControlController.createProduct);
adminControlRouter.put('/products/:id', AdminControlController.updateProduct);

// Module 7: Dynamic Page Locks
adminControlRouter.get('/page-locks', AdminControlController.listPageLocks);
adminControlRouter.post('/page-locks/toggle', validateBody(togglePageLockSchema), AdminControlController.togglePageLock);
