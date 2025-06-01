import express from 'express';
import { validationResult } from 'express-validator';
import { ApiErrorModel } from '../../../../shared/models/error.model';
import * as userService from '../services/user.service';
import { UserRole } from '../models/user.model';
import logger from '../../../../shared/logger/logger';
import { validateMongoId } from '../../../../shared/utils/validateMongoId';
import { sanitizeInput } from '../../../../shared/utils/sanitizeInput';

const handleValidationErrors = (req: express.Request): void => {
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
export const register = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    handleValidationErrors(req);
    const { name, email, password, role } = req.body;

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new ApiErrorModel(400, 'Invalid role');
    }

    const user = await userService.registerUser(
      name,
      sanitizedEmail,
      sanitizedPassword,
      role ?? UserRole.Customer,
    );
    logger.info(`User registered successfully: ${user.email}`);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: unknown) {
    logger.error('Error in user controller registering user:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred during registration.';
    const apiError =
      error instanceof ApiErrorModel ? error : new ApiErrorModel(400, message);
    res.status(apiError.statusCode).json(apiError);
  }
};

// Login
export const login = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);
    const { token, user } = await userService.loginUser(email, password);
    res.json({ token, user });
  } catch (error: unknown) {
    logger.error('Error in user controller login:', { errorDetail: error });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error during login.';
    const apiError = new ApiErrorModel(400, message);
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
export const getUsers = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error: unknown) {
    logger.error('Error in user controller getting users:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error while fetching users.';
    const apiError = new ApiErrorModel(500, message);
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
): Promise<void> => {
  try {
    validateMongoId(req.params.id, 'User');
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error: unknown) {
    logger.error('Error in user controller getting user by ID:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error while fetching user by ID.';
    const apiError = new ApiErrorModel(404, message);
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
): Promise<void> => {
  try {
    handleValidationErrors(req);

    const { role, ...updateData } = req.body;

    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new ApiErrorModel(400, 'Invalid role');
    }

    const user = await userService.updateUser(req.params.id, {
      ...updateData,
      role,
    });
    res.status(200).json({ success: true, user });
  } catch (error: unknown) {
    logger.error('Error in user controller updating user:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while updating user.';
    const apiError =
      error instanceof ApiErrorModel ? error : new ApiErrorModel(400, message);
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
): Promise<void> => {
  try {
    validateMongoId(req.params.id, 'User');
    await userService.deleteUser(req.params.id);
    logger.info(`User deleted successfully: ${req.params.id}`);
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error: unknown) {
    logger.error('Error in user controller deleting user:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error while deleting user.';
    const apiError = new ApiErrorModel(400, message);
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
): Promise<void> => {
  try {
    const admins = await userService.getUsersByRole('admin');
    res.json(admins);
  } catch (error: unknown) {
    logger.error('Error in user controller getting admins:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error while fetching admins.';
    const apiError = new ApiErrorModel(500, message);
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
): Promise<void> => {
  try {
    const admin = await userService.getUserById(req.params.id);
    if (!admin || !['superadmin', 'moderator'].includes(admin.role)) {
      res.status(404).json({ error: 'Admin not found' }); // Removed 'return'
      return; // Ensure function exits if response is sent
    }
    res.json(admin);
  } catch (error: unknown) {
    logger.error('Error in user controller getting admin by ID:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error while fetching admin by ID.';
    const apiError = new ApiErrorModel(500, message);
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
): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (error: unknown) {
    logger.error('Error in user controller deleting admin:', {
      errorDetail: error,
    });
    const message =
      error instanceof Error
        ? error.message
        : 'Internal Server Error while deleting admin.';
    const apiError = new ApiErrorModel(500, message);
    res.status(apiError.statusCode).json(apiError);
  }
};
