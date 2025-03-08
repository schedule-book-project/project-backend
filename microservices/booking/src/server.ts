import express from "express";
import cors from "cors";
import bookingRoutes from "./routes/booking.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bookings", bookingRoutes);

const PORT = config.BOOKING_PORT || 5005;
dbConnection(config.BOOKING_MONGO_DB_URI, "Booking").then(() => {
    app.listen(PORT, () => console.log(`🚀 Booking Service running on port ${PORT}`));
});