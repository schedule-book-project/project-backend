import { Router, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSwaggerSpec } from '@shared/swagger/generator';

// ESM __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const projectBasePath = path.resolve(__dirname, '../../../../');

const apiFiles = [
    path.join(projectBasePath, 'microservices/places/src/routes/locations.routes.ts'),
    path.join(projectBasePath, 'microservices/places/src/routes/health.routes.ts'),
    path.join(projectBasePath, 'microservices/places/src/models/google.model.ts'), // Contains conceptual schemas
    // path.join(projectBasePath, 'microservices/places/src/models/mapbox.model.ts'), // Add if it contains schemas
    // path.join(projectBasePath, 'microservices/places/src/models/osm.model.ts'),   // Add if it contains schemas
    path.join(projectBasePath, 'shared/models/error.model.ts') // Shared error schemas
];

const serviceDefinition = {
    info: {
        description: 'API for fetching location data, points of interest, and place details (integrates with HERE Maps API).',
    },
    servers: [{ url: 'http://localhost:5005', description: 'Places Service (Local Development)' }] // Port from dev.env
};

let swaggerSpec: object | null = null;
try {
    swaggerSpec = generateSwaggerSpec('Places Service', apiFiles, serviceDefinition);
} catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("Error generating Swagger spec for Places Service at build time:", error);
    swaggerSpec = {
        openapi: '3.0.0',
        info: {
            title: 'Error Generating Spec - Places Service',
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
