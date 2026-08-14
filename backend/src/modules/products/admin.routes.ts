import { Router, Response, NextFunction } from 'express';
import { ProductRegistry } from './product.registry';
import { sendResponse, sendError } from '../../utils/response';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';

const router = Router();

// Strict RBAC Guard: ONLY verified ADMIN & SUPER_ADMIN accounts can access QC Moderation
router.use(authenticate);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN'));

// Get all pending product submissions for Admin review
router.get('/products/pending', async (_req: any, res: Response, next: NextFunction) => {
  try {
    const products = await ProductRegistry.getPendingProducts();
    sendResponse(res, 200, true, 'Pending moderation queue fetched', { products });
  } catch (error) {
    next(error);
  }
});

// Approve product submission (Publishes live to Customer Marketplace)
router.patch('/products/:id/approve', async (req: any, res: Response, next: NextFunction) => {
  try {
    const product = await ProductRegistry.approveProduct(req.params.id);
    if (!product) {
      sendError(res, 404, 'Product not found in queue');
      return;
    }
    sendResponse(res, 200, true, 'Product approved and published live to customer marketplace', { product });
  } catch (error) {
    next(error);
  }
});

// Reject product submission with feedback
router.patch('/products/:id/reject', async (req: any, res: Response, next: NextFunction) => {
  try {
    const { rejectionReason } = req.body;
    const product = await ProductRegistry.rejectProduct(req.params.id, rejectionReason);
    if (!product) {
      sendError(res, 404, 'Product not found in queue');
      return;
    }
    sendResponse(res, 200, true, 'Product rejected with feedback', { product });
  } catch (error) {
    next(error);
  }
});

export default router;
