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
    path.join(projectBasePath, 'microservices/business/src/routes/business.routes.ts'),
    path.join(projectBasePath, 'microservices/business/src/routes/health.routes.ts'),
    path.join(projectBasePath, 'microservices/business/src/models/business.model.ts'),
    path.join(projectBasePath, 'shared/models/error.model.ts') // Shared error schemas
];

const serviceDefinition = {
    info: {
        // Title will be overridden by generateSwaggerSpec using serviceName
        description: 'API for managing business profiles, services offered, and availability in the BookIt4You platform.',
    },
    servers: [{ url: 'http://localhost:5002', description: 'Business Service (Local Development)' }] // Port from dev.env
};

let swaggerSpec: object | null = null;
try {
    swaggerSpec = generateSwaggerSpec('Business Service', apiFiles, serviceDefinition);
} catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error("Error generating Swagger spec for Business Service at build time:", error);
    swaggerSpec = {
        openapi: '3.0.0',
        info: {
            title: 'Error Generating Spec - Business Service',
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
