/**
 * In-memory database for notes
 * 
 * Uses JavaScript Map for O(1) lookup and deletion by ID.
 * Data is stored in RAM and resets when the server restarts (intended behavior).
 * 
 * Structure:
 * - Key: note ID (string)
 * - Value: note object with { id, title, content, lastModified }
 * 
 * This database instance is:
 * - Shared across all routes and services (singleton)
 * - Accessed only through service layer (never directly from routes)
 * - Starts empty when server launches
 */
export const notesDB = new Map();

