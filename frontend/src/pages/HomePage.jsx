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
      <div
        className="flex flex-col items-center justify-center h-full text-gray-400"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
          <p className="text-lg">Loading note...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no note selected and not creating
  if (!selectedNote && !isCreating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
        <div className="text-center max-w-md">
          <p className="text-xl font-medium mb-2 text-gray-300">
            No note selected
          </p>
          <p className="text-sm mb-6 text-gray-500">
            Select a note from the sidebar or create a new one to get started
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label="Create a new note"
          >
            Create New Note
          </button>
        </div>
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
