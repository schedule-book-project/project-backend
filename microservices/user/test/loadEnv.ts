import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../../resources/config/dev.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('ERROR loading .env file in loadEnv.ts:', result.error);
  // process.exit(1); // Optionally exit if .env loading fails critically
}

// Also ensure NODE_ENV is set to 'test' very early
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}
// Provide dummy HERE_API_KEY if not present, as it's required by shared validation
if (!process.env.HERE_API_KEY) {
  process.env.HERE_API_KEY = 'dummy_here_api_key_for_tests_early';
}
