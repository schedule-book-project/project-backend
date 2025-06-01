import express from 'express';
import cors from 'cors';
import businessRoutes from './routes/business.routes';
import healthRoutes from './routes/health.routes'; // Import health routes
import dbConnection from '@shared/database/db.ts';
import { config } from '@shared/config/environment.handler.ts';
import { setupSwagger } from '@shared/swagger/config';
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
setupSwagger(app, 'Business Service');

// Routes
app.use('/api/business', businessRoutes);
app.use('/', healthRoutes); // Register health routes at the root

const PORT = config.BUSINESS_PORT ?? 5003;
dbConnection(config.BUSINESS_MONGO_DB_URI, 'Business')
  .then(() => {
    logger.info(`MongoDB connected to ${config.BUSINESS_MONGO_DB_URI}`);
    app.listen(PORT, () =>
      logger.info(`🚀 Business Service running on port ${PORT}`),
    );
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  });
