import crypto from 'crypto';
import { env } from '../config/env';

export interface CloudinarySignedUploadParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadUrl: string;
}

export class CloudinaryService {
  static generateUploadSignature(folder: string = 'fittee/products'): CloudinarySignedUploadParams {
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;

    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return {
      timestamp,
      signature,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    };
  }
}
