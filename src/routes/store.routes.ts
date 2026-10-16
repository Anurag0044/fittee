import { Router } from 'express';
import {
  StoreCatalogController,
  customInquirySchema,
  newsletterSchema,
} from '../controllers/storeCatalog.controller';
import { LogisticsController, pincodeCheckSchema } from '../controllers/logistics.controller';
import { validateBody } from '../middleware/validate.middleware';

export const storeRouter = Router();

storeRouter.get('/products', StoreCatalogController.getProducts);
storeRouter.get('/products/:slug', StoreCatalogController.getProductBySlug);
storeRouter.get('/categories', StoreCatalogController.getCategories);
storeRouter.get('/festive-banners', StoreCatalogController.getFestiveBanners);
storeRouter.get('/journal', StoreCatalogController.getJournalPosts);
storeRouter.get('/journal/:slug', StoreCatalogController.getJournalBySlug);
storeRouter.post('/custom-inquiries', validateBody(customInquirySchema), StoreCatalogController.submitCustomInquiry);
storeRouter.post('/newsletter/subscribe', validateBody(newsletterSchema), StoreCatalogController.subscribeNewsletter);
storeRouter.post('/logistics/pincode-check', validateBody(pincodeCheckSchema), LogisticsController.checkPincode);
storeRouter.get('/maintenance-status', StoreCatalogController.getMaintenanceStatus);
