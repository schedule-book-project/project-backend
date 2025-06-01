import express from 'express';
import * as locationsController from '../controllers/locations.controller';
import { authenticate } from '@shared/middlewares/auth.middleware';
import { locationValidation } from '@shared/validations/validationSchemas';
import asyncHandler from '@shared/utils/asyncHandler';

const router = express.Router();

router.get('/nearby', authenticate, locationsController.getNearbyPlaces);
router.get('/ip', authenticate, locationsController.getPlacesByIP);
router.post(
  '/address',
  authenticate,
  locationValidation,
  asyncHandler(locationsController.getPlacesByAddress),
);

export default router;
