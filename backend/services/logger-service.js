/**
 * Logger Service
 * 
 * Handles in-memory logging of all user actions.
 * Logs are stored in memory and reset when server restarts.
 * 
 * Key principles:
 * - Logging must never throw errors
 * - Invalid entries are silently ignored
 * - Logs follow consistent structure
 */

const logs = [];

/**
 * Log action types
 * All valid actions that can be logged
 */
export const LogAction = {
  NOTE_CREATED: "NOTE_CREATED",
  NOTE_UPDATED: "NOTE_UPDATED",
  NOTE_DELETED: "NOTE_DELETED",
  NOTES_LIST_VIEWED: "NOTES_LIST_VIEWED",
  NOTE_DETAILS_VIEWED: "NOTE_DETAILS_VIEWED",
  APP_STARTED: "APP_STARTED",
  DB_RESET: "DB_RESET",
};

/**
 * Adds a new log entry
 * 
 * @param {Object} entry - Log entry without id and timestamp
 * @param {string} entry.action - Action type (required, must be valid LogAction)
 * @param {Object} [entry.details] - Optional metadata
 * @returns {void}
 */
export function add(entry) {
  try {
    // Validate entry exists
    if (!entry) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Log entry is null or undefined");
      }
      return;
    }

    // Validate action
    if (!entry.action || !Object.values(LogAction).includes(entry.action)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Invalid log action: ${entry.action}`);
      }
      return; // Silently ignore invalid entries
    }

    // Create log entry
    const logEntry = {
      id: Date.now().toString(),
      action: entry.action,
      timestamp: new Date().toISOString(),
      details: entry.details || undefined,
    };

    // Store in memory
    logs.push(logEntry);
  } catch (error) {
    // Logging must never throw - swallow errors silently
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to add log entry:", error);
    }
    // Do not rethrow - logging failures should not break the application
  }
}

/**
 * Gets all log entries
 * 
 * @returns {Array} Array of all log entries (copy to prevent external mutation)
 */
export function getAll() {
  return [...logs]; // Return copy to prevent external mutation
}

/**
 * Clears all log entries
 * Primarily used for tests to reset state between test runs
 * 
 * @returns {void}
 */
export function clear() {
  logs.length = 0;
}

/**
 * Gets log entries filtered by action
 * Optional helper function for filtering logs by action type
 * 
 * @param {string} action - Action type to filter by
 * @returns {Array} Filtered log entries
 */
export function getByAction(action) {
  return logs.filter((log) => log.action === action);
}

// Export as service object for convenience
export const loggerService = {
  add,
  getAll,
  clear,
  getByAction,
};

