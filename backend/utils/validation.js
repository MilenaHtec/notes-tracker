/**
 * Validation utilities
 * 
 * Provides validation functions for note data and IDs.
 * All validation functions throw errors with descriptive messages.
 */

/**
 * Validates note data (title and content)
 * 
 * @param {Object} noteData - Note data to validate
 * @throws {Error} If validation fails with descriptive message
 */
export function validateNoteData(noteData) {
  if (!noteData) {
    throw new Error("Note data is required");
  }

  if (!noteData.title || typeof noteData.title !== "string") {
    throw new Error("Title is required and must be a string");
  }

  if (!noteData.title.trim()) {
    throw new Error("Title cannot be empty");
  }

  if (!noteData.content || typeof noteData.content !== "string") {
    throw new Error("Content is required and must be a string");
  }

  if (!noteData.content.trim()) {
    throw new Error("Content cannot be empty");
  }
}

/**
 * Validates note ID
 * 
 * @param {string} id - Note ID to validate
 * @throws {Error} If validation fails with descriptive message
 */
export function validateNoteId(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Note ID is required and must be a string");
  }

  if (id.trim().length === 0) {
    throw new Error("Note ID cannot be empty");
  }
}

