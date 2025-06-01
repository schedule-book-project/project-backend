import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

let version = 'unknown';
try {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  version = packageJson.version || 'unknown';
} catch (error) {
  console.error('Failed to read booking-service package.json version:', error);
}

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    version: version,
  });
});

export default router;
