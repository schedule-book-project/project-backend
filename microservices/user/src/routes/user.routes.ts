import express from "express";
import {createUser, deleteUser, getUserByID, getUsers, updateUser} from "../controllers/user.controller.ts";
import {check} from "express-validator";

const router = express.Router();

// Create a user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Get user by ID
router.get("/:id", getUserByID);

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
updateUser
);

// Delete user
router.delete("/:id", deleteUser);

export default router;
