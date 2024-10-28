// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Ensure this points to the correct setup file
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/(.*)$': '<rootDir>/$1', // Resolve "@" alias
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', 
    "^query-string$": "<rootDir>/__mocks__/query-string.js",
    '^@/lib/supabase/client$': '<rootDir>/__mocks__/supabaseClient.js',
  },
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    "node_modules/(?!query-string)"  // Exclude query-string from ignored node_modules
  ],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testMatch: ['**/__test_cases__/**/*.test.[jt]s?(x)'],
}

module.exports = createJestConfig(customJestConfig)
