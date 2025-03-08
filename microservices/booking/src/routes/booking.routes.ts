import express from "express";
import * as bookingController from "../controllers/booking.controller.ts";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";


const router = express.Router();

router.post("/", authenticate, bookingController.createBooking);
router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", authenticate, bookingController.updateBooking);
router.delete("/:id", authenticate, bookingController.deleteBooking);

export default router;
