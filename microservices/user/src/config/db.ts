import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ User Service DB Connected!");
    } catch (error) {
        console.error("❌ Database Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;