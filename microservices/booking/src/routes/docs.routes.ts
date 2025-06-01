import { Router, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSwaggerSpec } from '@shared/swagger/generator';

// ESM __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Determine base path of the project to construct absolute paths for apiFiles
const projectBasePath = path.resolve(__dirname, '../../../../');

const apiFiles = [
    path.join(projectBasePath, 'microservices/booking/src/routes/booking.routes.ts'),
    path.join(projectBasePath, 'microservices/booking/src/routes/health.routes.ts'),
    path.join(projectBasePath, 'microservices/booking/src/models/booking.model.ts'),
    path.join(projectBasePath, 'shared/models/error.model.ts') // Shared error schemas
];

const serviceDefinition = {
    info: {
        // Title will be overridden by generateSwaggerSpec using serviceName
        description: 'API for managing bookings and reservations in the BookIt4You platform.',
    },
    servers: [{ url: 'http://localhost:5003', description: 'Booking Service (Local Development)' }]
};

let swaggerSpec: object | null = null;
try {
    swaggerSpec = generateSwaggerSpec('Booking Service', apiFiles, serviceDefinition);
} catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("Error generating Swagger spec for Booking Service at build time:", error);
    swaggerSpec = {
        openapi: '3.0.0',
        info: {
            title: 'Error Generating Spec - Booking Service',
            version: 'N/A',
            description: error
        },
        paths: {}
    };
}

router.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

export default router;
