export default { // Changed to ES module export
  preset: 'ts-jest/presets/default-esm', // Use ESM preset
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/test/setupEnv.ts'], // Add setup file
  moduleNameMapper: {
    // For ESM, ensure paths resolve correctly.
    // If '@shared/...' are TypeScript files, ts-jest should handle them.
    // If they were JS files, you might need to ensure extensions.
    '^@shared/(.*)$': '<rootDir>/../../shared/$1',
    // Jest might need help with relative paths in ESM if they don't include extensions.
    // This pattern helps if '../src/server' is treated as needing an extension.
    // However, ts-jest usually handles this.
  },
  // transform: { // default-esm preset should handle this
  //   '^.+\\.tsx?$': [
  //     'ts-jest',
  //     {
  //       useESM: true,
  //     },
  //   ],
  // },
};
