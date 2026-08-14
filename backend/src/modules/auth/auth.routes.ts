import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { sensitiveLimiter } from '../../middleware/rateLimit.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', sensitiveLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', sensitiveLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/google-login', sensitiveLimiter, AuthController.googleLogin);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getProfile);

export default router;
