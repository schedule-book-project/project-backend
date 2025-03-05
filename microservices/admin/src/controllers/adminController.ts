import express from "express";
import * as adminService from "../services/admin.service";

// Create Admin
export const createAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password, role } = req.body;
    const admin = await adminService.createAdmin(email, password, role);
    res.status(201).json(admin);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Authenticate Admin
export const authenticateAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;
    const { token, admin } = await adminService.authenticateAdmin(email, password);
    res.status(200).json({ success: true, token, admin });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get admins
export const getAdmins = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const admins = await adminService.getAllAdmins();
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
    const admin = await adminService. getAdminById(req.params.id);
    if (!admin) {
        res.status(404).json({ error: "Admin not found" });
        return;
    }
    res.json(admin);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete admin (only Super Admins can delete other admins)
export const deleteAdmin = async(req: express.Request, res: express.Response) => {
    try {
        await adminService.deleteAdmin(req.params.id);
        res.json({ error: "Admin deleted" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}
