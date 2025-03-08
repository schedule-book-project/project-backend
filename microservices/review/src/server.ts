import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/review.routes";
import dbConnection from "@shared/database/db.ts";
import {config} from "@shared/config/environment.handler.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reviews", reviewRoutes);

const PORT = config.REVIEW_PORT || 5006;
dbConnection(config.REVIEW_MONGO_DB_URI, "Review").then(() => {
    app.listen(PORT, () => console.log(`🚀 Review Service running on port ${PORT}`));
});