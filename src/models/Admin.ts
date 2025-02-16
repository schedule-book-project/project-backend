import { Schema, model, Document } from "mongoose";

// 1️⃣ TypeScript Interface για Type Safety
export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "superadmin" | "moderator"; // Διαφορετικοί τύποι διαχειριστών
  createdAt: Date;
}

// 2️⃣ Mongoose Schema
const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "moderator"],
      default: "moderator",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3️⃣ Δημιουργία Model
const Admin = model<IAdmin>("Admin", AdminSchema);

export default Admin;
