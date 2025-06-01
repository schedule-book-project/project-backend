import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import gatewayRoutes from './routes/gateway.routes';
import swaggerRoutes from './routes/swagger.routes'; // Import Swagger UI routes
import envVars from '../../../shared/config/env.validation';
import logger from '../../../shared/logger/logger';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', gatewayRoutes); // Existing API routes
app.use('/api-docs', swaggerRoutes); // Swagger UI at /api-docs

// Health check route for API Gateway
let gatewayVersion = 'unknown';
try {
  const packageJsonPath = path.join(__dirname, '../package.json'); // Adjusted path for src folder
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  gatewayVersion = packageJson.version || 'unknown';
} catch (error) {
  logger.error('Failed to read api-gateway package.json version:', { error });
}

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    version: gatewayVersion,
  });
});

const PORT = envVars.PORT;

// Start server only if not in test environment or if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => logger.info(`🚀 API Gateway running on port ${PORT}`));
}

export default app; // Export app for testing
