import express from "express";
import {
    createBooking,
    deleteBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus
} from "../services/booking.service";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";


const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const booking = await createBooking({...req.body, customer: (req as any).user.userId});
        res.status(201).json({success: true, booking});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.get("/", async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.status(200).json({success: true, bookings});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const booking = await getBookingById(req.params.id);
        res.status(200).json({success: true, booking});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.put("/:id", authenticate, async (req, res) => {
    try {
        const booking = await updateBookingStatus(req.params.id, req.body.status);
        res.status(200).json({success: true, booking});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        await deleteBooking(req.params.id);
        res.status(200).json({success: true, message: "Booking deleted"});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

export default router;
