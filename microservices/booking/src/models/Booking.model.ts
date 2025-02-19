import { Schema, model, Document } from "mongoose";

// 1️⃣ TypeScript Interface για Type Safety
export interface IBooking extends Document {
  customer: Schema.Types.ObjectId; // Αναφορά σε User
  business: Schema.Types.ObjectId; // Αναφορά σε Business
  service: string; // Ποια υπηρεσία κλείστηκε
  date: Date; // Ημερομηνία κράτησης
  status: "pending" | "confirmed" | "canceled" | "completed"; // Κατάσταση κράτησης
  createdAt: Date;
}

// 2️⃣ Mongoose Schema
const BookingSchema = new Schema<IBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "completed"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3️⃣ Δημιουργία Model
const Booking = model<IBooking>("Booking", BookingSchema);

export default Booking;
