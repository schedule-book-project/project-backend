import express, { type Request, type Response } from 'express'; // Changed to type-only imports
import { createProxyMiddleware } from 'http-proxy-middleware';
import { services } from '../config/services.config';
import { authenticate } from '../../../../shared/middlewares/auth.middleware.ts';
import { checkAllServicesHealth } from '../services/healthCheck.service';
import asyncHandler from '../../../../shared/utils/asyncHandler';

const router = express.Router();

// Aggregated health check route
router.get('/health-aggregated', asyncHandler(async (_req: Request, res: Response) => {
  const healthStatuses = await checkAllServicesHealth();
  res.status(200).json(healthStatuses);
}));

// Proxy for Admin Service
router.use(
  '/admin',
  authenticate,
  createProxyMiddleware({ target: services.admin, changeOrigin: true }),
);

// Proxy for Business Service
router.use(
  '/business',
  authenticate,
  createProxyMiddleware({ target: services.business, changeOrigin: true }),
);

// Proxy for Booking Service
router.use(
  '/booking',
  authenticate,
  createProxyMiddleware({ target: services.booking, changeOrigin: true }),
);

// Proxy for Review Service
router.use(
  '/review',
  authenticate,
  createProxyMiddleware({ target: services.review, changeOrigin: true }),
);

export default router;
