import express from "express";
import Review from "../models/review.model.ts";

// Create a review
export const createReview = async (req: express.Request, res: express.Response) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
}

// Get all the reviews for a business
export const getReviewsByBusiness = async (req: express.Request, res: express.Response) => {
    try {
        const reviews = await Review.find({ business: req.params.businessId }).populate("customer business");
        res.json(reviews);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}

// Get review by ID
export const getReviewById = async (req: express.Request, res: express.Response) => {
    try {
        const review = await Review.findById(req.params.id).populate("customer business");
        if (!review) {
            res.status(404).json({ message: "Review not found" });
            return;
        }
        res.json(review);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}

// Update a review
export const updateReview = async (req: express.Request, res: express.Response) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(review);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
}

// Delete review
export const deleteReview = async (req: express.Request, res: express.Response) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}