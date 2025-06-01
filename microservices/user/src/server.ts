import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.ts';
import healthRoutes from './routes/health.routes'; // Import health routes
import dbConnection from '@shared/database/db.ts';
import { config } from '@shared/config/environment.handler.ts';
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/', healthRoutes); // Register health routes at the root

const PORT = config.USER_PORT ?? 5002;
const mongoUri = process.env.NODE_ENV === 'test'
  ? config.USER_MONGO_DB_TEST_URI
  : config.USER_MONGO_DB_URI;

if (!mongoUri) {
  logger.error('MongoDB URI is not defined. Please check environment variables.');
  process.exit(1);
}

dbConnection(mongoUri, 'User')
  .then(() => {
    logger.info(`MongoDB connected to ${mongoUri} for User service`); // Log the actual URI used
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () =>
        logger.info(`🚀 User Service running on port ${PORT}`),
      );
    }
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  });

export default app;
