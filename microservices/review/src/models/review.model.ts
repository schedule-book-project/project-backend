import { Document, model, Schema, Types } from 'mongoose';

/**
 * @openapi
 * components:
 *   schemas:
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '605d1f2c544047cdc384481b'
 *         customer: # User ID
 *           type: string
 *           example: '60564fcb544047cdc3844818'
 *         business: # Business ID
 *           type: string
 *           example: '605b035f544047cdc384481a'
 *         rating:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           nullable: true
 *           example: 'Great service and friendly staff!'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReviewCreationPayload:
 *       type: object
 *       required:
 *         - customer # Usually derived from auth token, but API might expect it if admin creates on behalf
 *         - business
 *         - rating
 *       properties:
 *         customer:
 *           type: string
 *           description: ID of the user submitting the review.
 *           example: '60564fcb544047cdc3844818'
 *         business:
 *           type: string
 *           description: ID of the business being reviewed.
 *           example: '605b035f544047cdc384481a'
 *         rating:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5.
 *           example: 4
 *         comment:
 *           type: string
 *           nullable: true
 *           example: 'Good experience overall.'
 *     ReviewUpdatePayload:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *           maximum: 5
 *           nullable: true
 *           example: 5
 *         comment:
 *           type: string
 *           nullable: true
 *           example: 'Updated my review: Even better on the second visit!'
 */

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
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true },
);

// Model Creation
const Review = model<IReview>('Review', ReviewSchema);

export default Review;
