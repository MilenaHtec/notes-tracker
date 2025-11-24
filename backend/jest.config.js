/**
 * Jest configuration for ES modules
 */
export default {
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "services/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**",
  ],
};

