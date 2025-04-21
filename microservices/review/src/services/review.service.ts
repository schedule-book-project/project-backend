import Review from "../models/review.model";
import type { IReview } from "../models/review.model";
import { Types } from "mongoose";

// Create Review
export const createReview = async (data: Partial<IReview>) => {
  const review = new Review(data);
  await review.save();
  return (await review.populate("customer", "name")).populate("business", "name");
};

// Get All Reviews
export const getAllReviews = async () => {
  return Review.find()
    .populate("customer", "name email")
    .populate("business", "name location")
    .lean();
};

// Get Reviews by Business
export const getReviewsByBusiness = async (businessId: string) => {
  if (!Types.ObjectId.isValid(businessId)) return null;
  return Review.find({ business: businessId })
    .populate("customer", "name email")
    .lean();
};

// Get Review by ID
export const getReviewById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Review.findById(id)
    .populate("customer", "name email")
    .populate("business", "name location")
    .lean();
};

// Update Review
export const updateReview = async (id: string, updates: Partial<IReview>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Review.findByIdAndUpdate(id, updates, { new: true })
    .populate("customer", "name email")
    .populate("business", "name location")
    .lean();
};

// Delete Review
export const deleteReview = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Review.findByIdAndDelete(id);
};
