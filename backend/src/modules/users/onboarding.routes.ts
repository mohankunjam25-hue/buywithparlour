import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { verifyBankAccount, verifyGstin } from '../../services/verification.service';
import { sendResponse, sendError } from '../../utils/response';
import { UserModel } from './user.model';
import mongoose from 'mongoose';

const router = Router();

router.use(authenticate);

// 1. Verify Bank Account (Penny Drop ₹1 Test API)
router.post('/verify-bank', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { accountNumber, ifsc, holderName } = req.body;
    if (!accountNumber || !ifsc) {
      sendError(res, 400, 'Account Number and IFSC Code are required.');
      return;
    }

    const result = await verifyBankAccount(accountNumber, ifsc, holderName);
    if (!result.verified) {
      sendError(res, 400, result.message, result);
      return;
    }

    sendResponse(res, 200, true, result.message, { verification: result });
  } catch (error) {
    next(error);
  }
});

// 2. Verify GSTIN Document
router.post('/verify-gstin', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { gstin } = req.body;
    if (!gstin) {
      sendError(res, 400, 'GSTIN Number is required.');
      return;
    }

    const result = await verifyGstin(gstin);
    if (!result.verified) {
      sendError(res, 400, result.message, result);
      return;
    }

    sendResponse(res, 200, true, result.message, { verification: result });
  } catch (error) {
    next(error);
  }
});

// 3. Complete Mandatory Seller Business Onboarding & Unlock Dashboard
router.post('/complete', async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const { businessName, phone, accountNumber, ifsc } = req.body;

    if (!businessName || !phone || !accountNumber || !ifsc) {
      sendError(res, 400, 'Please complete all required onboarding fields (*).');
      return;
    }

    if (mongoose.connection.readyState === 1) {
      await UserModel.findByIdAndUpdate(req.user!.userId, {
        businessName,
        phone,
        isSellerVerified: true,
        isKycCompleted: true,
        kycStatus: 'VERIFIED',
      });
    }

    sendResponse(res, 200, true, '🎉 Seller Business Onboarding & KYC Completed! Studio Dashboard Unlocked.', {
      isKycCompleted: true,
      businessName,
    });
  } catch (error) {
    sendError(res, 500, 'Failed to complete seller onboarding', error);
  }
});

export default router;
