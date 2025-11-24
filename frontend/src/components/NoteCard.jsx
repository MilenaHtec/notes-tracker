/**
 * NoteCard Component
 * 
 * Displays a single note in the sidebar list.
 * Shows note title, content preview, and last modified date.
 */
import { formatDate } from "../utils/formatters.js";

function NoteCard({ note, isSelected, onClick, onDelete }) {
  return (
    <div
      className={`rounded-lg p-4 mb-2 cursor-pointer transition-colors ${
        isSelected
          ? "bg-indigo-500 text-white"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className={`text-md font-medium mb-1 ${
              isSelected ? "text-white" : "text-gray-100"
            }`}
          >
            {note.title}
          </h3>
          <p
            className={`text-sm line-clamp-2 ${
              isSelected ? "text-indigo-100" : "text-gray-400"
            }`}
          >
            {note.content}
          </p>
          <span
            className={`text-xs mt-2 block ${
              isSelected ? "text-indigo-200" : "text-gray-500"
            }`}
          >
            {formatDate(note.lastModified)}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
            aria-label="Delete note"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

export default NoteCard;

