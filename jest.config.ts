import type { Config } from 'jest'
import nextJest from 'next/jest'
 
const createJestConfig = nextJest({
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  silent: false,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',  // This maps @/ to app/ directory
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}
 
export default createJestConfig(config)