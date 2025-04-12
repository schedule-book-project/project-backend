import express from "express";
import cors from "cors";
import locationsRoutes from "./routes/locations.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/places", locationsRoutes);

const PORT = config.PLACES_PORT || 5007;
dbConnection(config.PLACES_MONGO_DB_URI, "Places").then(() => {
    app.listen(PORT, () => console.log(`🚀 Places Service running on port ${PORT}`));
});