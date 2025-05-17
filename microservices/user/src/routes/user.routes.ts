import {
  authenticate,
  isSuperAdmin,
} from '@shared/middlewares/auth.middleware';
import asyncHandler from '@shared/utils/asyncHandler';
import {
  loginValidation,
  userValidation,
} from '@shared/validations/validationSchemas';
import * as userController from '@user/src/controllers/user.controller';
import express from 'express';

const router = express.Router();

router.post('/register', userValidation, asyncHandler(userController.register));

router.post('/login', loginValidation, userController.login);

// Get all users
router.get('/', asyncHandler(userController.getUsers));

// Get user by ID
router.get('/:id', asyncHandler(userController.getUserById));

// Update user
router.put('/:id', userValidation, asyncHandler(userController.updateUser));

// Delete user
router.delete('/:id', asyncHandler(userController.deleteUser));

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
