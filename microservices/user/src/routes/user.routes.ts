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

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreationPayload'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError' # Assuming shared/models/error.model.ts is included
 *       409:
 *         description: User already exists (duplicate email)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', userValidation, asyncHandler(userController.register));

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse' # Or a specific LoginUserResponse
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', loginValidation, userController.login);

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     security:
 *       - bearerAuth: [] # Assuming this route needs authentication
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse' # Define InternalServerError or use generic ErrorResponse
 */
router.get('/', asyncHandler(userController.getUsers)); // Consider adding auth middleware if needed

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *           example: '60564fcb544047cdc3844818'
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', asyncHandler(userController.getUserById)); // Consider adding auth middleware

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdatePayload'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', userValidation, asyncHandler(userController.updateUser)); // Consider adding auth

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', asyncHandler(userController.deleteUser)); // Consider adding auth

/**
 * @openapi
 * /api/user/admins:
 *   get:
 *     tags:
 *       - Users
 *       - Admins
 *     summary: Get all admin users
 *     security:
 *       - bearerAuth: [] # Requires authentication
 *     responses:
 *       200:
 *         description: List of admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError' # If only specific roles can access
 *       500:
 *         $ref: '#/components/responses/ErrorResponse'
 */
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
