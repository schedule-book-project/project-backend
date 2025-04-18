import User, { type IUser } from "../models/user.model";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import { generateToken } from "@shared/middlewares/jwt";

// Create a User
export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const existingUser = await User.findOne({email});
  if (existingUser) throw new Error("User already exists");

  const newUser = new User({name, email: email.toLowerCase(), password, role});
  await newUser.save();

  return newUser;
};

// Login
export const loginUser = async (email: string, password: string) => {
  console.log(email)
  const user = await User.findOne({email: email.toLowerCase()});
  console.log(user)
  if (!user) throw new Error("Invalid credentials");

  console.log(`${password} - ${user.password}`)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, user: { id: user._id, email: user.email, role: user.role } };
};

// Get All Users
export const getAllUsers = async () => {
  const users = User.find().select("-password").lean();
  console.log("Found users:", users);
  return users
};

// Get User by ID
export const getUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid User ID");
  }

  const user = await User.findById(id).select("-password").lean();
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Update User
export const updateUser = async (id: string, updates: Partial<IUser>) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid User ID");
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password").lean();
  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

// Delete User
export const deleteUser = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid User ID");
  }

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};
