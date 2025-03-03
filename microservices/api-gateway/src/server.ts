import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import gatewayRoutes from "./routes/gateway.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", gatewayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
