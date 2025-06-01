import express, { type Request, type Response } from 'express'; // Changed to type-only imports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Read version from package.json
// Adjust path if necessary, assuming this file is in src/routes and package.json is in ../../
// A more robust way might be to read it once at startup and store it,
// but for simplicity in a route, direct read is also fine.
let version = 'unknown';
try {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version || 'unknown';
} catch (error) {
  // Log using a proper logger if available and if this code runs in a context where logger is easily accessible
  // For now, keeping console.error as this is initialization code.
  console.error('Failed to read user-service package.json version:', error instanceof Error ? error.message : String(error));
}

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check service health and version
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 version:
 *                   type: string
 *                   example: '0.0.1'
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    version: version,
  });
});

export default router;
