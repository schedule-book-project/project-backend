import express from "express";
import * as businessService from "../services/business.service";
import { ApiErrorModel } from '../../../../shared/models/error.model';

// Create a business
export const createBusiness = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, location, services, availability } = req.body;

        // Validate required fields
        if (!name || !email || !password || !location || !services || !availability) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create the business
        const business = await businessService.createBusiness(req.body);
        res.status(201).json({ success: true, business });
    } catch (error: any) {
        const apiError = new ApiErrorModel(400, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

// Get all businesses
export const getBusinesses = async (_req: express.Request, res: express.Response) => {
    try {
        const businesses = await businessService.getAllBusinesses();
        res.json({ success: true, businesses });
    } catch (error: any) {
        const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

// Get business by ID
export const getBusinessById = async (req: express.Request, res: express.Response) => {
    try {
        const business = await businessService.getBusinessById(req.params.id);
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }
        res.json({ success: true, business });
    } catch (error: any) {
        const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

// Update a business
export const updateBusiness = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate if updates are provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No updates provided" });
        }

        const updatedBusiness = await businessService.updateBusiness(id, updates);
        if (!updatedBusiness) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        res.json({ success: true, business: updatedBusiness });
    } catch (error: any) {
        const apiError = new ApiErrorModel(400, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

// Delete business
export const deleteBusiness = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedBusiness = await businessService.deleteBusiness(id);

        if (!deletedBusiness) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        res.json({ success: true, message: "Business deleted successfully" });
    } catch (error: any) {
        const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};
