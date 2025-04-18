import express from "express";
import * as locationsController from "../controllers/locations.controller";
import { authenticate } from "@shared/middlewares/auth.middleware";

const router = express.Router();

router.get("/nearby", authenticate, locationsController.getNearbyPlaces);
router.get("/ip", authenticate, locationsController.getPlacesByIP);
router.post("/address", authenticate, locationsController.getPlacesByAddress);

export default router;