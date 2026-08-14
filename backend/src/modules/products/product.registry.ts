import mongoose from 'mongoose';
import { ProductModel } from './product.model';

export type ProductQCStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RegisteredProduct {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  sku?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: any;
  hsnCode?: string;
  description: string;
  highlights?: string[];
  ingredients?: string;
  howToUse?: string;
  images: string[];
  seller?: any;
  approvalStatus: ProductQCStatus;
  rejectionReason?: string;
  isPublished: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Shared Catalog (Guarantees 100% instant sync between Seller, Admin, and Customer Portals)
const inMemoryProducts: RegisteredProduct[] = [
  {
    _id: '66bc11111111111111111101',
    title: 'Vitamin C Face Serum with Hyaluronic Acid (30ml)',
    slug: 'vitamin-c-face-serum-30ml',
    brand: 'GlowSkin Pro',
    sku: 'GSP-VTC-30ML',
    price: 799,
    discountPrice: 499,
    stock: 50,
    category: { _id: 'cat_skincare', name: 'Skin Care', slug: 'skin-care' },
    hsnCode: '33049910',
    description: 'Brightening daily antioxidant facial serum formulated with 10% Vitamin C and pure hyaluronic acid for all skin types.',
    highlights: [
      '10% Pure L-Ascorbic Acid for radiant glow',
      'Hyaluronic acid for deep hydration',
      'Paraben and sulfate free formulation',
      'Dermatologically tested for sensitive skin',
    ],
    ingredients: '10% L-Ascorbic Acid, Hyaluronic Acid, Ferulic Acid, Aloe Barbadensis Leaf Juice',
    howToUse: 'Apply 3-4 drops on cleansed face and neck morning and evening before moisturizer.',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'],
    seller: { name: 'Pooja Beauty Lounge', email: 'pooja.seller@buywithparlour.com', businessName: 'Pooja Beauty Lounge & Spa Supplies' },
    approvalStatus: 'APPROVED',
    isPublished: true,
    rating: 4.8,
    reviewCount: 142,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: '66bc11111111111111111102',
    title: 'Organic Herbal Hair Spa Oil (200ml)',
    slug: 'organic-herbal-hair-spa-oil-200ml',
    brand: 'NatureRoots',
    sku: 'NR-HSO-200',
    price: 699,
    discountPrice: 499,
    stock: 45,
    category: { _id: 'cat_haircare', name: 'Hair Care', slug: 'hair-care' },
    hsnCode: '33059011',
    description: '100% pure cold-pressed botanical hair spa elixir enriched with Bhringraj, Amla, and Brahmi extracts for root strengthening.',
    highlights: [
      'Cold-pressed extraction preserves vital nutrients',
      'Enriched with Bhringraj & Brahmi',
      'Controls frizz and split ends',
    ],
    ingredients: 'Cold Pressed Sesame Oil, Bhringraj Extract, Amla Extract, Brahmi, Rosemary Essential Oil',
    howToUse: 'Warm a small amount and massage gently into scalp 1-2 hours before shampoo.',
    images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'],
    seller: { name: 'Pooja Beauty Lounge', email: 'pooja.seller@buywithparlour.com', businessName: 'Pooja Beauty Lounge & Spa Supplies' },
    approvalStatus: 'PENDING',
    isPublished: false,
    rating: 4.7,
    reviewCount: 88,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export class ProductRegistry {
  /**
   * Add a new product (submitted by Seller as PENDING QC or DRAFT)
   */
  static async addProduct(data: Partial<RegisteredProduct>): Promise<RegisteredProduct> {
    const newId = (data._id && mongoose.Types.ObjectId.isValid(data._id))
      ? String(data._id)
      : new mongoose.Types.ObjectId().toHexString();
    const isDraft = data.approvalStatus === 'DRAFT';

    const categoryId = (data.category && typeof data.category === 'object' && data.category._id && mongoose.Types.ObjectId.isValid(data.category._id))
      ? data.category._id
      : (data.category && typeof data.category === 'string' && mongoose.Types.ObjectId.isValid(data.category))
      ? data.category
      : new mongoose.Types.ObjectId();

    const product: RegisteredProduct = {
      _id: newId,
      title: data.title || 'Untitled Product',
      slug: data.slug || `product-${Date.now()}`,
      brand: data.brand || 'Generic Brand',
      sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
      price: Number(data.price) || 0,
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      stock: Number(data.stock) || 10,
      category: data.category || { _id: categoryId.toString(), name: 'Beauty & Personal Care', slug: 'beauty-personal-care' },
      hsnCode: data.hsnCode || '33049900',
      description: data.description || '',
      highlights: data.highlights && data.highlights.length > 0 ? data.highlights : ['Premium Salon Quality', 'Dermatologically Tested'],
      ingredients: data.ingredients || '',
      howToUse: data.howToUse || '',
      images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'],
      seller: data.seller || { name: 'Pooja Beauty Lounge', email: 'pooja.seller@buywithparlour.com', businessName: 'Pooja Beauty Lounge & Spa Supplies' },
      approvalStatus: isDraft ? 'DRAFT' : 'PENDING',
      isPublished: false,
      rating: 4.5,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save in memory
    inMemoryProducts.unshift(product);

    // Save in MongoDB Atlas
    if (mongoose.connection.readyState === 1) {
      try {
        await ProductModel.create({
          _id: new mongoose.Types.ObjectId(newId),
          title: product.title,
          slug: product.slug,
          brand: product.brand,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          category: categoryId,
          description: product.description,
          ingredients: product.ingredients,
          howToUse: product.howToUse,
          images: product.images,
          approvalStatus: product.approvalStatus,
          isPublished: product.isPublished,
          rating: product.rating,
          reviewCount: product.reviewCount,
        });
        console.log(`[ProductRegistry] 🎉 Successfully saved product to MongoDB Atlas: ${product.title} (ID: ${newId})`);
      } catch (err: any) {
        console.warn('[ProductRegistry] MongoDB save notice:', err.message);
      }
    }

    return product;
  }

  /**
   * Update existing product (e.g. edit draft or resubmit rejected listing back into QC)
   */
  static async updateProduct(id: string, updates: Partial<RegisteredProduct>): Promise<RegisteredProduct | null> {
    const item = inMemoryProducts.find((p) => p._id === id);
    if (!item) return null;

    Object.assign(item, updates, {
      updatedAt: new Date().toISOString(),
    });

    if (updates.approvalStatus === 'PENDING') {
      item.rejectionReason = undefined;
      item.isPublished = false;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await ProductModel.findByIdAndUpdate(id, item, { new: true });
      } catch (err) {
        console.warn('[ProductRegistry] MongoDB update notice:', err);
      }
    }

    return item;
  }

  /**
   * Delete product listing
   */
  static async deleteProduct(id: string): Promise<boolean> {
    const idx = inMemoryProducts.findIndex((p) => p._id === id);
    if (idx !== -1) {
      inMemoryProducts.splice(idx, 1);
    }
    if (mongoose.connection.readyState === 1) {
      try {
        await ProductModel.findByIdAndDelete(id);
      } catch (err) {
        console.warn('[ProductRegistry] MongoDB delete notice:', err);
      }
    }
    return true;
  }

  /**
   * Get seller products with optional QC status filtering
   */
  static async getSellerProducts(status?: string): Promise<RegisteredProduct[]> {
    let list = [...inMemoryProducts];
    if (status && status !== 'ALL') {
      if (status === 'LIVE' || status === 'APPROVED') {
        list = list.filter((p) => p.approvalStatus === 'APPROVED');
      } else if (status === 'IN_QC' || status === 'PENDING') {
        list = list.filter((p) => p.approvalStatus === 'PENDING');
      } else if (status === 'QC_FAILED' || status === 'REJECTED') {
        list = list.filter((p) => p.approvalStatus === 'REJECTED');
      } else if (status === 'DRAFT') {
        list = list.filter((p) => p.approvalStatus === 'DRAFT');
      }
    }
    return list;
  }

  /**
   * Get all pending products for Admin Quality Gate Desk
   */
  static async getPendingProducts(): Promise<RegisteredProduct[]> {
    return inMemoryProducts.filter((p) => p.approvalStatus === 'PENDING');
  }

  /**
   * Admin approves product (QC Passed -> Live on Customer Store)
   */
  static async approveProduct(id: string): Promise<RegisteredProduct | null> {
    const item = inMemoryProducts.find((p) => p._id === id);
    if (item) {
      item.approvalStatus = 'APPROVED';
      item.isPublished = true;
      item.rejectionReason = undefined;
      item.updatedAt = new Date().toISOString();
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await ProductModel.findByIdAndUpdate(
          id,
          { approvalStatus: 'APPROVED', isPublished: true, rejectionReason: undefined },
          { new: true }
        );
      } catch (err) {
        console.warn('[ProductRegistry] MongoDB approve notice:', err);
      }
    }

    return item || null;
  }

  /**
   * Admin rejects product (QC Failed -> Dispatches feedback to seller)
   */
  static async rejectProduct(id: string, reason?: string): Promise<RegisteredProduct | null> {
    const item = inMemoryProducts.find((p) => p._id === id);
    if (item) {
      item.approvalStatus = 'REJECTED';
      item.isPublished = false;
      item.rejectionReason = reason || 'Does not satisfy marketplace quality standards.';
      item.updatedAt = new Date().toISOString();
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await ProductModel.findByIdAndUpdate(
          id,
          { approvalStatus: 'REJECTED', isPublished: false, rejectionReason: reason || 'Does not satisfy marketplace quality standards.' },
          { new: true }
        );
      } catch (err) {
        console.warn('[ProductRegistry] MongoDB reject notice:', err);
      }
    }

    return item || null;
  }

  /**
   * Get all live published products for Customer Marketplace
   */
  static async getLiveProducts(): Promise<RegisteredProduct[]> {
    return inMemoryProducts.filter((p) => p.isPublished && p.approvalStatus === 'APPROVED');
  }

  /**
   * Get product by slug for Customer Store detail page
   */
  static async getProductBySlug(slug: string): Promise<RegisteredProduct | null> {
    return inMemoryProducts.find((p) => p.slug === slug) || inMemoryProducts[0] || null;
  }
}
