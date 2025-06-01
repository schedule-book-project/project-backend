import { Document, model, Schema, Types } from 'mongoose'; // Added Types

/**
 * @openapi
 * components:
 *   schemas:
 *     BookingStatusEnum:
 *       type: string
 *       enum: [pending, confirmed, canceled, completed] # Matches BookingStatus enum values
 *       example: 'confirmed'
 *     BookingServiceInfo: # Reusable schema for service details
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *           example: 'Men_s_Haircut'
 *         price:
 *           type: number
 *           format: float
 *           example: 30
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *           example: 30
 *     BookingResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '605c724f544047cdc3844819'
 *         customer:
 *           type: string
 *           description: ID of the customer (User)
 *           example: '60564fcb544047cdc3844818'
 *         business:
 *           type: string
 *           description: ID of the business
 *           example: '605b035f544047cdc384481a'
 *         service:
 *           $ref: '#/components/schemas/BookingServiceInfo'
 *         date:
 *           type: string
 *           format: date-time
 *           example: '2024-07-28T10:00:00Z'
 *         timezone:
 *           type: string
 *           example: 'UTC'
 *         status:
 *           $ref: '#/components/schemas/BookingStatusEnum'
 *         price:
 *           type: number
 *           format: float
 *           example: 30 # Should match service.price if not overridden
 *           nullable: true
 *         notes:
 *           type: string
 *           example: 'Prefer a quiet environment.'
 *           nullable: true
 *         review:
 *           type: string
 *           description: ID of the review associated with this booking
 *           example: '605d1f2c544047cdc384481b'
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookingCreationPayload:
 *       type: object
 *       required:
 *         - customer # Assuming customer ID is provided by authenticated user context, but API might expect it in body
 *         - business
 *         - service
 *         - date
 *       properties:
 *         customer:
 *           type: string
 *           description: ID of the customer (User). Often derived from auth token.
 *           example: '60564fcb544047cdc3844818'
 *         business:
 *           type: string
 *           description: ID of the business being booked.
 *           example: '605b035f544047cdc384481a'
 *         service:
 *           $ref: '#/components/schemas/BookingServiceInfo'
 *         date:
 *           type: string
 *           format: date-time
 *           description: Desired date and time for the booking in ISO 8601 format.
 *           example: '2024-07-28T14:00:00.000Z'
 *         timezone:
 *           type: string
 *           description: IANA timezone string for the booking_date.
 *           default: 'UTC'
 *           example: 'America/New_York'
 *         notes:
 *           type: string
 *           nullable: true
 *           example: 'Looking for an early appointment.'
 *     BookingUpdatePayload:
 *       type: object
 *       description: Fields that can be updated for a booking. Often status or notes.
 *       properties:
 *         date: # Less common to update date/time this way, usually a reschedule process
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: '2024-07-29T15:00:00.000Z'
 *         status:
 *           $ref: '#/components/schemas/BookingStatusEnum'
 *           nullable: true
 *         notes:
 *           type: string
 *           nullable: true
 *           example: 'Client confirmed the new time.'
 */

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
