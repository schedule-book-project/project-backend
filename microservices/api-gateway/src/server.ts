import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import gatewayRoutes from './routes/gateway.routes';
import envVars from '../../../shared/config/env.validation';
import logger from '../../../shared/logger/logger';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', gatewayRoutes);

const PORT = envVars.PORT;
app.listen(PORT, () => logger.info(`🚀 API Gateway running on port ${PORT}`));
