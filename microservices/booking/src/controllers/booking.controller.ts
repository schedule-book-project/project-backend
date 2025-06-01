import express from 'express';
import * as bookingService from '../services/booking.service';
import { ApiErrorModel } from '../../../../shared/models/error.model';

// AuthenticatedRequest is no longer needed here, using augmented express.Request

// Create a booking
export const createBooking = async (
  req: express.Request, // Changed to express.Request
  res: express.Response,
): Promise<void> => {
  try {
    // Use req.admin.id based on auth middleware
    const customerId = req.admin?.id;
    if (!customerId) {
      // Handle case where admin or id is not available, perhaps throw an error or send a 401/403 response
      return res
        .status(401)
        .json(
          new ApiErrorModel(401, 'User not authenticated or admin ID missing'),
        );
    }
    const booking = await bookingService.createBooking({
      ...req.body,
      customer: customerId,
    });
    res.status(201).json(booking);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get all bookings
export const getBookings = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, bookings });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Get booking by ID
export const getBookingById = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(booking);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Update booking
export const updateBooking = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(booking);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Delete booking
export const deleteBooking = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const booking = await bookingService.deleteBooking(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json({ message: 'Booking deleted' });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};
