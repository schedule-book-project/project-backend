import express from "express";
import Review from "../models/Review.model";

const router = express.Router();

// 🔹 Δημιουργία νέας κριτικής
router.post("/", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Λήψη όλων των κριτικών μιας επιχείρησης
router.get("/business/:businessId", async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId }).populate("customer business");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Λήψη μιας συγκεκριμένης κριτικής
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("customer business");
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Ενημέρωση κριτικής
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Διαγραφή κριτικής (π.χ. από τον χρήστη που την έγραψε ή από admin)
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
