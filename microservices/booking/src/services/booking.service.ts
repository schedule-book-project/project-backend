import Booking from "../models/booking.model";

export const createBooking = async (data: any) => {
    const booking = new Booking(data);
    await booking.save();
    return booking;
};

export const getAllBookings = async () => {
    return Booking.find().populate("customer business");
};

export const getBookingById = async (id: string) => {
    return Booking.findById(id).populate("customer business");
};

export const updateBookingStatus = async (id: string, status: string) => {
    return Booking.findByIdAndUpdate(id, {status}, {new: true});
};

export const deleteBooking = async (id: string) => {
    return Booking.findByIdAndDelete(id);
};