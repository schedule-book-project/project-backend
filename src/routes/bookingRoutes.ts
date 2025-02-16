import express from "express";
import Booking from "../models/Booking";

const router = express.Router();

// 🔹 Δημιουργία κράτησης
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Λήψη όλων των κρατήσεων
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("customer business");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Λήψη μιας κράτησης
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("customer business");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Αλλαγή κατάστασης κράτησης
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Διαγραφή κράτησης
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
