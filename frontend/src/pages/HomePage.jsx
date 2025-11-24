/**
 * HomePage Component
 * 
 * Main page component for note editing.
 * Manages selected note state and "creating new note" state.
 */
import { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { getNoteById } from "../services/notes-api.js";

function HomePage({ selectedNoteId, onNoteSaved }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);
  const { refreshNotes } = useNotes();

  // Load selected note when selectedNoteId changes
  useEffect(() => {
    if (selectedNoteId) {
      setIsLoadingNote(true);
      setIsCreating(false);
      // Fetch note details
      getNoteById(selectedNoteId)
        .then((note) => {
          setSelectedNote(note);
        })
        .catch((err) => {
          console.error("Failed to load note:", err);
          setSelectedNote(null);
        })
        .finally(() => {
          setIsLoadingNote(false);
        });
    } else {
      setSelectedNote(null);
      setIsCreating(false);
    }
  }, [selectedNoteId]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedNote(null);
  };

  const handleSave = (savedNote) => {
    // Refresh notes list to show updated/new note
    refreshNotes();
    // If creating new note, notify parent to select it
    if (isCreating) {
      setIsCreating(false);
      if (onNoteSaved) {
        onNoteSaved(savedNote);
      }
    } else {
      // Update selected note with saved data
      setSelectedNote(savedNote);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    // If we have a selectedNoteId, reload that note
    if (selectedNoteId) {
      // Note will be reloaded by useEffect
    }
  };

  // Show loading state while fetching note
  if (isLoadingNote && selectedNoteId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-lg">Loading note...</p>
      </div>
    );
  }

  // Show empty state when no note selected and not creating
  if (!selectedNote && !isCreating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-lg mb-2">No note selected</p>
        <p className="text-sm mb-4">
          Select a note from the sidebar or create a new one
        </p>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        >
          Create New Note
        </button>
      </div>
    );
  }

  // Show form for creating or editing
  return (
    <div className="max-w-4xl mx-auto">
      <NoteForm
        note={selectedNote}
        onSave={handleSave}
        onCancel={isCreating ? handleCancel : undefined}
      />
    </div>
  );
}

export default HomePage;
