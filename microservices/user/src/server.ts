import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

const PORT = config.USER_PORT || 5003;
dbConnection(config.USER_MONGO_DB_URI, "User").then(() => {
    app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
});