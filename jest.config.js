module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };
  