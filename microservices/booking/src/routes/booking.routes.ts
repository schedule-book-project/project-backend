import express from "express";
import { createBooking, deleteBooking, getBookingById, getBookings, updateBooking } from "../controllers/bookingController";

const router = express.Router();

// Create booking
router.post("/", createBooking);

// Get bookings
router.get("/", getBookings);

// Get booking by ID
router.get("/:id", getBookingById);

// Update booking
router.put("/:id", updateBooking);

// Delete booking
router.delete("/:id", deleteBooking);

export default router;
