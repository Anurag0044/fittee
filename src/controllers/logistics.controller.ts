import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { EkartService } from '../services/ekart.service';
import { InvoiceService } from '../services/invoice.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { ApiResponseHandler } from '../utils/apiResponse.util';

export const pincodeCheckSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, 'Indian pincode must be exactly 6 digits'),
});

export class LogisticsController {
  static checkPincode(req: Request, res: Response, next: NextFunction): void {
    try {
      const { pincode } = req.body;
      const result = EkartService.checkPincode(pincode);
      ApiResponseHandler.success(res, result, 'Pincode serviceability retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async dispatchOrderWithEkart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const idempotencyKey = req.headers['idempotency-key'] as string;
      const result = await EkartService.dispatchShipment(id, idempotencyKey);
      ApiResponseHandler.success(res, result, 'Ekart shipment booked successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getShippingLabelPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pdfBuffer = await EkartService.generateThermalLabelPdf(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="shipping-label-${id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  static async getTaxInvoicePdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pdfBuffer = await InvoiceService.generateTaxInvoicePdf(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="tax-invoice-${id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  static signMediaUpload(req: Request, res: Response, next: NextFunction): void {
    try {
      const folder = (req.body.folder as string) || 'fittee/products';
      const signatureData = CloudinaryService.generateUploadSignature(folder);
      ApiResponseHandler.success(res, signatureData, 'Media upload signature generated');
    } catch (error) {
      next(error);
    }
  }
}
