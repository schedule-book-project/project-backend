import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const registerUser = async (name: string, email: string, password: string, role: string) => {
    const existingUser = await User.findOne({email});
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hashedPassword, role});
    await newUser.save();

    return newUser;
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({email});
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user);
    return { token, user: { id: user._id, email: user.email, role: user.role } };
};