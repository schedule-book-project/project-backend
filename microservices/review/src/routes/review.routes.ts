import express from "express";
import * as reviewController from "../controllers/review.controller.ts";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/", authenticate, reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:businessId", reviewController.getReviewsByBusiness);
router.get("/:reviewId", reviewController.getReviewById);
router.put("/:id", reviewController.updateReview)
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
