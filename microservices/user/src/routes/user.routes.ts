import {
  authenticate,
  isSuperAdmin,
} from '@shared/middlewares/auth.middleware';
import asyncHandler from '@shared/utils/asyncHandler';
import { userValidation } from '@shared/validations/validationSchemas';
import * as userController from '@user/src/controllers/user.controller';
import express from 'express';

const router = express.Router();

router.post(
  "/register",
  [
      check("email", "Valid email is required").isEmail(),
      check("password", "Password must be at least 8 characters").isLength({ min: 8 }),
      check("password", "Password must contain an uppercase letter").matches(/[A-Z]/),
      check("password", "Password must contain a lowercase letter").matches(/[a-z]/),
      check("password", "Password must contain a number").matches(/\d/),
      check("password", "Password must contain a special character").matches(/[\W_]/),
  ],
  userController.register
);

router.post(
  "/login",
  [
      check("email", "Valid email is required").isEmail(),
      check("password", "Password is required").exists(),
  ],
  userController.login
);

// Get all users
router.get('/', asyncHandler(userController.getUsers));

// Get user by ID
router.get('/:id', asyncHandler(userController.getUserById));

// Update user
router.put('/:id', userValidation, asyncHandler(userController.updateUser));

// Delete user
router.delete('/:id', asyncHandler(userController.deleteUser));

// Create Admin
router.post(
  '/admin',
  authenticate,
  isSuperAdmin,
  userValidation,
  asyncHandler(userController.createAdmin),
);

// Get Admins
router.get('/admins', authenticate, asyncHandler(userController.getAdmins));

// Get Admin by ID
router.get(
  '/admins/:id',
  authenticate,
  asyncHandler(userController.getAdminById),
);

// Delete Admin
router.delete(
  '/admins/:id',
  authenticate,
  isSuperAdmin,
  asyncHandler(userController.deleteAdmin),
);

export default router;
