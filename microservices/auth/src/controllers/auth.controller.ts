import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {validationResult} from "express-validator";
import User from "../../../user/src/models/user.model";

const generateToken = (user: any) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        console.log(jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" }))
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export const register = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const {name, email, password, role} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        user = new User({name, email, password, role});
        await user.save();

        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email}).exec();
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = generateToken(user);
        res.json({token, user: {id: user.id, email: user.email, role: user.role}});
    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
}