import express from "express";
import * as bookingService from "../services/booking.service";
import { ApiErrorModel } from '../../../../shared/models/error.model';

// Create a booking
export const createBooking = async (req: express.Request, res: express.Response) => {
  try {
    const booking = await bookingService.createBooking({
      ...req.body,
      customer: (req as any).user.userId, // Assuming user is authenticated
    });
    res.status(201).json(booking);
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get all bookings
export const getBookings = async (req: express.Request, res: express.Response) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, bookings });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get booking by ID
export const getBookingById = async (req: express.Request, res: express.Response) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return
    }
    res.json(booking);
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Update booking
export const updateBooking = async (req: express.Request, res: express.Response) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return
    }
    res.json(booking);
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

// Delete booking
export const deleteBooking = async (req: express.Request, res: express.Response) => {
  try {
    const booking = await bookingService.deleteBooking(req.params.id);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return
    }
    res.json({ message: "Booking deleted" });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};
