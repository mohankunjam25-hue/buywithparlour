import { Router, Response, NextFunction } from 'express';
import { UserModel } from './user.model';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { hashPassword, comparePassword } from '../../utils/password';
import { sendResponse, sendError } from '../../utils/response';

const router = Router();
router.use(authenticate);

// 1. Update Profile (Name, Phone)
router.put('/profile', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user!.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    if (name && name.trim().length >= 2) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim() || undefined;

    await user.save();

    sendResponse(res, 200, true, 'Profile updated successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. Add New Address
router.post('/addresses', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;
    const userId = req.user!.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    if (!street || !city || !state || !pincode) {
      sendError(res, 400, 'Street, City, State, and Pincode are required.');
      return;
    }

    const newAddress: any = {
      fullName: fullName?.trim() || user.name,
      phone: phone?.trim() || user.phone || '9876543210',
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: Boolean(isDefault),
    };

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();

    sendResponse(res, 201, true, 'Address added successfully', {
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
});

// 3. Delete Address
router.delete('/addresses/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    user.addresses = user.addresses.filter((a: any) => a._id?.toString() !== id && a.id !== id);
    await user.save();

    sendResponse(res, 200, true, 'Address deleted successfully', {
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
});

// 4. Change Password
router.put('/change-password', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    if (!oldPassword || !newPassword || newPassword.length < 6) {
      sendError(res, 400, 'New password must be at least 6 characters.');
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) {
      sendError(res, 400, 'Incorrect current password.');
      return;
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    sendResponse(res, 200, true, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
