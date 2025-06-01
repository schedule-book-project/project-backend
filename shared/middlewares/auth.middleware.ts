import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AdminPayload } from '../types/express'; // Import AdminPayload

export const authenticate = (
  req: Request, // Changed from AuthenticatedRequest
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    // Check if decodedToken is an object and has the required properties
    if (
      typeof decodedToken === 'object' &&
      decodedToken !== null &&
      'id' in decodedToken &&
      'role' in decodedToken
    ) {
      // Assign to req.admin.
      req.admin = decodedToken as AdminPayload;
      next();
    } else {
      throw new Error('Invalid token payload: id or role missing');
    }
  } catch {
    // Removed _error as it's not used
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const isSuperAdmin = (
  req: Request, // Changed from AuthenticatedRequest
  res: Response,
  next: NextFunction,
): void => {
  if (req.admin?.role !== 'superadmin') {
    res.status(403).json({ error: 'Forbidden: Superadmin access only' });
    return;
  }
  next();
};
