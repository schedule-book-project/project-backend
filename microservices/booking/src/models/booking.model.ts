import { Document, model, Schema } from 'mongoose';

// 1️⃣ TypeScript Enum for Status

export enum BookingStatus {
  Pending = 'pending',

  Confirmed = 'confirmed',

  Canceled = 'canceled',

  Completed = 'completed',
}

// 2️⃣ TypeScript Interface for Type Safety
export interface IBooking extends Document {
  customer: Schema.Types.ObjectId;
  business: Schema.Types.ObjectId;
  service: {
    name: string;
    price: number;
    duration: number;
  };
  date: Date;
  timezone: string;
  status: BookingStatus;
  price?: number;
  notes?: string;
  review?: Schema.Types.ObjectId;
  createdAt: Date;
}

// 3️⃣ Mongoose Schema
const BookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    service: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true }, // in minutes
    },
    date: { type: Date, required: true, index: true },
    timezone: { type: String, default: 'UTC' },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
    price: { type: Number },
    notes: { type: String },
    review: { type: Schema.Types.ObjectId, ref: 'Review' },
  },
  { timestamps: true },
);

// 4️⃣ Auto-set Price Before Saving
BookingSchema.pre('save', function (next) {
  if (!this.price) {
    this.price = this.service.price;
  }
  next();
});

// 5️⃣ Model Creation
const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
