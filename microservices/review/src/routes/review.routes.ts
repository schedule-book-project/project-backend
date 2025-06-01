import express from 'express';
import { authenticate } from '@shared/middlewares/auth.middleware';
import { reviewValidation } from '@shared/validations/validationSchemas';
import asyncHandler from '@shared/utils/asyncHandler';
import * as reviewController from '@review/src/controllers/review.controller';

const router = express.Router();

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a new review for a business
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewCreationPayload'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 review:
 *                   $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  authenticate,
  reviewValidation,
  asyncHandler(reviewController.createReview),
);

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews (use with caution, can be a large dataset)
 *     description: Retrieves all reviews. Consider pagination for production.
 *     responses:
 *       200:
 *         description: A list of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReviewResponse'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/', asyncHandler(reviewController.getAllReviews)); // Publicly accessible

/**
 * @openapi
 * /api/reviews/business/{businessId}: # Changed path for clarity from /:businessId to avoid conflict
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get all reviews for a specific business
 *     parameters:
 *       - name: businessId
 *         in: path
 *         required: true
 *         description: ID of the business to fetch reviews for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews for the specified business
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # For invalid businessId
 *       404:
 *         $ref: '#/components/responses/NotFoundError' # If business itself not found or no reviews
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/business/:businessId', asyncHandler(reviewController.getReviewsByBusiness)); // Publicly accessible

/**
 * @openapi
 * /api/reviews/{reviewId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get a specific review by its ID
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         description: ID of the review to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  review:
 *                    $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # For invalid reviewId
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/:reviewId', asyncHandler(reviewController.getReviewById)); // Publicly accessible, assuming reviewId is unique enough

/**
 * @openapi
 * /api/reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: Update an existing review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdatePayload'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 review:
 *                   $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError' # If user doesn't own review
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id',
  authenticate,
  reviewValidation,
  asyncHandler(reviewController.updateReview),
);

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Review deleted
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, asyncHandler(reviewController.deleteReview));

export default router;
