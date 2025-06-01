import Review from '@review/src/models/review.model';
import type { IReview } from '@review/src/models/review.model';
import { Types } from 'mongoose';

// Create Review
export const createReview = async (
  data: Partial<IReview>,
): Promise<IReview> => {
  const review = new Review(data);
  await review.save();
  return (await review.populate('customer', 'name')).populate(
    'business',
    'name',
  );
};

// Get All Reviews
export const getAllReviews = async (): Promise<
  Pick<IReview, '_id' | 'comment' | 'rating'>[]
> => {
  return Review.find().select('_id comment rating').lean() as Pick<
    IReview,
    '_id' | 'comment' | 'rating'
  >[];
};

// Get Reviews by Business
export const getReviewsByBusiness = async (
  businessId: string,
): Promise<Pick<IReview, '_id' | 'comment' | 'rating'>[] | null> => {
  if (!Types.ObjectId.isValid(businessId)) {
    return null;
  }
  return Review.find({ business: businessId })
    .select('_id comment rating')
    .lean() as Pick<IReview, '_id' | 'comment' | 'rating'>[] | null;
};

// Get Review by ID
export const getReviewById = async (
  id: string,
): Promise<Pick<IReview, '_id' | 'comment' | 'rating'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Review.findById(id).select('_id comment rating').lean() as Pick<
    IReview,
    '_id' | 'comment' | 'rating'
  > | null;
};

// Update Review
export const updateReview = async (
  id: string,
  updates: Partial<IReview>,
): Promise<Pick<IReview, '_id' | 'comment' | 'rating'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Review.findByIdAndUpdate(id, updates, { new: true })
    .select('_id comment rating')
    .lean() as Pick<IReview, '_id' | 'comment' | 'rating'> | null;
};

// Delete Review
export const deleteReview = async (
  id: string,
): Promise<Pick<IReview, '_id' | 'comment' | 'rating'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Review.findByIdAndDelete(id)
    .select('_id comment rating')
    .lean() as Pick<IReview, '_id' | 'comment' | 'rating'> | null;
};
