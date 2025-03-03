import express from "express";
import { createAdmin, authenticateAdmin, getAllAdmins, deleteAdmin } from "../services/admin.service";
import {authenticate, isSuperAdmin} from "../../../../shared/middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/register", authenticate, isSuperAdmin, async (req, res) => {
    try {
        const admin = await createAdmin(req.body.email, req.body.password, req.body.role);
        res.status(201).json({ success: true, admin });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const result = await authenticateAdmin(req.body.email, req.body.password);
        res.status(200).json({ success: true, ...result });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", authenticate, isSuperAdmin, async (req, res) => {
    try {
        const admins = await getAllAdmins();
        res.status(200).json({ success: true, admins });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", authenticate, isSuperAdmin, async (req, res) => {
    try {
        await deleteAdmin(req.params.id);
        res.status(200).json({ success: true, message: "Admin deleted" });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
