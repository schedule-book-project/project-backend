import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (name: string, email: string, password: string, role: string) => {
    const existingUser = await User.findOne({email});
    if (existingUser) throw new Error("User already exists");

    const newUser = new User({name, email, password, role});
    await newUser.save();
    return newUser;
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({email});
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET!, {expiresIn: "1d"});
    return {token, user};
};