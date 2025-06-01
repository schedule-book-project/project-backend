import { Document, model, Schema, Types } from 'mongoose'; // Added Types

/**
 * @openapi
 * components:
 *   schemas:
 *     AvailabilitySlot: # Reusable schema for availability
 *       type: object
 *       required:
 *         - day
 *         - open
 *         - close
 *       properties:
 *         day:
 *           type: string
 *           example: 'Monday'
 *         open:
 *           type: string
 *           example: '09:00'
 *         close:
 *           type: string
 *           example: '17:00'
 *     BusinessResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '605b035f544047cdc384481a'
 *         name:
 *           type: string
 *           example: 'John_s Barbershop'
 *         email: # Assuming email is part of business contact
 *           type: string
 *           format: email
 *           example: 'contact@johnsbarbershop.com'
 *         # owner: # Not explicitly in IBusiness, but often a business has an owner (User ID)
 *         #   type: string
 *         #   example: '60564fcb544047cdc3844818'
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             address:
 *               type: string
 *               example: '123 Main St, Anytown, USA'
 *         services: # Assuming services are an array of strings (names or IDs)
 *           type: array
 *           items:
 *             type: string
 *           example: ['Haircut', 'Shave']
 *         availability:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AvailabilitySlot'
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         reviews: # Array of Review IDs
 *           type: array
 *           items:
 *             type: string
 *           example: ['605d1f2c544047cdc384481b']
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BusinessCreationPayload:
 *       type: object
 *       required:
 *         - name
 *         - email # Assuming email is required for a business
 *         - password # For business account login, if applicable, or owner's password
 *         - location
 *         - services
 *         - availability
 *       properties:
 *         name:
 *           type: string
 *           example: 'The Glam Salon'
 *         email:
 *           type: string
 *           format: email
 *           example: 'info@glamsalon.com'
 *         password: # This might be for an owner user, not directly on business model
 *           type: string
 *           format: password
 *           example: 'businesspassword123'
 *         location:
 *           type: object
 *           required: [latitude, longitude, address]
 *           properties:
 *             latitude:
 *               type: number
 *               example: 34.052235
 *             longitude:
 *               type: number
 *               example: -118.243683
 *             address:
 *               type: string
 *               example: '456 Glamour Ave, Beautytown, USA'
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           example: ['Manicure', 'Pedicure', 'Facial']
 *         availability:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AvailabilitySlot'
 *     BusinessUpdatePayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           nullable: true
 *           example: 'The Updated Glam Salon'
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           example: 'newinfo@glamsalon.com'
 *         location:
 *           type: object
 *           nullable: true
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *             address:
 *               type: string
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *         availability:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AvailabilitySlot'
 *           nullable: true
 */

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
