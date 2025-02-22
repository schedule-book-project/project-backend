import express from "express";
import Business from "../models/Business.model";

const router = express.Router();

// 🔹 Δημιουργία επιχείρησης
// router.post("/", async (req, res) => {
//   try {
//     const business = new Business(req.body);
//     await business.save();
//     res.status(201).json(business);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 🔹 Λήψη όλων των επιχειρήσεων
// router.get("/", async (req, res) => {
//   try {
//     const businesses = await Business.find();
//     res.json(businesses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔹 Λήψη μιας επιχείρησης με βάση το ID
// router.get("/:id", async (req, res) => {
//   try {
//     const business = await Business.findById(req.params.id);
//     if (!business) return res.status(404).json({ message: "Business not found" });
//     res.json(business);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔹 Ενημέρωση επιχείρησης
// router.put("/:id", async (req, res) => {
//   try {
//     const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(business);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 🔹 Διαγραφή επιχείρησης
// router.delete("/:id", async (req, res) => {
//   try {
//     await Business.findByIdAndDelete(req.params.id);
//     res.json({ message: "Business deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
