import express from "express";
import * as userController from "../controllers/user.controller.ts";
import {check} from "express-validator";

const router = express.Router();

// Create a user
router.post("/", userController.createUser);

// Get all users
router.get("/", userController.getUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", 
[
  check("email", "Valid email is required").isEmail(),
  check("password", "Password must be at least 8 characters").isLength({min: 8}),
  check("password", "Password must contain at least one uppercase letter").matches(/[A-Z]/),
  check("password", "Password must contain at least one lowercase letter").matches(/[a-z]/),
  check("password", "Password must contain at least one number").matches(/\d/),
  check("password", "Password must contain at least one special character").matches(/[\W_]/)
], 
userController.updateUser
);

// Delete user
router.delete("/:id", userController.deleteUser);

export default router;
