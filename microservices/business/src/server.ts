import express from "express";
import cors from "cors";
import businessRoutes from "./routes/business.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/business", businessRoutes);

const PORT = config.BUSINESS_PORT || 5004;
dbConnection(config.BUSINESS_MONGO_DB_URI, "Business").then(() => {
    app.listen(PORT, () => console.log(`🚀 Business Service running on port ${PORT}`));
});