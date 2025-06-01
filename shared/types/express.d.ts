import { type JwtPayload } from 'jsonwebtoken';

// Define the expected shape of the decoded JWT payload
export interface AdminPayload extends JwtPayload { // Exported
  id: string; // or Types.ObjectId if that's the type in the token
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    admin?: AdminPayload;
  }
}
