import Review from "../models/review.model";

export const createReview = async (data: any) => {
    const review = new Review(data);
    await review.save();
    return review;
};

export const getAllReviews = async () => {
    return Review.find().populate("reviewer business");
};

export const getReviewsByBusiness = async (businessId: string) => {
    return Review.find({business: businessId}).populate("reviewer");
};

export const deleteReview = async (id: string) => {
    return Review.findByIdAndDelete(id);
};
