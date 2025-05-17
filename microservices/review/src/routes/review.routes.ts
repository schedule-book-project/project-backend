import express from "express";
import { authenticate } from "@shared/middlewares/auth.middleware";
import { reviewValidation } from "@shared/validations/validationSchemas";
import asyncHandler from "@shared/utils/asyncHandler";
import * as reviewController from "@review/src/controllers/review.controller";

const router = express.Router();

router.post(
  "/",
  authenticate,
  reviewValidation,
  asyncHandler(reviewController.createReview)
);
router.get("/", reviewController.getAllReviews);
router.get("/:businessId", reviewController.getReviewsByBusiness);
router.get("/:reviewId", reviewController.getReviewById);
router.put(
  "/:id",
  authenticate,
  reviewValidation,
  asyncHandler(reviewController.updateReview)
);
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
