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
      className={`rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-indigo-500 text-white shadow-lg transform scale-[1.02]"
          : "bg-gray-700 hover:bg-gray-600 hover:shadow-md"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Note: ${note.title}`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
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

