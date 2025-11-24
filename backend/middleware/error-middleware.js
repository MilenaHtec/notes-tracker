/**
 * Centralized error handling middleware
 * Formats all errors into consistent JSON structure
 * Must be the last middleware in the chain
 */
export function errorMiddleware(err, req, res, next) {
  // Log error (but don't expose internal details in production)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Determine status code and error details
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_ERROR";
  const errorMessage = err.message || "An unexpected error occurred";
  const errorDetails = err.details || {};

  // Don't expose internal error details in production
  const response = {
    error: errorMessage,
    code: errorCode,
    details: process.env.NODE_ENV === "production" ? {} : errorDetails,
  };

  res.status(statusCode).json(response);
}

