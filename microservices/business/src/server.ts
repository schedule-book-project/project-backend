import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import businessRoutes from "./routes/business.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/business", businessRoutes);

const PORT = process.env.PORT || 5002;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Business Service running on port ${PORT}`));
});