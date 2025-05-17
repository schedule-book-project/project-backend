import express from "express";
import { authenticate } from "@shared/middlewares/auth.middleware";
import asyncHandler from "@shared/utils/asyncHandler";
import { createBookingValidation, updateBookingValidation } from "@shared/validations/validationSchemas";
import * as bookingController from "@booking/src/controllers/booking.controller";


const router = express.Router();

router.post(
  "/",
  authenticate,
  createBookingValidation,
  asyncHandler(bookingController.createBooking)
);

router.get("/", asyncHandler(bookingController.getBookings));

router.get("/:id", asyncHandler(bookingController.getBookingById));

router.put(
  "/:id",
  authenticate,
  updateBookingValidation,
  asyncHandler(bookingController.updateBooking)
);

router.delete("/:id", authenticate, asyncHandler(bookingController.deleteBooking));

export default router;
