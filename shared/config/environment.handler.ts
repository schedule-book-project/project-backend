import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// This module's purpose is to set up the environment by loading the correct .env file.
// It should be imported once, very early, in any service entry point BEFORE other config files are imported.

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assuming this file is in shared/config/
const projectRoot = path.resolve(__dirname, '../../');

const envFiles: { [key: string]: string } = {
  dev: path.join(projectRoot, 'resources/config/dev.env'),
  prod: path.join(projectRoot, 'resources/config/prod.env'),
  staging: path.join(projectRoot, 'resources/config/staging.env'),
  // Add other environments as needed
};

export const setEnvironment = (nodeEnv?: string): void => {
  const envTarget = nodeEnv || process.env.NODE_ENV || process.env.ENV || 'dev';
  const envFile: string = envFiles[envTarget] || envFiles.dev; // Default to dev if target not found

  if (!envFile) {
    // This case should ideally not be reached if envFiles.dev is always present
    throw new Error(`Environment file not found for environment: ${envTarget}`);
  }

  // Log the path to the .env file being loaded
  // console.log(`Attempting to load .env file from: ${envFile}`);

  const result = dotenv.config({ path: envFile });

  if (result.error) {
    console.warn(`Warning: Could not load .env file from ${envFile}. Using system environment variables. Error: ${result.error.message}`);
  } else {
    console.log(`Environment variables loaded from ${envFile}`);
  }
};

// Call setEnvironment when this module is loaded.
// The NODE_ENV from Jest setup (via setupFiles) should be available here.
setEnvironment(process.env.NODE_ENV);
