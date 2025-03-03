import { Schema, model, Document } from "mongoose";

// 1️⃣ TypeScript Interface for Type Safety
export interface IBooking extends Document {
  customer: Schema.Types.ObjectId;
  business: Schema.Types.ObjectId;
  service: {
    name: string,
    price: number,
    duration: number
  };
  date: Date;
  timezone: string
  status: "pending" | "confirmed" | "canceled" | "completed"; 
  price?: number;
  notes?: string;
  review?: Schema.Types.ObjectId;
  createdAt: Date;
}

// 2️⃣ Mongoose Schema
const BookingSchema = new Schema<IBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    service: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true }, // in minutes
    },
    date: { type: Date, required: true },
    timezone: { type: String, default: "UTC" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "completed"],
      default: "pending",
    },
    price: { type: Number },
    notes: { type: String },
    review: { type: Schema.Types.ObjectId, ref: "Review" },
  },
  { timestamps: true }
);

// 3️⃣ Model Creation
const Booking = model<IBooking>("Booking", BookingSchema);

export default Booking;
