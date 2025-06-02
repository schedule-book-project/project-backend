// This file now only contains Jest global hooks for DB setup/teardown.
// Environment variable loading is handled by loadEnv.ts in setupFiles.
import { connectTestDB, clearTestDB, disconnectTestDB } from './db.utils'; // Import DB utils

// Jest global setup and teardown hooks
beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});
