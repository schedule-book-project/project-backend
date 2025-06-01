import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.routes';
import healthRoutes from './routes/health.routes'; // Import health routes
import dbConnection from '@shared/database/db.ts';
import { config } from '@shared/config/environment.handler.ts';
import { setupSwagger } from '@shared/swagger/config'; // Corrected import name
import logger from '../../../shared/logger/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/', healthRoutes); // Register health routes at the root

setupSwagger(app, 'Booking Service');

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
