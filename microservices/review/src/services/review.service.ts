import Review from "@review/src/models/review.model";
import type { IReview } from "@review/src/models/review.model";
import { Types } from "mongoose";

// Create Review
export const createReview = async (data: Partial<IReview>) => {
  const review = new Review(data);
  await review.save();
  return (await review.populate("customer", "name")).populate("business", "name");
};

// Get All Reviews
export const getAllReviews = async () => {
  return Review.find().select('_id text rating').lean();
};

// Get Reviews by Business
export const getReviewsByBusiness = async (businessId: string) => {
  if (!Types.ObjectId.isValid(businessId)) return null;
  return Review.find({ business: businessId }).select('_id text rating').lean();
};

// Get Review by ID
export const getReviewById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Review.findById(id).select('_id text rating').lean();
};

// Update Review
export const updateReview = async (id: string, updates: Partial<IReview>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Review.findByIdAndUpdate(id, updates, { new: true }).select('_id text rating').lean();
};

// Delete Review
export const deleteReview = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Review.findByIdAndDelete(id).select('_id text rating').lean();
};
