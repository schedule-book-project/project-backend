import express from "express";
import * as locationsController from "../controllers/locations.controller";

const router = express.Router();

router.get("/nearby", locationsController.getNearbyPlaces);
router.get("/ip", locationsController.getPlacesByIP);
router.post("/address", locationsController.getPlacesByAddress);

export default router;