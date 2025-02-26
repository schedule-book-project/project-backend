import express from "express";
import { createReview, deleteReview, getReviewById, getReviewsByBusiness, updateReview } from "../controllers/reviewController";

const router = express.Router();

// Create a review
router.post("/", createReview);

// Get all the reviews for a business
router.get("/business/:businessId", getReviewsByBusiness);

// Get review by ID
router.get("/:id", getReviewById);

// Update a review
router.put("/:id", updateReview);

// Delete review
router.delete("/:id", deleteReview);

export default router;
