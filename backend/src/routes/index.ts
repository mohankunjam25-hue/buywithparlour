import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import productRoutes from '../modules/products/product.routes';
import categoryRoutes from '../modules/categories/category.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/orders/order.routes';
import sellerRoutes from '../modules/products/seller.routes';
import adminRoutes from '../modules/products/admin.routes';
import onboardingRoutes from '../modules/users/onboarding.routes';
import userRoutes from '../modules/users/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/seller', sellerRoutes);
router.use('/seller/onboarding', onboardingRoutes);
router.use('/admin', adminRoutes);

export default router;
