import express, { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user.model.ts";
import sendEmail from "../../../../src/config/emailConfig.ts";



const handleValidationErrors = (req: express.Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        throw new Error(errorMessages.join(", "));
    }
}

// Register a user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
      handleValidationErrors(req);

      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) await res.status(400).json({ error: "Ο χρήστης υπάρχει ήδη" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      // ✅ Χρησιμοποιούμε `await` στο sendEmail για να περιμένουμε την ολοκλήρωση
      await sendEmail(email, "Successful Registration", `Welcome, ${name}!`);

      await res.status(201).json({ msg: "User created successfully, email sent", user });
  } catch (error: any) {
      await res.status(400).json({ error: error.message });
  }
};

// Get all the users
export const getUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}

// Get user by ID
export const getUserByID = async (req: express.Request, res: express.Response) => {
    try {
        const user = User.findById(req.params.id);
        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}

// Update user
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        res.json(user);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
}

// Delete user
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
}