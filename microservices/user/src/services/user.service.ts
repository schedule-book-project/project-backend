import { generateToken } from '@shared/middlewares/jwt';
import { ApiErrorModel } from '@shared/models/error.model';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import User, { type IUser } from '../models/user.model';

// Create a User
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<IUser> => {
  const existingUser = await User.findOne({ email }).select('_id email').lean();
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });
  await newUser.save();

  return newUser;
};

// Login
export const loginUser = async (
  email: string,
  password: string,
): Promise<{
  token: string;
  user: { id: Types.ObjectId; email: string; role: string };
}> => {
  const user = (await User.findOne({ email: email.toLowerCase() })
    .select('_id email password role')
    .lean()) as { _id: Types.ObjectId; email: string; password?: string; role: string } | null;

  if (!user || !user.password) { // Added check for user.password as it's used by bcrypt.compare
    throw new Error('Invalid credentials or user data incomplete');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  // Now user is guaranteed to have _id and role of the correct types for generateToken
  const token = generateToken(user);
  return { token, user: { id: user._id, email: user.email, role: user.role } };
};

/**
 * Service to get all users.
 *
 * @returns A list of all users.
 */
export const getAllUsers = async (): Promise<Omit<IUser, 'password'>[]> => {
  const users = await User.find().select('-password').lean();
  return users as Omit<IUser, 'password'>[];
};

/**
 * Service to get a user by ID.
 *
 * @param id - The ID of the user.
 * @returns The user details.
 */
export const getUserById = async (
  id: string,
): Promise<Omit<IUser, 'password'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiErrorModel(400, 'Invalid User ID');
  }

  const user = await User.findById(id).select('-password').lean();
  if (!user) {
    throw new ApiErrorModel(404, 'User not found');
  }

  return user as Omit<IUser, 'password'> | null;
};

/**
 * Service to update a user.
 *
 * @param id - The ID of the user.
 * @param updates - The updates to apply.
 * @returns The updated user.
 */
export const updateUser = async (
  id: string,
  updates: Partial<IUser>,
): Promise<Omit<IUser, 'password'> | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiErrorModel(400, 'Invalid User ID');
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true })
    .select('-password')
    .lean();
  if (!updatedUser) {
    throw new ApiErrorModel(404, 'User not found');
  }

  return updatedUser as Omit<IUser, 'password'> | null;
};

/**
 * Service to delete a user.
 *
 * @param id - The ID of the user.
 * @returns Confirmation of deletion.
 */
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiErrorModel(400, 'Invalid User ID');
  }

  const deletedUser = await User.findByIdAndDelete(id)
    .select('_id email')
    .lean();
  if (!deletedUser) {
    throw new ApiErrorModel(404, 'User not found');
  }

  return { message: 'User deleted successfully' };
};

/**
 * Service to get users by role.
 *
 * @param role - The role to filter by.
 * @returns A list of users with the specified role.
 */
export const getUsersByRole = async (
  role: string,
): Promise<Pick<IUser, '_id' | 'email' | 'role'>[]> => {
  // Added await here
  return (await User.find({ role }).select('_id email role').lean()) as Pick<
    IUser,
    '_id' | 'email' | 'role'
  >[];
};
