/**
 * Unit tests for notes-api service
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes-api.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("notes-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllNotes", () => {
    it("should fetch all notes successfully", async () => {
      const mockNotes = [
        { id: "1", title: "Note 1", content: "Content 1" },
        { id: "2", title: "Note 2", content: "Content 2" },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotes,
      });

      const notes = await getAllNotes();

      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/notes");
      expect(notes).toEqual(mockNotes);
    });

    it("should throw error when request fails", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      });

      await expect(getAllNotes()).rejects.toThrow("Server error");
    });
  });

  describe("getNoteById", () => {
    it("should fetch note by ID successfully", async () => {
      const mockNote = { id: "123", title: "Note", content: "Content" };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNote,
      });

      const note = await getNoteById("123");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/notes/123"
      );
      expect(note).toEqual(mockNote);
    });

    it("should throw error when note not found", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Note not found" }),
      });

      await expect(getNoteById("123")).rejects.toThrow("Note not found");
    });
  });

  describe("createNote", () => {
    it("should create note successfully", async () => {
      const noteData = { title: "New Note", content: "New Content" };
      const createdNote = { id: "123", ...noteData };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => createdNote,
      });

      const note = await createNote(noteData);

      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
      expect(note).toEqual(createdNote);
    });

    it("should throw error when creation fails", async () => {
      const noteData = { title: "New Note", content: "New Content" };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Validation error" }),
      });

      await expect(createNote(noteData)).rejects.toThrow("Validation error");
    });
  });

  describe("updateNote", () => {
    it("should update note successfully", async () => {
      const updates = { title: "Updated Title" };
      const updatedNote = { id: "123", title: "Updated Title", content: "Content" };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedNote,
      });

      const note = await updateNote("123", updates);

      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/notes/123", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      expect(note).toEqual(updatedNote);
    });

    it("should throw error when note not found", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Note not found" }),
      });

      await expect(updateNote("123", { title: "Updated" })).rejects.toThrow(
        "Note not found"
      );
    });
  });

  describe("deleteNote", () => {
    it("should delete note successfully", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await deleteNote("123");

      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/notes/123", {
        method: "DELETE",
      });
    });

    it("should throw error when note not found", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Note not found" }),
      });

      await expect(deleteNote("123")).rejects.toThrow("Note not found");
    });
  });
});

