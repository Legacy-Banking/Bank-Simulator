// jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/store/(.*)$': '<rootDir>/store/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Ensures Babel processes both JS and TS files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!query-string)', // Forces Jest to transform `query-string` as an ESM dependency
  ],
};

module.exports = createJestConfig(customJestConfig);
