import express from "express";
import Booking from "../models/Booking.model";

// Create booking
export const createBooking = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
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
    const bookings = await Booking.find().populate("customer business");
    res.json(bookings);
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
    const booking = await Booking.findById(req.params.id).populate(
      "customer business"
    );
    if (!booking) {
        res.status(404).json({ message: "Booking not found" });
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
      const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
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
      const booking = await Booking.findByIdAndDelete(req.params.id);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.json({ message: "Booking deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
