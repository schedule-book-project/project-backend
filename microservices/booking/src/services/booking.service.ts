import Booking, { type IBooking } from '@booking/src/models/booking.model';
import { Types } from 'mongoose';

// 1️⃣ Create a booking
export const createBooking = async (
  data: Partial<IBooking>,
): Promise<IBooking> => {
  const booking = new Booking(data);
  await booking.save();
  return booking;
};

// 2️⃣ Get all bookings (Populates customer, business, and review)
export const getAllBookings = async (): Promise<
  Pick<IBooking, '_id' | 'customer' | 'date'>[]
> => {
  return Booking.find().select('_id customer date').lean() as Pick<
    IBooking,
    '_id' | 'customer' | 'date'
  >[];
};

// 3️⃣ Get booking by ID (Populated)
export const getBookingById = async (
  id: string,
): Promise<Pick<IBooking, '_id' | 'customer' | 'date'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Booking.findById(id).select('_id customer date').lean() as Pick<
    IBooking,
    '_id' | 'customer' | 'date'
  > | null;
};

// 4️⃣ Update booking
export const updateBooking = async (
  id: string,
  updates: Partial<IBooking>,
): Promise<Pick<IBooking, '_id' | 'customer' | 'date'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Booking.findByIdAndUpdate(id, updates, { new: true })
    .select('_id customer date')
    .lean() as Pick<IBooking, '_id' | 'customer' | 'date'> | null;
};

// 5️⃣ Delete booking
export const deleteBooking = async (
  id: string,
): Promise<Pick<IBooking, '_id' | 'customer' | 'date'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Booking.findByIdAndDelete(id)
    .select('_id customer date')
    .lean() as Pick<IBooking, '_id' | 'customer' | 'date'> | null;
};
