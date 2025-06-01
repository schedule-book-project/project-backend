import { Router, type Request, type Response } from 'express'; // type-only imports
import { generateSwaggerSpec } from '@shared/swagger/generator';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Determine base path of the project to construct absolute paths for apiFiles
const projectBasePath = path.resolve(__dirname, '../../../../'); // Use path.resolve for absolute path

const apiFiles = [
    path.join(projectBasePath, 'microservices/user/src/routes/user.routes.ts'),
    path.join(projectBasePath, 'microservices/user/src/routes/health.routes.ts'),
    path.join(projectBasePath, 'microservices/user/src/models/user.model.ts'),
    path.join(projectBasePath, 'shared/models/error.model.ts')
];

const serviceDefinition = {
    info: {
        // Title will be overridden by generateSwaggerSpec using serviceName
        description: 'API for managing users, authentication, and user profiles in the BookIt4You platform.',
    },
    servers: [{ url: 'http://localhost:5001', description: 'User Service (Local Development)' }]
    // Schemas defined in user.model.ts and error.model.ts will be automatically picked up if those files are in apiFiles
};

// It's good practice to generate this once at startup, but for simplicity, generating on request here.
// In a production app, consider pre-generating or caching this.
let swaggerSpec: object | null = null;
try {
    swaggerSpec = generateSwaggerSpec('User Service', apiFiles, serviceDefinition);
} catch(e) {
    console.error("Error generating swagger spec at build time", e);
    // swaggerSpec will remain null or could be set to a default error spec
}


router.get('/api-docs.json', (_req: Request, res: Response) => {
    if (swaggerSpec) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    } else {
        res.status(500).json({message: "Swagger Spec not available due to generation error."});
    }
});

export default router;
