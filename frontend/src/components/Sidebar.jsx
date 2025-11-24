/**
 * Sidebar Component
 * 
 * Displays list of notes in the sidebar.
 * Handles loading, error, and empty states.
 */
import { useNotes } from "../hooks/useNotes.js";
import NoteCard from "./NoteCard.jsx";
import { deleteNote } from "../services/notes-api.js";
import { useEffect } from "react";

function Sidebar({ selectedNoteId, onSelectNote, onRefreshReady }) {
  const { notes, isLoading, error, refreshNotes } = useNotes();

  // Expose refreshNotes to parent component
  useEffect(() => {
    if (onRefreshReady) {
      onRefreshReady(refreshNotes);
    }
  }, [refreshNotes, onRefreshReady]);

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote(noteId);
      refreshNotes();
      // Clear selection if deleted note was selected
      if (selectedNoteId === noteId) {
        onSelectNote(null);
      }
    } catch (err) {
      alert(`Failed to delete note: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <aside
        className="w-full md:w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4 transition-all duration-200"
        aria-label="Notes sidebar"
        role="complementary"
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            <p className="text-gray-400 text-sm">Loading notes...</p>
          </div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside
        className="w-full md:w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4 transition-all duration-200"
        aria-label="Notes sidebar"
        role="complementary"
      >
        <div className="p-4 bg-red-900/20 border border-red-600 rounded-md">
          <p className="text-red-400 text-sm font-medium">Error loading notes</p>
          <p className="text-red-500 text-xs mt-1">{error}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="w-full md:w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4 transition-all duration-200"
      aria-label="Notes sidebar"
      role="complementary"
    >
      {notes.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <p className="text-sm font-medium">No notes yet</p>
          <p className="text-xs mt-1 text-gray-500">
            Create your first note to get started
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          {notes.map((note) => (
            <li key={note.id} role="listitem">
              <NoteCard
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onSelectNote(note.id)}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Sidebar;
