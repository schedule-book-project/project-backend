import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import reviewRoutes from "./routes/review.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5004;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Review Service running on port ${PORT}`));
});