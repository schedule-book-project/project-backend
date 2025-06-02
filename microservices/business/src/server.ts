import express from 'express';
import cors from 'cors';
import businessRoutes from './routes/business.routes';
import healthRoutes from './routes/health.routes';
import docsRoutes from './routes/docs.routes'; // Import docs routes
import dbConnection from '@shared/database/db.ts';
import config from '@shared/config/env.validation'; // Changed import
// import { setupSwagger } from '@shared/swagger/config'; // Removed
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup - Removed: setupSwagger(app, 'Business Service');

// Routes
app.use('/api/business', businessRoutes);
app.use('/', healthRoutes);
app.use('/', docsRoutes); // Register docs routes at the root

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
