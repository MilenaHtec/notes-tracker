/**
 * Unit tests for Notes Service
 */
import { describe, it, expect, beforeEach } from "@jest/globals";
import { notesDB } from "../db/notes-db.js";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../services/notes-service.js";
import { loggerService } from "../services/logger-service.js";

describe("Notes Service", () => {
  beforeEach(() => {
    // Reset in-memory DB and logs before each test
    notesDB.clear();
    loggerService.clear();
  });

  describe("createNote", () => {
    it("should create a note successfully", () => {
      const noteData = {
        title: "Test Note",
        content: "Test content",
      };

      const note = createNote(noteData);

      expect(note).toHaveProperty("id");
      expect(note.title).toBe("Test Note");
      expect(note.content).toBe("Test content");
      expect(note).toHaveProperty("lastModified");
      expect(typeof note.lastModified).toBe("string");
      expect(notesDB.has(note.id)).toBe(true);
    });

    it("should trim title and content", () => {
      const noteData = {
        title: "  Test Note  ",
        content: "  Test content  ",
      };

      const note = createNote(noteData);

      expect(note.title).toBe("Test Note");
      expect(note.content).toBe("Test content");
    });

    it("should throw validation error when title is empty", () => {
      const noteData = {
        title: "",
        content: "Content",
      };

      expect(() => createNote(noteData)).toThrow("Title");
    });

    it("should throw validation error when content is empty", () => {
      const noteData = {
        title: "Title",
        content: "",
      };

      expect(() => createNote(noteData)).toThrow("Content");
    });

    it("should throw validation error when title is whitespace only", () => {
      const noteData = {
        title: "   ",
        content: "Content",
      };

      expect(() => createNote(noteData)).toThrow("Title cannot be empty");
    });

    it("should throw validation error when noteData is null", () => {
      expect(() => createNote(null)).toThrow();
    });

    it("should log NOTE_CREATED action on success", () => {
      const note = createNote({ title: "Test", content: "Content" });
      const logs = loggerService.getAll();

      expect(logs.length).toBeGreaterThan(0);
      const createLog = logs.find((log) => log.action === "NOTE_CREATED");
      expect(createLog).toBeDefined();
      expect(createLog.details.noteId).toBe(note.id);
    });
  });

  describe("getAllNotes", () => {
    it("should return empty array when no notes exist", () => {
      const notes = getAllNotes();
      expect(notes).toEqual([]);
    });

    it("should return all notes", () => {
      createNote({ title: "Note 1", content: "Content 1" });
      // Use different approach - create notes with delay
      return new Promise((resolve) => {
        setTimeout(() => {
          createNote({ title: "Note 2", content: "Content 2" });
          const notes = getAllNotes();
          expect(notes).toHaveLength(2);
          // Check that both notes are in the array
          const titles = notes.map((n) => n.title).sort();
          expect(titles).toContain("Note 1");
          expect(titles).toContain("Note 2");
          resolve();
        }, 10);
      });
    });

    it("should log NOTES_LIST_VIEWED action", () => {
      getAllNotes();
      const logs = loggerService.getAll();

      expect(logs.length).toBeGreaterThan(0);
      const viewLog = logs.find((log) => log.action === "NOTES_LIST_VIEWED");
      expect(viewLog).toBeDefined();
    });
  });

  describe("getNoteById", () => {
    it("should return note when it exists", () => {
      const createdNote = createNote({ title: "Test", content: "Content" });
      const note = getNoteById(createdNote.id);

      expect(note).toEqual(createdNote);
    });

    it("should throw not found error when note does not exist", () => {
      expect(() => getNoteById("nonexistent")).toThrow("not found");
    });
  });

  describe("updateNote", () => {
    it("should update a note successfully", () => {
      const note = createNote({
        title: "Original",
        content: "Original content",
      });
      const originalModified = note.lastModified;

      // Small delay to ensure timestamp changes
      return new Promise((resolve) => {
        setTimeout(() => {
          const updated = updateNote(note.id, { title: "Updated" });

          expect(updated.title).toBe("Updated");
          expect(updated.content).toBe("Original content");
          expect(updated.id).toBe(note.id);
          // Timestamp should be updated
          expect(updated.lastModified).not.toBe(originalModified);
          expect(new Date(updated.lastModified).getTime()).toBeGreaterThan(
            new Date(originalModified).getTime()
          );
          resolve();
        }, 10);
      });
    });

    it("should update both title and content", () => {
      const note = createNote({ title: "Original", content: "Original" });
      const updated = updateNote(note.id, {
        title: "New Title",
        content: "New Content",
      });

      expect(updated.title).toBe("New Title");
      expect(updated.content).toBe("New Content");
    });

    it("should throw not found error when note does not exist", () => {
      expect(() => updateNote("nonexistent", { title: "Updated" })).toThrow(
        "not found"
      );
    });

    it("should throw validation error when title is empty", () => {
      const note = createNote({ title: "Test", content: "Content" });

      expect(() => updateNote(note.id, { title: "" })).toThrow(
        "Title cannot be empty"
      );
    });

    it("should throw validation error when content is empty", () => {
      const note = createNote({ title: "Test", content: "Content" });

      expect(() => updateNote(note.id, { content: "" })).toThrow(
        "Content cannot be empty"
      );
    });

    it("should log NOTE_UPDATED action on success", () => {
      const note = createNote({ title: "Test", content: "Content" });
      loggerService.clear(); // Clear create log

      updateNote(note.id, { title: "Updated" });
      const logs = loggerService.getAll();

      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe("NOTE_UPDATED");
      expect(logs[0].details.noteId).toBe(note.id);
      expect(logs[0].details.updatedFields).toContain("title");
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", () => {
      const note = createNote({ title: "To Delete", content: "Content" });
      const deleted = deleteNote(note.id);

      expect(deleted).toBe(true);
      expect(notesDB.has(note.id)).toBe(false);
    });

    it("should throw not found error when note does not exist", () => {
      expect(() => deleteNote("nonexistent")).toThrow("not found");
    });

    it("should log NOTE_DELETED action on success", () => {
      const note = createNote({ title: "Test", content: "Content" });
      loggerService.clear(); // Clear create log

      deleteNote(note.id);
      const logs = loggerService.getAll();

      expect(logs.length).toBe(1);
      expect(logs[0].action).toBe("NOTE_DELETED");
      expect(logs[0].details.noteId).toBe(note.id);
    });
  });
});

