import { Document, model, Schema } from 'mongoose';

// 1️⃣ TypeScript Interface for Type Safety
export interface IBusiness extends Document {
  name: string;
  email: string;
  password: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  services: string[];
  availability: {
    day: string;
    open: string;
    close: string;
  }[];
  rating: number;
  reviews: string[];
  createdAt: Date;
}

// 2️⃣ Mongoose Schema
const BusinessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
    },
    services: [{ type: String, required: true }],
    availability: [
      {
        day: { type: String, required: true },
        open: { type: String, required: true },
        close: { type: String, required: true },
      },
    ],
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// 3️⃣ Model Creation
const Business = model<IBusiness>('Business', BusinessSchema);

export default Business;
