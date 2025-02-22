import express from "express";
import adminRoutes from "../microservices/admin/src/routes/admin.routes.ts";
import bookingRoutes from "../microservices/booking/src/routes/booking.routes.ts";
import businessRoutes from "../microservices/business/src/routes/business.routes.ts";
import reviewRoutes from "../microservices/review/src/routes/review.routes.ts";
import userRoutes from "../microservices/user/src/routes/user.routes.ts";
import authRoutes from "../microservices/auth/src/routes/auth.routes";

const router = express.Router();

// Σύνδεση όλων των routes
router.use("/users", userRoutes);
router.use("/businesses", businessRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admins", adminRoutes);
router.use("/auth", authRoutes);

export default router;
