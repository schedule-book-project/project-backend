import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Types } from 'mongoose';
import envVars from '../config/env.validation';
import logger from '../logger/logger';

if (!envVars.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, envVars.JWT_SECRET);
};

export const generateToken = (user: {
  _id: string | Types.ObjectId;
  role: string;
}): string => {
  if (!envVars.JWT_SECRET) {
    logger.error('JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id: user._id, role: user.role }, envVars.JWT_SECRET, {
    expiresIn: '7d',
  });
};
