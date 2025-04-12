import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};

export const generateToken = (user: any) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        console.log(jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" }))
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}