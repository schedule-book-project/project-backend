import express from 'express';
import {
  createBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
} from '../services/business.service';
import { authenticate } from '@shared/middlewares/auth.middleware';
import asyncHandler from '../../../../shared/utils/asyncHandler';
import { businessValidation } from '../../../../shared/validations/validationSchemas';

const router = express.Router();

// AuthenticatedRequest is no longer needed here, using augmented express.Request

router.post(
  '/',
  authenticate,
  businessValidation,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    // Changed to express.Request
    // Assuming 'owner' was meant to be derived from authenticated user,
    // but IBusiness does not have an 'owner' field.
    // For now, passing req.admin.id as 'owner' would be a type error for createBusiness.
    // If owner is truly needed, IBusiness and createBusiness service must be updated.
    // Removing 'owner' for now to satisfy createBusiness(data: Partial<IBusiness>)
    // const ownerId = req.admin?.id;
    // if (!ownerId) {
    //   return res.status(401).json({ success: false, message: 'User not authenticated or admin ID missing' });
    // }
    const business = await createBusiness({
      ...req.body,
      // owner: ownerId, // This would cause a type error if IBusiness doesn't have owner
    });
    res.status(201).json({ success: true, business });
  }),
);

router.get(
  '/',
  asyncHandler(async (_req: express.Request, res: express.Response) => {
    const businesses = await getAllBusinesses();
    res.status(200).json({ success: true, businesses });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const business = await getBusinessById(req.params.id);
    res.status(200).json({ success: true, business });
  }),
);

router.put(
  '/:id',
  authenticate,
  businessValidation,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const business = await updateBusiness(req.params.id, req.body);
    res.status(200).json({ success: true, business });
  }),
);

router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    await deleteBusiness(req.params.id);
    res.status(200).json({ success: true, message: 'Business deleted' });
  }),
);

export default router;
