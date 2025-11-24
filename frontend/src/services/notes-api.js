/**
 * Notes API Service
 * 
 * Centralized API communication layer for notes operations.
 * All API calls are handled here, keeping components decoupled from API implementation.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Fetches all notes from the backend
 * 
 * @returns {Promise<Array>} Array of note objects
 * @throws {Error} If request fails
 */
export async function getAllNotes() {
  const response = await fetch(`${API_BASE_URL}/notes`);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch notes" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Creates a new note
 * 
 * @param {Object} noteData - Note data with title and content
 * @returns {Promise<Object>} Created note object
 * @throws {Error} If request fails
 */
export async function createNote(noteData) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to create note" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Updates an existing note
 * 
 * @param {string} id - Note ID
 * @param {Object} updates - Updated title and/or content
 * @returns {Promise<Object>} Updated note object
 * @throws {Error} If request fails
 */
export async function updateNote(id, updates) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 404) {
      const error = await response
        .json()
        .catch(() => ({ error: "Note not found" }));
      throw new Error(error.error || "Note not found");
    }
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to update note" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Deletes a note
 * 
 * @param {string} id - Note ID
 * @returns {Promise<void>}
 * @throws {Error} If request fails
 */
export async function deleteNote(id) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    if (response.status === 404) {
      const error = await response
        .json()
        .catch(() => ({ error: "Note not found" }));
      throw new Error(error.error || "Note not found");
    }
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to delete note" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  // DELETE returns 204 No Content, so no JSON to parse
  if (response.status !== 204) {
    return response.json();
  }
}

