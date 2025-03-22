import { Document, model, Schema, Types } from "mongoose";

// TypeScript Interface for Type Safety
export interface IReview extends Document {
  customer: Types.ObjectId;
  business: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Mongoose Schema
const ReviewSchema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Model Creation
const Review = model<IReview>("Review", ReviewSchema);

export default Review;