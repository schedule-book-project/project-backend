import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root dev.env file for tests
const envPath = path.resolve(__dirname, '../../../resources/config/dev.env');
dotenv.config({ path: envPath });

// Set a default NODE_ENV for tests if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Override specific problematic env vars for tests after loading from file
if (!process.env.HERE_API_KEY) {
  process.env.HERE_API_KEY = 'dummy_here_api_key_for_tests';
}
