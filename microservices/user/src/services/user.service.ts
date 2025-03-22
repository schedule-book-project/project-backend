import User, { type IUser } from "../models/user.model";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";

// Create a User
export const createUser = async (data: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("Email is already in use.");
  }

  const user = new User(data);
  await user.save();
  return user;
};

// Get All Users
export const getAllUsers = async () => {
  return User.find().select("-password").lean();
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
