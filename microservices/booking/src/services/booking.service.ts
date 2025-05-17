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
  return Booking.find()
    .populate("customer", "name email") // Select only needed fields
    .populate("business", "name location")
    .populate("review")
    .lean(); // Use lean() for better performance
};

// 3️⃣ Get booking by ID (Populated)
export const getBookingById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Booking.findById(id)
    .populate("customer", "name email")
    .populate("business", "name location")
    .populate("review")
    .lean();
};

// 4️⃣ Update booking
export const updateBooking = async (id: string, updates: Partial<IBooking>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Booking.findByIdAndUpdate(id, updates, { new: true })
    .populate("customer", "name email")
    .populate("business", "name location")
    .populate("review")
    .lean();
};

// 5️⃣ Delete booking
export const deleteBooking = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Booking.findByIdAndDelete(id);
};
