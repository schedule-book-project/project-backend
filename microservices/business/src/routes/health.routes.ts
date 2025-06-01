import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

let version = 'unknown';
try {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version || 'unknown';
} catch (error) {
  console.error('Failed to read business-service package.json version:', error);
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
