/**
 * Formatter Utilities
 * 
 * Helper functions for formatting data
 */

/**
 * Formats a date string to a readable format
 * 
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted date string (e.g., "2025-11-24 10:20:01")
 */
export function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }

    // Format: YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateString; // Return original on error
  }
}

