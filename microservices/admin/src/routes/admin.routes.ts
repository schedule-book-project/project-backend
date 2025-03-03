import express from "express";
import { createAdmin, deletdAdmin, getAdminById, getAdmins } from "../controllers/adminController";

const router = express.Router();

// Create Admin
router.post("/", createAdmin);

// Get Admins
router.get("/", getAdmins);

// Get Admin by ID
router.get("/:id", getAdminById);

// Delete Admin (only Super Admins can delete other admins)
router.delete("/:id",deletdAdmin);

export default router;
