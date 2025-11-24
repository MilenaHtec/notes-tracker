/**
 * NoteForm Component
 * 
 * Form for creating and editing notes.
 * Handles title and content input with validation.
 */
import { useState, useEffect } from "react";
import { createNote, updateNote } from "../services/notes-api.js";

function NoteForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load note data when editing
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
    setError(null);
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setIsSaving(true);

    try {
      const savedNote = note
        ? await updateNote(note.id, { title, content })
        : await createNote({ title, content });

      onSave(savedNote);
      // Clear form if creating new note
      if (!note) {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      setError(err.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-600 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        required
        disabled={isSaving}
        className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content..."
        rows={12}
        required
        disabled={isSaving}
        className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <div className="flex flex-row justify-start space-x-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Saving..." : note ? "Update" : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;

