import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from ".";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
