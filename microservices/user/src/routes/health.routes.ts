import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

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
  console.error('Failed to read user-service package.json version:', error);
}

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    version: version,
  });
});

export default router;
