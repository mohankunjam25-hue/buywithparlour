import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { sendResponse, sendError } from '../../utils/response';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const brand = req.query.brand as string | undefined;
      const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
      const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
      const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;
      const sort = req.query.sort as 'price_asc' | 'price_desc' | 'newest' | 'rating' | undefined;
      const inStock = req.query.inStock as string | undefined;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 24;

      const result = await ProductService.getProducts({
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        sort,
        page,
        limit,
      });

      sendResponse(res, 200, true, 'Products retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  static async getFacets(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const facets = await ProductService.getFacets();
      sendResponse(res, 200, true, 'Dynamic product facets fetched', { facets });
    } catch (error) {
      next(error);
    }
  }

  static async getSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const suggestions = await ProductService.getSuggestions(q);
      sendResponse(res, 200, true, 'Search suggestions fetched', suggestions);
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      sendResponse(res, 200, true, 'Product details fetched', { product });
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        sendError(res, 404, error.message);
        return;
      }
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body);
      sendResponse(res, 201, true, 'Product created successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      sendResponse(res, 200, true, 'Product updated successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProductService.deleteProduct(req.params.id);
      sendResponse(res, 200, true, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
