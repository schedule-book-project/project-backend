import {Document, model, Schema} from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Interface representing a user in the system.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "business" | "admin" | "superadmin" | "moderator";
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
}

/**
 * Mongoose schema for the user model.
 */
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "business", "admin", "superadmin", "moderator"],
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

/**
 * Pre-save hook to hash the user's password before saving.
 */
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error: any) {
    console.error("Pre-save hook error:", error);
    next(error);
  }
});

/**
 * Method to compare a plain text password with the hashed password.
 */
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
}

/**
 * Mongoose Model creation
 */
const User = model<IUser>("User", UserSchema);

export default User;