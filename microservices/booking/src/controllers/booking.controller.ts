import express from "express";
import * as bookingService from "../services/booking.service";

// Create booking
export const createBooking = async (req: express.Request, res: express.Response) => {
  try {
    const booking = await bookingService.createBooking({
        ...req.body,
        customer: (req as any).user.userId,
    });
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get bookings
export const getBookings = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, bookings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking
export const updateBooking = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete booking
export const deleteBooking = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const booking = await bookingService.deleteBooking(req.params.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json({ message: "Booking deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
