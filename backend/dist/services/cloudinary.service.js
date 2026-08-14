"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const environment_1 = require("../config/environment");
// Configure Cloudinary with user credentials
cloudinary_1.v2.config({
    cloud_name: environment_1.config.cloudinaryCloudName || 'jannetra',
    api_key: environment_1.config.cloudinaryApiKey || '743573369626919',
    api_secret: environment_1.config.cloudinaryApiSecret || 'RC69TakcKeMC7PbToOwTBfur1s4',
    secure: true,
});
class CloudinaryService {
    /**
     * Upload an image (Base64 data URI or image URL) to Cloudinary
     * @param imageSource Base64 string or image URL
     * @param folder Destination folder on Cloudinary
     * @returns Cloudinary secure CDN URL
     */
    static async uploadImage(imageSource, folder = 'smreen_products') {
        // If it's already an external HTTP/HTTPS URL and not a data URI, we can upload or return
        if (imageSource.startsWith('http://') || (imageSource.startsWith('https://') && !imageSource.includes('localhost'))) {
            try {
                const uploadRes = await cloudinary_1.v2.uploader.upload(imageSource, {
                    folder,
                    resource_type: 'image',
                });
                return uploadRes.secure_url;
            }
            catch (err) {
                console.warn('[Cloudinary] URL upload notice (using original):', err);
                return imageSource;
            }
        }
        // If it's a Base64 data URI
        try {
            const uploadRes = await cloudinary_1.v2.uploader.upload(imageSource, {
                folder,
                resource_type: 'image',
            });
            console.log('[Cloudinary] Successfully uploaded image:', uploadRes.secure_url);
            return uploadRes.secure_url;
        }
        catch (err) {
            console.warn('[Cloudinary] Upload failed, falling back to local data:', err);
            return imageSource;
        }
    }
    /**
     * Upload multiple images in parallel
     */
    static async uploadMultipleImages(images, folder = 'smreen_products') {
        if (!images || images.length === 0)
            return [];
        const uploadPromises = images.map((img) => this.uploadImage(img, folder));
        return Promise.all(uploadPromises);
    }
}
exports.CloudinaryService = CloudinaryService;
