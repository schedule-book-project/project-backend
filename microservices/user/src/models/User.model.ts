import { Schema, model, Document } from "mongoose";

// 1. TypeScript Interface για Type Safety
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "business" | "admin";
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
}

// 2. Mongoose Schema για το User Model
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "business", "admin"],
      required: true,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3. Δημιουργία του Mongoose Model
const User = model<IUser>("User", UserSchema);

export default User;