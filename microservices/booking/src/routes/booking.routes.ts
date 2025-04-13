import express from "express";
import * as bookingController from "../controllers/booking.controller.ts";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";


const router = express.Router();

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.post("/", authenticate, bookingController.createBooking);

/**
 * @swagger
 * /booking:
 *   get:
 *     summary: Retrieve all bookings
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get("/", bookingController.getBookings);

/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Retrieve a booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.get("/:id", bookingController.getBookingById);

/**
 * @swagger
 * /booking/{id}:
 *   put:
 *     summary: Update a booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.put("/:id", authenticate, bookingController.updateBooking);

/**
 * @swagger
 * /booking/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 */
router.delete("/:id", authenticate, bookingController.deleteBooking);

export default router;
