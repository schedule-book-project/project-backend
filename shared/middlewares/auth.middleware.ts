import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).admin.role !== "superadmin") {
        res.status(403).json({ error: "Forbidden: Superadmin access only" });
        return;
    }
    next();
};
