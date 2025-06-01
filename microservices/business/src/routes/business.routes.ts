import express, { type Request, type Response } from 'express';
import {
  createBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
} from '../services/business.service'; // Assuming service functions handle their own errors and return null/throw for not found
import { authenticate } from '@shared/middlewares/auth.middleware';
import asyncHandler from '@shared/utils/asyncHandler';
import { businessValidation } from '@shared/validations/validationSchemas'; // Assuming this handles creation/update validation

const router = express.Router();

/**
 * @openapi
 * /api/business:
 *   post:
 *     tags:
 *       - Businesses
 *     summary: Create a new business profile
 *     description: Creates a new business profile. The authenticated user is expected to be the owner.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessCreationPayload'
 *     responses:
 *       201:
 *         description: Business profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 business:
 *                   $ref: '#/components/schemas/BusinessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  authenticate,
  businessValidation,
  asyncHandler(async (req: Request, res: Response) => {
    // Note: The 'owner' field logic that was previously commented out might need to be implemented here or in the service layer.
    // For example: const ownerId = req.admin?.id; if (!ownerId) { throw new ApiErrorModel(401, 'Not authenticated'); }
    // Then pass { ...req.body, ownerId } to createBusiness if your model supports it.
    // Current IBusiness model does not have an 'owner' field.
    const business = await createBusiness(req.body);
    res.status(201).json({ success: true, business });
  }),
);

/**
 * @openapi
 * /api/business:
 *   get:
 *     tags:
 *       - Businesses
 *     summary: Get all business profiles
 *     description: Retrieves a list of all businesses. This might be a public route or require specific permissions.
 *     responses:
 *       200:
 *         description: A list of business profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 businesses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BusinessResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse' # Using generic ErrorResponse from shared
 */
router.get(
  '/',
  // No 'authenticate' here to make it public, add if needed
  asyncHandler(async (_req: Request, res: Response) => {
    const businesses = await getAllBusinesses();
    res.status(200).json({ success: true, businesses });
  }),
);

/**
 * @openapi
 * /api/business/{id}:
 *   get:
 *     tags:
 *       - Businesses
 *     summary: Get a specific business profile by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the business to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 business:
 *                   $ref: '#/components/schemas/BusinessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get(
  '/:id',
  // No 'authenticate' here to make it public, add if needed
  asyncHandler(async (req: Request, res: Response) => {
    const business = await getBusinessById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    res.status(200).json({ success: true, business });
  }),
);

/**
 * @openapi
 * /api/business/{id}:
 *   put:
 *     tags:
 *       - Businesses
 *     summary: Update a business profile
 *     description: Allows updating details of a business. User must be authenticated and typically authorized (e.g., owner or admin).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the business to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusinessUpdatePayload'
 *     responses:
 *       200:
 *         description: Business profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 business:
 *                   $ref: '#/components/schemas/BusinessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id',
  authenticate,
  businessValidation,
  asyncHandler(async (req: Request, res: Response) => {
    const business = await updateBusiness(req.params.id, req.body);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found or update failed' });
    }
    res.status(200).json({ success: true, business });
  }),
);

/**
 * @openapi
 * /api/business/{id}:
 *   delete:
 *     tags:
 *       - Businesses
 *     summary: Delete a business profile
 *     description: Deletes a business profile. User must be authenticated and typically authorized.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the business to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Business deleted'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const business = await deleteBusiness(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    res.status(200).json({ success: true, message: 'Business deleted' });
  }),
);

export default router;
