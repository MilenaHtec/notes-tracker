/**
 * Sidebar Component
 * 
 * Displays list of notes in the sidebar.
 * Handles loading, error, and empty states.
 */
import { useNotes } from "../hooks/useNotes.js";
import NoteCard from "./NoteCard.jsx";
import { deleteNote } from "../services/notes-api.js";

function Sidebar({ selectedNoteId, onSelectNote }) {
  const { notes, isLoading, error, refreshNotes } = useNotes();

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
      <aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">Loading notes...</p>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4">
        <p className="text-red-400 text-sm">Error loading notes: {error}</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4">
      {notes.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <p className="text-sm">No notes yet</p>
          <p className="text-xs mt-1">Create your first note to get started</p>
        </div>
      ) : (
        notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={note.id === selectedNoteId}
            onClick={() => onSelectNote(note.id)}
            onDelete={handleDelete}
          />
        ))
      )}
    </aside>
  );
}

export default Sidebar;
