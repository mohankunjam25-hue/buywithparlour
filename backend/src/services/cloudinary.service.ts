import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/environment';

// Configure Cloudinary with user credentials
cloudinary.config({
  cloud_name: config.cloudinaryCloudName || 'jannetra',
  api_key: config.cloudinaryApiKey || '743573369626919',
  api_secret: config.cloudinaryApiSecret || 'RC69TakcKeMC7PbToOwTBfur1s4',
  secure: true,
});

export class CloudinaryService {
  /**
   * Upload an image (Base64 data URI or image URL) to Cloudinary
   * @param imageSource Base64 string or image URL
   * @param folder Destination folder on Cloudinary
   * @returns Cloudinary secure CDN URL
   */
  static async uploadImage(imageSource: string, folder = 'smreen_products'): Promise<string> {
    // If it's already an external HTTP/HTTPS URL and not a data URI, we can upload or return
    if (imageSource.startsWith('http://') || (imageSource.startsWith('https://') && !imageSource.includes('localhost'))) {
      try {
        const uploadRes = await cloudinary.uploader.upload(imageSource, {
          folder,
          resource_type: 'image',
        });
        return uploadRes.secure_url;
      } catch (err) {
        console.warn('[Cloudinary] URL upload notice (using original):', err);
        return imageSource;
      }
    }

    // If it's a Base64 data URI
    try {
      const uploadRes = await cloudinary.uploader.upload(imageSource, {
        folder,
        resource_type: 'image',
      });
      console.log('[Cloudinary] Successfully uploaded image:', uploadRes.secure_url);
      return uploadRes.secure_url;
    } catch (err) {
      console.warn('[Cloudinary] Upload failed, falling back to local data:', err);
      return imageSource;
    }
  }

  /**
   * Upload multiple images in parallel
   */
  static async uploadMultipleImages(images: string[], folder = 'smreen_products'): Promise<string[]> {
    if (!images || images.length === 0) return [];
    const uploadPromises = images.map((img) => this.uploadImage(img, folder));
    return Promise.all(uploadPromises);
  }
}
