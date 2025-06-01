import { Router, type Request, type Response, type NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { aggregateSwaggerSpecs } from '../services/swaggerAggregator.service';
import asyncHandler from '@shared/utils/asyncHandler'; // Adjust path if necessary

const router = Router();

// Variable to hold the dynamically generated spec.
// For production, consider caching or generating this at startup and refreshing periodically.
let currentSwaggerSpec: object | null = null;

// Middleware to ensure the OpenAPI specification is generated.
const ensureSwaggerSpec = asyncHandler(async (_req: Request, res: Response, next: NextFunction) => {
    // For this exercise, we regenerate on each request to the UI or openapi.json.
    // In a production scenario, implement caching or generate at startup.
    try {
        currentSwaggerSpec = await aggregateSwaggerSpecs();
        if (!currentSwaggerSpec) {
            // aggregateSwaggerSpecs itself logs errors and returns a minimal spec on failure.
            // So, this specific check might only be for a complete null return, which shouldn't happen.
            return res.status(500).json({ message: "Failed to generate or load Swagger specification." });
        }
    } catch (error) {
        // Catch any unexpected error from aggregateSwaggerSpecs if it throws
        const message = error instanceof Error ? error.message : 'Unknown error generating spec';
        console.error("Critical error in ensureSwaggerSpec:", message, error);
        currentSwaggerSpec = null; // Ensure it's null if generation failed critically
        return res.status(500).json({ message: "Critical error generating Swagger specification.", details: message });
    }
    next();
});

// Route to serve the raw aggregated OpenAPI spec JSON
router.get('/openapi.json', ensureSwaggerSpec, (_req: Request, res: Response) => {
    if (currentSwaggerSpec) {
        res.setHeader('Content-Type', 'application/json');
        res.send(currentSwaggerSpec);
    } else {
        // This case should ideally be handled by ensureSwaggerSpec sending a response
        res.status(500).json({ message: "Swagger specification is not available." });
    }
});

// Serve Swagger UI static assets
router.use('/', swaggerUi.serve);

// Main route to setup and display Swagger UI
// This GET route will be hit by the browser when navigating to the UI path (e.g., /api-docs/)
router.get('/', ensureSwaggerSpec, (req: Request, res: Response, next: NextFunction) => {
    if (currentSwaggerSpec) {
        // swaggerUi.setup returns a middleware function that needs to be called
        swaggerUi.setup(currentSwaggerSpec)(req, res, next);
    } else {
        // Fallback if ensureSwaggerSpec somehow didn't send a response on error
        res.status(500).send("Swagger specification could not be loaded.");
    }
});

export default router;
