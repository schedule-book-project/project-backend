import express from "express";
import Business from "../models/business.model.ts";

// Create a business
export const createBusiness = async (req: express.Request, res: express.Response) => {
    try {
        const business = new Business(req.body);
        await business.save();
        res.status(201).json(business);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
}

// Get all businesses
export const getBusinesses = async (req: express.Request, res: express.Response) => {
    try {
        const businesses = await Business.find();
        res.json(businesses);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}

// Get business by ID
export const getBusinessById = async (req: express.Request, res: express.Response) => {
    try {
        const business = await Business.findById(req.params.id);
        if (!business) {
            res.status(404).json({ message: "Business not found" });
            return;
        }
        res.json(business);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}

// Update a business
export const updateBusiness = async (req: express.Request, res: express.Response) => {
    try {
        const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        res.json(business);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
}

// Delete business
export const deleteBusiness = async (req: express.Request, res: express.Response) => {
    try {
        await Business.findByIdAndDelete(req.params.id);
        res.json({ message: "Business deleted" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}