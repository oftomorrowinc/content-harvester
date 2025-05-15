module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    '**/tests/unit/**/*.js?(x)',
    '**/tests/integration/**/*.js?(x)',
  ],
};