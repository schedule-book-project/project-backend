import Booking, { type IBooking } from "@booking/src/models/booking.model";
import { Types } from "mongoose";

// 1️⃣ Create a booking
export const createBooking = async (data: Partial<IBooking>) => {
  const booking = new Booking(data);
  await booking.save();
  return booking;
};

// 2️⃣ Get all bookings (Populates customer, business, and review)
export const getAllBookings = async () => {
  return Booking.find().select('_id user date').lean();
};

// 3️⃣ Get booking by ID (Populated)
export const getBookingById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Booking.findById(id).select('_id user date').lean();
};

// 4️⃣ Update booking
export const updateBooking = async (id: string, updates: Partial<IBooking>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Booking.findByIdAndUpdate(id, updates, { new: true }).select('_id user date').lean();
};

// 5️⃣ Delete booking
export const deleteBooking = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Booking.findByIdAndDelete(id).select('_id user date').lean();
};
