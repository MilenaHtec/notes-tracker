/**
 * Notes Service
 * 
 * Business logic layer for notes operations.
 * Handles all CRUD operations, validation, and logging.
 * Never accessed directly from routes - always through this service.
 */

import { notesDB } from "../db/notes-db.js";
import { loggerService, LogAction } from "./logger-service.js";
import { validateNoteData } from "../utils/validation.js";
import {
  createValidationError,
  createNotFoundError,
  createInternalError,
} from "../utils/error-handler.js";

/**
 * Get all notes
 * 
 * @returns {Array} Array of all notes
 */
export function getAllNotes() {
  const notes = Array.from(notesDB.values());

  // Log the action
  loggerService.add({
    action: LogAction.NOTES_LIST_VIEWED,
  });

  return notes;
}

/**
 * Create a new note
 * 
 * @param {Object} noteData - Note data with title and content
 * @returns {Object} Created note object
 * @throws {Error} If validation fails
 */
export function createNote(noteData) {
  try {
    // Validate input
    validateNoteData(noteData);

    // Generate ID
    const id = Date.now().toString();

    // Create note object
    const note = {
      id,
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      lastModified: new Date().toISOString(),
    };

    // Store in DB
    notesDB.set(id, note);

    // Log the action (only on success)
    loggerService.add({
      action: LogAction.NOTE_CREATED,
      details: {
        noteId: note.id,
        title: note.title,
      },
    });

    return note;
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes("required") || error.message.includes("empty")) {
      throw createValidationError(error.message, {
        field: error.message.includes("Title") ? "title" : "content",
      });
    }
    // Re-throw other errors as internal errors
    throw createInternalError("Failed to create note", {
      originalError: error.message,
    });
  }
}

/**
 * Get a note by ID
 * 
 * @param {string} id - Note ID
 * @returns {Object} Note object
 * @throws {Error} If note not found
 */
export function getNoteById(id) {
  const note = notesDB.get(id);

  if (!note) {
    throw createNotFoundError(`Note with id '${id}' not found`, { id });
  }

  return note;
}

/**
 * Update an existing note
 * 
 * @param {string} id - Note ID
 * @param {Object} updates - Updated title and/or content
 * @returns {Object} Updated note object
 * @throws {Error} If note not found or validation fails
 */
export function updateNote(id, updates) {
  try {
    // Check if note exists
    if (!notesDB.has(id)) {
      throw createNotFoundError(`Note with id '${id}' not found`, { id });
    }

    // Validate updates
    if (updates.title !== undefined && !updates.title.trim()) {
      throw createValidationError("Title cannot be empty", { field: "title" });
    }
    if (updates.content !== undefined && !updates.content.trim()) {
      throw createValidationError("Content cannot be empty", {
        field: "content",
      });
    }

    // Get existing note
    const note = notesDB.get(id);

    // Determine updated fields
    const updatedFields = [];
    if (updates.title !== undefined) updatedFields.push("title");
    if (updates.content !== undefined) updatedFields.push("content");

    // Update note
    const updatedNote = {
      ...note,
      ...updates,
      title: updates.title?.trim() || note.title,
      content: updates.content?.trim() || note.content,
      lastModified: new Date().toISOString(),
    };

    // Save back to DB
    notesDB.set(id, updatedNote);

    // Log the action (only on success)
    loggerService.add({
      action: LogAction.NOTE_UPDATED,
      details: {
        noteId: id,
        updatedFields,
      },
    });

    return updatedNote;
  } catch (error) {
    // Re-throw known errors (validation, not found)
    if (error.code) {
      throw error;
    }
    // Re-throw other errors as internal errors
    throw createInternalError("Failed to update note", {
      originalError: error.message,
    });
  }
}

/**
 * Delete a note by ID
 * 
 * @param {string} id - Note ID
 * @returns {boolean} True if deleted
 * @throws {Error} If note not found
 */
export function deleteNote(id) {
  try {
    // Check if note exists
    if (!notesDB.has(id)) {
      throw createNotFoundError(`Note with id '${id}' not found`, { id });
    }

    // Delete from DB
    notesDB.delete(id);

    // Log the action (only on success)
    loggerService.add({
      action: LogAction.NOTE_DELETED,
      details: {
        noteId: id,
      },
    });

    return true;
  } catch (error) {
    // Re-throw known errors (not found)
    if (error.code) {
      throw error;
    }
    // Re-throw other errors as internal errors
    throw createInternalError("Failed to delete note", {
      originalError: error.message,
    });
  }
}

