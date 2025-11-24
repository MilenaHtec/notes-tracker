/**
 * Notes Routes
 * 
 * Express routes for notes CRUD operations.
 * Routes are thin - they delegate to the notes service layer.
 */

import express from "express";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes-service.js";

const router = express.Router();

/**
 * GET /notes
 * Fetch all notes
 */
router.get("/", async (req, res, next) => {
  try {
    const notes = getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

/**
 * POST /notes
 * Create a new note
 */
router.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = createNote({ title, content });
    res.status(201).json(note);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

/**
 * PUT /notes/:id
 * Update an existing note
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = updateNote(id, { title, content });
    res.status(200).json(note);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

/**
 * DELETE /notes/:id
 * Delete a note
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteNote(id);
    res.status(204).send(); // No content
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

export default router;

