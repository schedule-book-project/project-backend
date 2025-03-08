import express from "express";
import * as adminController from "../controllers/admin.controller.ts";
import {authenticate, isSuperAdmin} from "../../../../shared/middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/", authenticate, isSuperAdmin, adminController.createAdmin);
router.get("/", authenticate, adminController.getAdmins);
router.get("/:id", authenticate, adminController.getAdminById);
router.delete("/:id", authenticate, isSuperAdmin, adminController.deleteAdmin);

export default router;
