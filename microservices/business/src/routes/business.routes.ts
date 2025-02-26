import express from "express";
import { createBusiness, deleteBusiness, getBusinessById, getBusinesses, updateBusiness } from "../controllers/businessController";

const router = express.Router();

// Create a business
router.post("/", createBusiness);

// Get all businesses
router.get("/", getBusinesses);

// Get business by ID
router.get("/:id", getBusinessById);

// Update business
router.put("/:id", updateBusiness);

// Delete business
router.delete("/:id", deleteBusiness);

export default router;
