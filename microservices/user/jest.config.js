export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'], // Assuming tests will be in a 'test' directory
  setupFiles: ['<rootDir>/test/loadEnv.ts'], // Runs before environment is set up
  setupFilesAfterEnv: ['<rootDir>/test/setupEnv.ts'], // For Jest hooks and other setup
  testTimeout: 30000, // Increase timeout to 30 seconds
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../../shared/$1',
    '^@user/(.*)$': '<rootDir>/$1', // Corrected mapping for @user
  },
};
