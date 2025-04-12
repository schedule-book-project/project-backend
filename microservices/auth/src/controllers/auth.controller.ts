import express from "express";
import { validationResult } from "express-validator";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { name, email, password, role } = req.body;
        const user = await registerUser(name, email, password, role);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginUser(email, password);
        res.json({ token, user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
