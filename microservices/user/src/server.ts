import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.ts';
import healthRoutes from './routes/health.routes';
import docsRoutes from './routes/docs.routes'; // Import docs routes
import dbConnection from '@shared/database/db.ts';
import { config } from '@shared/config/environment.handler.ts';
// import { setupSwagger } from '@shared/swagger/config'; // Removed
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup - Removed: setupSwagger(app, 'User Service');

// Routes
app.use('/api/user', userRoutes);
app.use('/', healthRoutes);
app.use('/', docsRoutes); // Register docs routes at the root

const PORT = config.USER_PORT ?? 5002;
const mongoUri = process.env.NODE_ENV === 'test'
  ? config.USER_MONGO_DB_TEST_URI
  : config.USER_MONGO_DB_URI;

if (!mongoUri) {
  logger.error('MongoDB URI is not defined. Please check environment variables.');
  process.exit(1);
}

// Only connect to DB and start server if not in test environment
// Tests will use their own DB connection managed by db.utils.ts
if (process.env.NODE_ENV !== 'test') {
  dbConnection(mongoUri, 'User')
    .then(() => {
      logger.info(`MongoDB connected to ${mongoUri} for User service`);
      app.listen(PORT, () =>
        logger.info(`🚀 User Service running on port ${PORT}`),
      );
    })
    .catch((error) => {
      logger.error('Failed to connect to MongoDB:', error);
      process.exit(1); // Exit if connection fails
    });
}

export default app;
