import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);

const PORT = config.ADMIN_PORT || 5002;
dbConnection(config.ADMIN_MONGO_DB_URI, "Admin").then(() => {
    app.listen(PORT, () => console.log(`🚀 Admin Service running on port ${PORT}`));
});
