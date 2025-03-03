import Admin from "../models/admin.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createAdmin = async (email: string, password: string, role: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, role });
    await admin.save();
    return admin;
};

export const authenticateAdmin = async (email: string, password: string) => {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error("Admin not found");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    return { token, admin };
};

export const getAllAdmins = async () => {
    return Admin.find();
};

export const deleteAdmin = async (id: string) => {
    return Admin.findByIdAndDelete(id);
};
