import { Schema, model, Document } from "mongoose";

// 1️⃣ TypeScript Interface για Type Safety
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
  reviews: string[]; // IDs από τις κριτικές
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
    services: [{ type: String, required: true }], // Π.χ. ["Κούρεμα", "Μασάζ"]
    availability: [
      {
        day: { type: String, required: true }, // Π.χ. "Monday"
        open: { type: String, required: true }, // Π.χ. "09:00"
        close: { type: String, required: true }, // Π.χ. "18:00"
      },
    ],
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3️⃣ Δημιουργία Model
const Business = model<IBusiness>("Business", BusinessSchema);

export default Business;