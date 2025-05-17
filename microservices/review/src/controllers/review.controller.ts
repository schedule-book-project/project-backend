import express from "express";
import * as reviewService from "@review/src/services/review.service";
import { Types } from "mongoose";
import { ApiErrorModel } from '../../../../shared/models/error.model';

// Create Review
export const createReview = async (req: express.Request, res: express.Response) => {
  try {
    const review = await reviewService.createReview({
      ...req.body,
      customer: (req as any).user.userId,
    });
    res.status(201).json({ success: true, review });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get all the reviews
export const getAllReviews = async (req: express.Request, res: express.Response) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ success: true, reviews });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
}

// Get Reviews for a Business
export const getReviewsByBusiness = async (req: express.Request, res: express.Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.businessId)) {
      res.status(400).json({ error: "Invalid Business ID" });
      return
    }

    const reviews = await reviewService.getReviewsByBusiness(req.params.businessId);
    res.status(200).json({ success: true, reviews });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get Review by ID
export const getReviewById = async (req: express.Request, res: express.Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid Review ID" });
      return
    }

    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return
    }

    res.json({ success: true, review });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Update Review
export const updateReview = async (req: express.Request, res: express.Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid Review ID" });
      return
    }

    const review = await reviewService.updateReview(req.params.id, req.body);
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return
    }

    res.json({ success: true, review });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Delete Review
export const deleteReview = async (req: express.Request, res: express.Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid Review ID" });
      return
    }

    const deleted = await reviewService.deleteReview(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Review not found" });
      return
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};
