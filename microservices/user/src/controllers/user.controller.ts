import express from "express";
import { validationResult } from "express-validator";
import * as userService from "../services/user.service";

const handleValidationErrors = (req: express.Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        throw new Error(errorMessages.join(", "));
    }
};

// Create User
export const createUser = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        const user = await userService.createUser(req.body);
        res.status(201).json({ success: true, user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Users
export const getUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get User by ID
export const getUserById = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};

// Update User
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete User
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
