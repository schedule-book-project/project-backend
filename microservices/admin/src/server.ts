import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import adminRoutes from "./routes/admin.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5005;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Admin Service running on port ${PORT}`));
});
