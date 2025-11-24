/**
 * Configuration module
 * Centralizes all environment variable access with default values
 */
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
};

