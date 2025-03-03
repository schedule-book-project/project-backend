import express from "express";
import Admin from "../models/Admin.model";

// Create Admin
export const createAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json(admin);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get admins
export const getAdmins = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get admin by ID
export const getAdminById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        res.status(404).json({ message: "Admin not found" });
        return;
    }
    res.json(admin);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete admin (only Super Admins can delete other admins)
export const deletdAdmin = async(req: express.Request, res: express.Response) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: "Admin deleted" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}
