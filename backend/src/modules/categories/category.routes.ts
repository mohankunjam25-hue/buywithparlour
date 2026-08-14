import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { CategoryModel } from './category.model';
import { sendResponse } from '../../utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';

const router = Router();

const mockCategories = [
  { _id: '66bc22222222222222222222', name: 'Skin Care', slug: 'skin-care', description: 'Serums, moisturizers, and face masks' },
  { _id: '66bc22222222222222222223', name: 'Hair Care', slug: 'hair-care', description: 'Keratin treatments, shampoos, and oils' },
  { _id: '66bc22222222222222222224', name: 'Makeup', slug: 'makeup', description: 'Lipsticks, foundations, and eye makeup' },
  { _id: '66bc22222222222222222225', name: 'Hair Styling', slug: 'hair-styling', description: 'Professional dryers and straighteners' },
  { _id: '66bc22222222222222222226', name: 'Salon Equipment', slug: 'salon-equipment', description: 'Bulk salon equipment and accessories' },
];

router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const categories = await CategoryModel.find().populate('parentCategory', 'name slug');
      if (categories.length > 0) {
        sendResponse(res, 200, true, 'Categories fetched', { categories });
        return;
      }
    } catch (error) {
      console.warn('[CategoryRoutes] Database lookup skipped, serving mock categories');
    }
  }

  sendResponse(res, 200, true, 'Categories fetched', { categories: mockCategories });
});

router.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await CategoryModel.create(req.body);
    sendResponse(res, 201, true, 'Category created', { category });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendResponse(res, 200, true, 'Category updated', { category });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CategoryModel.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
