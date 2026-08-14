import { Router, Response, NextFunction } from 'express';
import { ProductRegistry } from './product.registry';
import { CloudinaryService } from '../../services/cloudinary.service';
import { sendResponse, sendError } from '../../utils/response';

import { UserModel } from '../users/user.model';
import mongoose from 'mongoose';

const router = Router();

// 0. Seller Profile & Store Info Endpoints
router.get('/profile', async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (userId && mongoose.connection.readyState === 1) {
      const user = await UserModel.findById(userId).lean();
      if (user) {
        sendResponse(res, 200, true, 'Seller profile fetched', {
          seller: {
            businessName: user.businessName || 'BuyWithParlour Beauty Merchant',
            email: user.email,
            phone: user.phone || '9876543210',
            storeDescription: (user as any).storeDescription || 'Premium Salon & Parlour Cosmetic Supplier',
            gstin: (user as any).gstin || '07AAACB1234F1Z5',
            pickupAddress: (user as any).pickupAddress || 'Connaught Place, New Delhi - 110001',
            isSellerVerified: (user as any).isSellerVerified || true,
            isKycCompleted: (user as any).isKycCompleted || true,
          },
        });
        return;
      }
    }

    sendResponse(res, 200, true, 'Default seller profile fetched', {
      seller: {
        businessName: 'BuyWithParlour Beauty Merchant',
        email: 'seller@buywithparlour.com',
        phone: '9876543210',
        storeDescription: 'Premium Salon & Parlour Cosmetic Supplier',
        gstin: '07AAACB1234F1Z5',
        pickupAddress: 'Connaught Place, New Delhi - 110001',
        isSellerVerified: true,
        isKycCompleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { businessName, phone, storeDescription, gstin, pickupAddress } = req.body;

    if (userId && mongoose.connection.readyState === 1) {
      await UserModel.findByIdAndUpdate(userId, {
        businessName,
        phone,
        storeDescription,
        gstin,
        pickupAddress,
      });
    }

    sendResponse(res, 200, true, 'Seller profile updated successfully', {
      seller: {
        businessName,
        phone,
        storeDescription,
        gstin,
        pickupAddress,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 1. Get all products submitted by seller with optional QC status filter
router.get('/products', async (req: any, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const products = await ProductRegistry.getSellerProducts(status);
    sendResponse(res, 200, true, 'Seller products retrieved successfully', { products });
  } catch (error) {
    next(error);
  }
});

// 2. Submit new product for QC or save as Draft (with Cloudinary photo upload)
router.post('/products', async (req: any, res: Response, _next: NextFunction) => {
  try {
    const {
      title,
      brand,
      sku,
      price,
      discountPrice,
      stock,
      category,
      hsnCode,
      description,
      highlights,
      ingredients,
      howToUse,
      images,
      isDraft,
    } = req.body;

    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now().toString().slice(-4)
      : `product-${Date.now()}`;

    // Upload photos to Cloudinary CDN
    let cdnImages: string[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      cdnImages = await CloudinaryService.uploadMultipleImages(images, 'smreen_products');
    }

    const newProduct = await ProductRegistry.addProduct({
      title,
      brand,
      sku,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock) || 10,
      category,
      hsnCode,
      description,
      highlights: Array.isArray(highlights) ? highlights : [],
      ingredients,
      howToUse,
      slug,
      images: cdnImages.length > 0 ? cdnImages : images,
      approvalStatus: isDraft ? 'DRAFT' : 'PENDING',
    });

    const msg = isDraft
      ? 'Product saved as Draft'
      : 'Product submitted successfully for Admin Quality Check (QC)';

    sendResponse(res, 201, true, msg, { product: newProduct });
  } catch (error: any) {
    console.error('Error in POST /api/seller/products:', error);
    sendError(res, 400, error.message || 'Failed to submit product', error);
  }
});

// 3. Update or Resubmit an existing listing (e.g. fix QC Failed errors)
router.put('/products/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      brand,
      sku,
      price,
      discountPrice,
      stock,
      category,
      hsnCode,
      description,
      highlights,
      ingredients,
      howToUse,
      images,
      resubmitForQc,
    } = req.body;

    let cdnImages: string[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      cdnImages = await CloudinaryService.uploadMultipleImages(images, 'smreen_products');
    }

    const updated = await ProductRegistry.updateProduct(id, {
      title,
      brand,
      sku,
      price: price !== undefined ? Number(price) : undefined,
      discountPrice: discountPrice !== undefined ? Number(discountPrice) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      category,
      hsnCode,
      description,
      highlights,
      ingredients,
      howToUse,
      images: cdnImages.length > 0 ? cdnImages : images,
      approvalStatus: resubmitForQc ? 'PENDING' : undefined,
    });

    if (!updated) {
      sendError(res, 404, 'Product not found');
      return;
    }

    sendResponse(res, 200, true, 'Product updated & resubmitted for QC review', { product: updated });
  } catch (error) {
    next(error);
  }
});

// 4. Delete product listing
router.delete('/products/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ProductRegistry.deleteProduct(id);
    sendResponse(res, 200, true, 'Product listing deleted successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
