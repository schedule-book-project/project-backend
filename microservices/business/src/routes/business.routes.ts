import express from "express";
import {
    createBusiness,
    deleteBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness
} from "../services/business.service";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";

const router = express.Router();
router.post("/", authenticate, async (req, res) => {
    try {
        const business = await createBusiness({...req.body, owner: (req as any).user.userId});
        res.status(201).json({success: true, business});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.get("/", async (req, res) => {
    try {
        const businesses = await getAllBusinesses();
        res.status(200).json({success: true, businesses});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const business = await getBusinessById(req.params.id);
        res.status(200).json({success: true, business});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.put("/:id", authenticate, async (req, res) => {
    try {
        const business = await updateBusiness(req.params.id, req.body);
        res.status(200).json({success: true, business});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        await deleteBusiness(req.params.id);
        res.status(200).json({success: true, message: "Business deleted"});
    } catch (error: any) {
        res.status(400).json({error: error.message});
    }
});

export default router;
