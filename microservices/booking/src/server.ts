import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import bookingRoutes from "./routes/booking.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5003;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Booking Service running on port ${PORT}`));
});