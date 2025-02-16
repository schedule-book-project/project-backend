import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Αντικατάσταση του __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../resources/config/dev.env") });

const PORT = process.env.APP_PORT || 3000;

mongoose
  .connect(process.env.MONGO_DB_URI as string)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
