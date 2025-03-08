import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = config.AUTH_PORT || 5001;
dbConnection(config.AUTH_MONGO_DB_URI, "Auth").then(() => {
    app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));
});