import { config } from '@shared/config/environment.handler.ts';
import dbConnection from '@shared/database/db.ts';
import { setupSwagger } from '@shared/swagger/config';
import cors from 'cors';
import express from 'express';
import logger from '../../../shared/logger/logger';
import docsRoutes from './routes/docs.routes'; // Import docs routes
import healthRoutes from './routes/health.routes';
import userRoutes from './routes/user.routes.ts';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
// setupSwagger(app, 'User Service');

// Routes
app.use('/api/user', userRoutes);
app.use('/health', healthRoutes);
app.use('/', docsRoutes); // Register docs routes at the root

const PORT = config.USER_PORT ?? 5002;

// Only connect to DB and start server if not in test environment
dbConnection(config.USER_MONGO_DB_URI!, 'User')
  .then(() => {
    logger.info(
      `MongoDB connected to ${config.USER_MONGO_DB_URI} for User service`,
    );
    app.listen(PORT, () =>
      logger.info(`🚀 User Service running on port ${PORT}`),
    );
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  });

export default app;
