import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from ".";
import path from "path";
import {fileURLToPath} from "url";

// Αντικατάσταση του __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname, "../resources/config/dev.env")});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
