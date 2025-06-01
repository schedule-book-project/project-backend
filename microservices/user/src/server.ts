import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.ts';
import healthRoutes from './routes/health.routes'; // Import health routes
import dbConnection from '@shared/database/db.ts';
import { config } from '@shared/config/environment.handler.ts';
import { setupSwagger } from '@shared/swagger/config';
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
setupSwagger(app, 'User Service');

// Routes
app.use('/api/user', userRoutes);
app.use('/', healthRoutes); // Register health routes at the root

const PORT = config.USER_PORT ?? 5002;
dbConnection(config.USER_MONGO_DB_URI, 'User')
  .then(() => {
    logger.info(`MongoDB connected to ${config.USER_MONGO_DB_URI}`);
    app.listen(PORT, () =>
      logger.info(`🚀 User Service running on port ${PORT}`),
    );
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  });

export default app;
