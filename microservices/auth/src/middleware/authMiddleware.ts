import express from "express";
import jwt from "jsonwebtoken";

interface DecodedUser {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}

export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({message: "No token, authorization denied"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message: "Token is invalid"});
    }
}