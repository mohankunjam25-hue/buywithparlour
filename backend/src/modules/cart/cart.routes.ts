import { Router, Response, NextFunction } from 'express';
import { CartService } from './cart.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { sendResponse, sendError } from '../../utils/response';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await CartService.getCart(req.user!.userId);
    sendResponse(res, 200, true, 'Cart retrieved', { cart });
  } catch (error) {
    next(error);
  }
});

router.post('/items', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity, variantSku } = req.body;
    const cart = await CartService.addToCart(req.user!.userId, productId, quantity || 1, variantSku);
    sendResponse(res, 200, true, 'Item added to cart', { cart });
  } catch (error) {
    if (error instanceof Error && (error.message.includes('not found') || error.message.includes('stock'))) {
      sendError(res, 400, error.message);
      return;
    }
    next(error);
  }
});

router.delete('/items/:productId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { variantSku } = req.query;
    const cart = await CartService.removeFromCart(req.user!.userId, req.params.productId, variantSku as string);
    sendResponse(res, 200, true, 'Item removed from cart', { cart });
  } catch (error) {
    next(error);
  }
});

export default router;
