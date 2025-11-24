/**
 * Error Handler Utilities
 * 
 * Provides standardized error creation functions for consistent error handling.
 * All errors follow the structure: { error, code, details, statusCode }
 */

/**
 * Creates a standardized error object
 * 
 * @param {string} message - Error message
 * @param {string} code - Error code (e.g., "VALIDATION_ERROR", "NOT_FOUND")
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} details - Additional error details (default: {})
 * @returns {Error} Error object with code, statusCode, and details properties
 */
export function createError(message, code, statusCode = 500, details = {}) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

/**
 * Creates a validation error (400 Bad Request)
 * 
 * @param {string} message - Error message
 * @param {Object} details - Additional error details (default: {})
 * @returns {Error} Error object with VALIDATION_ERROR code and 400 status
 */
export function createValidationError(message, details = {}) {
  return createError(message, "VALIDATION_ERROR", 400, details);
}

/**
 * Creates a not found error (404 Not Found)
 * 
 * @param {string} message - Error message
 * @param {Object} details - Additional error details (default: {})
 * @returns {Error} Error object with NOT_FOUND code and 404 status
 */
export function createNotFoundError(message, details = {}) {
  return createError(message, "NOT_FOUND", 404, details);
}

/**
 * Creates an internal server error (500 Internal Server Error)
 * 
 * @param {string} message - Error message
 * @param {Object} details - Additional error details (default: {})
 * @returns {Error} Error object with INTERNAL_ERROR code and 500 status
 */
export function createInternalError(message, details = {}) {
  return createError(message, "INTERNAL_ERROR", 500, details);
}

