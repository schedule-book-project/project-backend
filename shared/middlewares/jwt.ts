import jwt from "jsonwebtoken";
import envVars from '../config/env.validation';

if (!envVars.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, envVars.JWT_SECRET);
};

export const generateToken = (user: any) => {
    if (!envVars.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        console.log(jwt.sign({ id: user._id, role: user.role }, envVars.JWT_SECRET, { expiresIn: "7d" }))
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id: user._id, role: user.role }, envVars.JWT_SECRET, { expiresIn: "7d" });
}