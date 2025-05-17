import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.ts";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";
import { setupSwagger } from '@shared/swagger/config';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
setupSwagger(app, 'User Service');

// Routes
app.use("/api/user", userRoutes);

const PORT = config.USER_PORT ?? 5002;
dbConnection(config.USER_MONGO_DB_URI, "User")
  .then(() => {
    console.log(`MongoDB connected to ${config.USER_MONGO_DB_URI}`);
    app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if connection fails
  });

export default app;