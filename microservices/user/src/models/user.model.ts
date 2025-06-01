import { Document, model, Schema, Types } from 'mongoose'; // Added Types
import bcrypt from 'bcryptjs';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '60564fcb544047cdc3844818'
 *         name:
 *           type: string
 *           example: 'John Doe'
 *         email:
 *           type: string
 *           format: email
 *           example: 'john.doe@example.com'
 *         role:
 *           type: string
 *           enum: [customer, business, admin, superadmin, moderator] # Match UserRole enum
 *           example: 'customer'
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserCreationPayload:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: 'Jane Doe'
 *         email:
 *           type: string
 *           format: email
 *           example: 'jane.doe@example.com'
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8 # Assuming a password policy
 *           example: 'strongpassword123!'
 *         role:
 *           type: string
 *           enum: [customer, business, admin, superadmin, moderator] # Match UserRole enum
 *           default: 'customer'
 *           example: 'customer'
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *           nullable: true
 *     UserUpdatePayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: 'Jane Doe Updated'
 *         email:
 *           type: string
 *           format: email
 *           example: 'jane.doe.updated@example.com'
 *         role:
 *           type: string
 *           enum: [customer, business, admin, superadmin, moderator] # Match UserRole enum
 *           example: 'admin'
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *           nullable: true
 */

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
  } catch (error: unknown) { // Changed to unknown
    // Assuming logger is not available or easily injectable into model files directly.
    // If it were, logger.error('Pre-save hook error hashing password:', { errorDetail: error });
    // For now, keeping console.error as it's a model file.
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in pre-save hook';
    console.error('Pre-save hook error hashing password:', errorMessage, error); // Log message and original error
    // Ensure an Error object is passed to next()
    next(error instanceof Error ? error : new Error(errorMessage));
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
