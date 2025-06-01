import express from 'express';
import * as reviewService from '@review/src/services/review.service';
import { Types } from 'mongoose';
import { ApiErrorModel } from '../../../../shared/models/error.model';
import { sanitizeInput } from '../../../../shared/utils/sanitizeInput';
import logger from '../../../../shared/logger/logger';

// AuthenticatedRequest is no longer needed here, using augmented express.Request

// Create Review
export const createReview = async (
  req: express.Request, // Changed to express.Request
  res: express.Response,
): Promise<void> => {
  try {
    const sanitizedReviewText = sanitizeInput(req.body.text);

    const review = await reviewService.createReview({
      ...req.body,
      text: sanitizedReviewText,
      customer: req.admin?.id, // Using req.admin.id from AuthenticatedRequest
    });
    res.status(201).json({ success: true, review });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    logger.error('Error in review controller creating review:', {
      details: message,
    });
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get all the reviews
export const getAllReviews = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ success: true, reviews });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    logger.error('Error in review controller getting all reviews:', {
      details: message,
    });
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get Reviews for a Business
export const getReviewsByBusiness = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.businessId)) {
      res.status(400).json({ error: 'Invalid Business ID' });
      return;
    }

    const reviews = await reviewService.getReviewsByBusiness(
      req.params.businessId,
    );
    res.status(200).json({ success: true, reviews });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    logger.error('Error in review controller getting reviews by business:', {
      details: message,
    });
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get Review by ID
export const getReviewById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid Review ID' });
      return;
    }

    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({ success: true, review });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    logger.error('Error in review controller getting review by ID:', {
      details: message,
    });
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Update Review
export const updateReview = async (
  req: express.Request, // Changed to express.Request
  res: express.Response,
): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid Review ID' });
      return;
    }

    const sanitizedReviewText = sanitizeInput(req.body.text);

    const review = await reviewService.updateReview(req.params.id, {
      ...req.body,
      text: sanitizedReviewText,
    });
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({ success: true, review });
  } catch (error: unknown) {
    // Changed to unknown
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    logger.error('Error in review controller updating review:', {
      details: message,
    }); // Corrected logger message
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Delete Review
export const deleteReview = async (
  req: express.Request, // Changed to express.Request
  res: express.Response,
): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Invalid Review ID' });
      return;
    }

    const deleted = await reviewService.deleteReview(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    logger.error('Error in review controller deleting review:', {
      details: message,
    }); // Corrected logger message
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};
