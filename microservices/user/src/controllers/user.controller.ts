import express from "express";
import { validationResult } from "express-validator";
import * as userService from "../services/user.service";
import { ApiErrorModel } from '../../../../shared/models/error.model';

const handleValidationErrors = (req: express.Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        throw new Error(errorMessages.join(", "));
    }
};

/**
 * Create a new user.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the created user details.
 */
export const register = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { name, email, password, role } = req.body;
        const user = await userService.registerUser(name, email, password, role);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Login
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        console.log(`Email:${req.body.email}password:${req.body.password}`)
        const { token, user } = await userService.loginUser(email, password);
        res.json({ token, user });
    } catch (error: any) {
        const apiError = new ApiErrorModel(400, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

/**
 * Get all users.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the list of users.
 */
export const getUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error: any) {
        const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

/**
 * Get a user by ID.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the user details.
 */
export const getUserById = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        const apiError = new ApiErrorModel(404, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

/**
 * Update a user.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the updated user details.
 */
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, user });
    } catch (error: any) {
        const apiError = new ApiErrorModel(400, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

/**
 * Delete a user.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response confirming the deletion.
 */
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        handleValidationErrors(req);
        await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        const apiError = new ApiErrorModel(400, error.message ?? 'Internal Server Error');
        res.status(apiError.statusCode).json(apiError);
    }
};

/**
 * Create an admin user.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the created admin details.
 */
export const createAdmin = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, role } = req.body;
    if (!['superadmin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid admin role' });
    }
    const admin = await userService.registerUser({ email, password, role });
    res.status(201).json(admin);
  } catch (error: any) {
    const apiError = new ApiErrorModel(400, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

/**
 * Get all admins.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the list of admins.
 */
export const getAdmins = async (req: express.Request, res: express.Response) => {
  try {
    const admins = await userService.getUsersByRole('admin');
    res.json(admins);
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

/**
 * Get an admin by ID.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response with the admin details.
 */
export const getAdminById = async (req: express.Request, res: express.Response) => {
  try {
    const admin = await userService.getUserById(req.params.id);
    if (!admin || !['superadmin', 'moderator'].includes(admin.role)) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};

/**
 * Delete an admin.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns A JSON response confirming the deletion.
 */
export const deleteAdmin = async (req: express.Request, res: express.Response) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (error: any) {
    const apiError = new ApiErrorModel(500, error.message ?? 'Internal Server Error');
    res.status(apiError.statusCode).json(apiError);
  }
};
