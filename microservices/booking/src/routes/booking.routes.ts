import express from 'express';
import { authenticate } from '@shared/middlewares/auth.middleware';
import asyncHandler from '@shared/utils/asyncHandler';
import {
  createBookingValidation,
  updateBookingValidation,
} from '@shared/validations/validationSchemas';
import * as bookingController from '@booking/src/controllers/booking.controller';

const router = express.Router();

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreationPayload'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError' # e.g., if trying to book for another user
 */
router.post(
  '/',
  authenticate,
  createBookingValidation,
  asyncHandler(bookingController.createBooking),
);

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get all bookings (admin or service-to-service)
 *     description: Retrieves a list of all bookings. Access should be restricted.
 *     security:
 *       - bearerAuth: [] # Typically admin only or for specific query parameters like userId/businessId
 *     responses:
 *       200:
 *         description: A list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookingResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.get('/', authenticate, asyncHandler(bookingController.getBookings)); // Added authenticate

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get a booking by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking to retrieve
 *         schema:
 *           type: string
 *           example: '605c724f544047cdc3844819'
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # For invalid ID format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError' # If user doesn't own booking
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, asyncHandler(bookingController.getBookingById)); // Added authenticate

/**
 * @openapi
 * /api/bookings/{id}:
 *   put:
 *     tags:
 *       - Bookings
 *     summary: Update an existing booking
 *     description: Allows updating details of a booking, like status or notes.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingUpdatePayload'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
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
  updateBookingValidation,
  asyncHandler(bookingController.updateBooking),
);

/**
 * @openapi
 * /api/bookings/{id}:
 *   delete:
 *     tags:
 *       - Bookings
 *     summary: Delete (cancel) a booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the booking to delete/cancel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted/cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking deleted
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
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
  asyncHandler(bookingController.deleteBooking),
);

export default router;
