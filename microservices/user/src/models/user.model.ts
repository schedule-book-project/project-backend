import { Document, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Enum-like type for user roles in the system.
 */

export enum UserRole {
  Customer = 'customer',

  Business = 'business',

  Admin = 'admin',

  SuperAdmin = 'superadmin',

  Moderator = 'moderator',
}

/**
 * Interface representing a user in the system.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
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
      enum: Object.values(UserRole),
      required: true,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

/**
 * Pre-save hook to hash the user's password before saving.
 */
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password') || !this.password) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error: Error) {
    // Changed to Error type
    // Assuming logger is not available or easily injectable into model files directly.
    // If it were, logger.error('Pre-save hook error hashing password:', { errorDetail: error });
    // For now, keeping console.error as it's a model file, or use a more generic error.
    // Or rethrow a more specific error type if needed by application logic.
    // The primary fix here is the 'any' type.
    console.error('Pre-save hook error hashing password:', error); // Kept console.error for now, or could be next(error) only
    next(error);
  }
});

/**
 * Method to compare a plain text password with the hashed password.
 */
UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

/**
 * Mongoose Model creation
 */
const User = model<IUser>('User', UserSchema);

export default User;
