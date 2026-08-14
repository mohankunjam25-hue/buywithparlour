import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/facets', ProductController.getFacets);
router.get('/suggestions', ProductController.getSuggestions);
router.get('/:slug', ProductController.getProductBySlug);

// Admin Protected Routes
router.post('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), ProductController.createProduct);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), ProductController.updateProduct);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), ProductController.deleteProduct);

export default router;
