import express from "express";
import {createReview, deleteReview, getAllReviews, getReviewsByBusiness} from "../services/review.service";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const review = await createReview({ ...req.body, reviewer: (req as any).user.userId });
        res.status(201).json({ success: true, review });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const reviews = await getAllReviews();
        res.status(200).json({ success: true, reviews });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:businessId", async (req, res) => {
    try {
        const reviews = await getReviewsByBusiness(req.params.businessId);
        res.status(200).json({ success: true, reviews });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        await deleteReview(req.params.id);
        res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
