import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.model";


const handleValisationErrors = (req: express.Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        throw new Error(errorMessages.join(", "));
    }
}

// Get all the users
export const getUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
}

// Get user by ID
export const getUserByID = async (req: express.Request, res: express.Response) => {
    try {
        const user = User.findById(req.params.id);
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({message: error.message});
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
        res.status(400).json({ message: error.message });
      }
}

// Delete user
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
}