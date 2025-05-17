import express from 'express';
import { validationResult } from 'express-validator';
import { ApiErrorModel } from '../../../../shared/models/error.model';
import * as userService from '../services/user.service';
import { UserRole } from '../models/user.model';
import logger from '../../../../shared/logger/logger';
import { validateMongoId } from '../../../../shared/utils/validateMongoId';

const handleValidationErrors = (req: express.Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    throw new ApiErrorModel(400, errorMessages.join(', '));
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
  try {
    handleValidationErrors(req);
    const { name, email, password, role } = req.body;

    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new ApiErrorModel(400, 'Invalid role');
    }

    const user = await userService.registerUser(name, email, password, role ?? UserRole.Customer);
    logger.info(`User registered successfully: ${user.email}`);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    logger.error(`Error in register: ${error.message}`);
    const apiError = error instanceof ApiErrorModel ? error : new ApiErrorModel(400, error.message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Login
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);
    const { token, user } = await userService.loginUser(email, password);
    res.json({ token, user });
  } catch (error: any) {
    logger.error(`Error in login: ${error.message}`);
    const apiError = new ApiErrorModel(
      400,
      error.message ?? 'Internal Server Error',
    );
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
    const apiError = new ApiErrorModel(
      500,
      error.message ?? 'Internal Server Error',
    );
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
export const getUserById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    validateMongoId(req.params.id, 'User');
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    logger.error(`Error in getUserById: ${error.message}`);
    const apiError = new ApiErrorModel(
      404,
      error.message ?? 'Internal Server Error',
    );
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
export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    handleValidationErrors(req);

    const { role, ...updateData } = req.body;

    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new ApiErrorModel(400, 'Invalid role');
    }

    const user = await userService.updateUser(req.params.id, { ...updateData, role });
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    const apiError = error instanceof ApiErrorModel ? error : new ApiErrorModel(400, error.message);
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
export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    validateMongoId(req.params.id, 'User');
    await userService.deleteUser(req.params.id);
    logger.info(`User deleted successfully: ${req.params.id}`);
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    logger.error(`Error in deleteUser: ${error.message}`);
    const apiError = new ApiErrorModel(
      400,
      error.message ?? 'Internal Server Error',
    );
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
export const getAdmins = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const admins = await userService.getUsersByRole('admin');
    res.json(admins);
  } catch (error: any) {
    const apiError = new ApiErrorModel(
      500,
      error.message ?? 'Internal Server Error',
    );
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
export const getAdminById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const admin = await userService.getUserById(req.params.id);
    if (!admin || !['superadmin', 'moderator'].includes(admin.role)) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error: any) {
    const apiError = new ApiErrorModel(
      500,
      error.message ?? 'Internal Server Error',
    );
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
export const deleteAdmin = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (error: any) {
    const apiError = new ApiErrorModel(
      500,
      error.message ?? 'Internal Server Error',
    );
    res.status(apiError.statusCode).json(apiError);
  }
};
