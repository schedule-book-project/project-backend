import { Schema, model, Document } from "mongoose";

// 1️⃣ TypeScript Interface για Type Safety
export interface IReview extends Document {
  customer: Schema.Types.ObjectId; // Αναφορά στον χρήστη που κάνει την κριτική
  business: Schema.Types.ObjectId; // Αναφορά στην επιχείρηση που αξιολογείται
  rating: number; // Βαθμολογία (1-5)
  comment?: string; // Προαιρετικό σχόλιο
  createdAt: Date;
}

// 2️⃣ Mongoose Schema
const ReviewSchema = new Schema<IReview>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3️⃣ Δημιουργία Model
const Review = model<IReview>("Review", ReviewSchema);

export default Review;
