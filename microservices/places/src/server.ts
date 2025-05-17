import express from "express";
import cors from "cors";
import locationsRoutes from "./routes/locations.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";
import { setupSwagger } from '@shared/swagger/config';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
setupSwagger(app, 'Places Service');

// Routes
app.use("/api/places", locationsRoutes);

const PORT = config.PLACES_PORT ?? 5006;
dbConnection(config.PLACES_MONGO_DB_URI, "Places")
  .then(() => {
    console.log(`MongoDB connected to ${config.PLACES_MONGO_DB_URI}`);
    app.listen(PORT, () => console.log(`🚀 Places Service running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if connection fails
  });