import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

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

// 3. Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 4. Compare password method
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
}

// 5. Δημιουργία του Mongoose Model
const User = model<IUser>("User", UserSchema);

export default User;