import express from "express";
import adminRoutes from "./adminRoutes.ts";
import bookingRoutes from "./bookingRoutes.ts";
import businessRoutes from "./businessRoutes.ts";
import reviewRoutes from "./reviewRoutes.ts";
import userRoutes from "./userRoutes.ts";

const router = express.Router();

// Σύνδεση όλων των routes
router.use("/users", userRoutes);
router.use("/businesses", businessRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admins", adminRoutes);

export default router;
