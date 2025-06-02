import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.routes';
import healthRoutes from './routes/health.routes';
import docsRoutes from './routes/docs.routes'; // Import docs routes
import dbConnection from '@shared/database/db.ts';
import config from '@shared/config/env.validation'; // Changed import
// import { setupSwagger } from '@shared/swagger/config'; // Removed
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/', healthRoutes);
app.use('/', docsRoutes); // Register docs routes at the root

// setupSwagger(app, 'Booking Service'); // Removed

const PORT = config.BOOKING_PORT ?? 5004;
dbConnection(config.BOOKING_MONGO_DB_URI, 'Booking')
  .then(() => {
    logger.info(`MongoDB connected to ${config.BOOKING_MONGO_DB_URI}`);
    app.listen(PORT, () =>
      logger.info(`🚀 Booking Service running on port ${PORT}`),
    );
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  });
