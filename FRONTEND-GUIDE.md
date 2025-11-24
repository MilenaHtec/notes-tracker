# Frontend Guide (React + Tailwind)

This document provides guidelines for setting up and developing the frontend of the **Notes Management Tool** using React and Tailwind CSS.

---

## 1. Project Setup

### Initial Setup

1. **Initialize project using Vite**:

   ```bash
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install
   ```

2. **Install Tailwind CSS**:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Configure Tailwind** in `tailwind.config.js`:

   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: {
         colors: {
           "gray-850": "#1F1F1F", // Custom sidebar color
         },
       },
     },
     plugins: [],
   };
   ```

4. **Add Tailwind directives** to `src/index.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **Import CSS** in `src/main.jsx`:

   ```javascript
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "./App.jsx";
   import "./index.css";

   ReactDOM.createRoot(document.getElementById("root")).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

### Additional Dependencies

No additional state management libraries needed for this project. React's built-in hooks are sufficient.

---

## 2. Folder Structure

### Complete Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components (PascalCase)
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── NoteCard.jsx
│   │   ├── NoteForm.jsx
│   │   └── NoteList.jsx
│   ├── pages/             # Page-level components
│   │   └── HomePage.jsx
│   ├── hooks/             # Custom React hooks (camelCase)
│   │   └── useNotes.js
│   ├── services/          # API communication layer
│   │   └── notes-api.js   # (kebab-case for files)
│   ├── utils/             # Helper functions
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── styles/            # Tailwind utilities (if needed)
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

### Naming Conventions

- **Files**: `kebab-case` (e.g., `notes-api.js`, `formatters.js`)
- **Components**: `PascalCase` (e.g., `NoteCard`, `NoteForm`)
- **Hooks**: `camelCase` starting with `use` (e.g., `useNotes`, `useNoteForm`)
- **Functions/Variables**: `camelCase` (e.g., `createNote`, `getAllNotes`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

---

## 3. Layout & Components

### Main Layout Structure

```jsx
// App.jsx
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
        />
        <main className="flex-1 bg-gray-900 p-6 overflow-y-auto">
          <HomePage selectedNoteId={selectedNoteId} />
        </main>
      </div>
    </div>
  );
}

export default App;
```

### Header Component

```jsx
// components/Header.jsx
function Header() {
  return (
    <header className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 border-b border-gray-700">
      <h1 className="text-xl font-semibold text-gray-100">Notes Tracker</h1>
      {/* Optional: Add user controls or actions */}
    </header>
  );
}

export default Header;
```

### Sidebar Component

```jsx
// components/Sidebar.jsx
import { useNotes } from "../hooks/useNotes";
import NoteCard from "./NoteCard";

function Sidebar({ selectedNoteId, onSelectNote }) {
  const { notes, isLoading, error } = useNotes();

  if (isLoading) {
    return (
      <aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4">
        <p className="text-gray-400">Loading notes...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700 p-4">
        <p className="text-red-400">Error loading notes: {error}</p>
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
          />
        ))
      )}
    </aside>
  );
}

export default Sidebar;
```

### NoteCard Component

```jsx
// components/NoteCard.jsx
import { formatDate } from "../utils/formatters";

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
```

### NoteForm Component

```jsx
// components/NoteForm.jsx
import { useState, useEffect } from "react";
import { createNote, updateNote } from "../services/notes-api";

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
        className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content..."
        rows={12}
        required
        className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500 resize-y"
      />

      <div className="flex flex-row justify-start space-x-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : note ? "Update Note" : "Save Note"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-500 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;
```

---

## 4. State Management

### Philosophy

For this small project, **React's built-in hooks are sufficient**. No global state management library (Redux, Zustand, etc.) is needed.

### State Management Strategy

1. **Local Component State**: Use `useState` for component-specific state
2. **Custom Hooks**: Extract shared state logic into custom hooks
3. **Lifting State Up**: Share state between components via props
4. **Backend as Source of Truth**: Always fetch from API, don't cache locally

### Custom Hook: useNotes

```jsx
// hooks/useNotes.js
import { useState, useEffect } from "react";
import { getAllNotes } from "../services/notes-api";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const refreshNotes = () => {
    fetchNotes();
  };

  return {
    notes,
    isLoading,
    error,
    refreshNotes,
  };
}
```

### Custom Hook: useNoteForm

```jsx
// hooks/useNoteForm.js
import { useState } from "react";
import { createNote, updateNote } from "../services/notes-api";

export function useNoteForm(note, onSuccess) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const savedNote = note
        ? await updateNote(note.id, { title, content })
        : await createNote({ title, content });

      onSuccess(savedNote);

      // Reset form if creating new note
      if (!note) {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      setError(err.message || "Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    error,
    handleSubmit,
  };
}
```

### State Flow Example

```
User Action (Click "Save")
    ↓
NoteForm Component (handleSubmit)
    ↓
API Service (createNote/updateNote)
    ↓
Backend API
    ↓
Success Response
    ↓
Callback (onSave)
    ↓
Parent Component (HomePage)
    ↓
Refresh Notes (refreshNotes from useNotes)
    ↓
Re-fetch from Backend
    ↓
Update UI
```

### Best Practices

1. **Keep State Local**: Only lift state up when multiple components need it
2. **Single Source of Truth**: Backend is the source of truth, not local state
3. **Optimistic Updates**: Avoid optimistic updates; always refresh from backend after mutations
4. **Error Handling**: Always handle errors and show user-friendly messages
5. **Loading States**: Show loading indicators during async operations
6. **No Local Caching**: Don't cache notes in localStorage; always fetch from API

---

## 5. API Integration

### Service Layer Pattern

All API calls are centralized in the `services/` directory, keeping UI components decoupled from API implementation.

### API Service Implementation

```jsx
// services/notes-api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Fetches all notes from the backend
 * @returns {Promise<Array>} Array of note objects
 * @throws {Error} If request fails
 */
export async function getAllNotes() {
  const response = await fetch(`${API_BASE_URL}/notes`);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to fetch notes" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Creates a new note
 * @param {Object} noteData - Note data with title and content
 * @returns {Promise<Object>} Created note object
 * @throws {Error} If request fails
 */
export async function createNote(noteData) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to create note" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Updates an existing note
 * @param {string} id - Note ID
 * @param {Object} updates - Updated title and/or content
 * @returns {Promise<Object>} Updated note object
 * @throws {Error} If request fails
 */
export async function updateNote(id, updates) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    if (response.status === 404) {
      const error = await response
        .json()
        .catch(() => ({ error: "Note not found" }));
      throw new Error(error.error || "Note not found");
    }
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to update note" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Deletes a note
 * @param {string} id - Note ID
 * @returns {Promise<void>}
 * @throws {Error} If request fails
 */
export async function deleteNote(id) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    if (response.status === 404) {
      const error = await response
        .json()
        .catch(() => ({ error: "Note not found" }));
      throw new Error(error.error || "Note not found");
    }
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to delete note" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  // DELETE returns 204 No Content, so no JSON to parse
  if (response.status !== 204) {
    return response.json();
  }
}
```

### Error Handling

All API functions throw errors that should be caught in components:

```jsx
try {
  const note = await createNote({ title, content });
  // Handle success
} catch (error) {
  // Handle error - show user-friendly message
  setError(error.message);
}
```

### Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3001
```

**Note**: Vite requires `VITE_` prefix for environment variables to be exposed to the client.

---

## 6. Tailwind Usage

### Utility-First Approach

Apply Tailwind utility classes directly to components. Follow the guidelines in **[TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)**.

### Key Principles

1. **Use Utility Classes**: Prefer Tailwind classes over custom CSS
2. **Extract Large Classes**: If className strings get too long, extract to helper functions or components
3. **Responsive Design**: Use responsive utilities (`md:`, `lg:`) from day one
4. **Consistent Spacing**: Use Tailwind's spacing scale consistently
5. **Semantic HTML**: Use semantic HTML elements with Tailwind classes

### Example: Extracting Class Groups

```jsx
// ❌ BAD: Long className string
<button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors">
  Save
</button>;

// ✅ GOOD: Extract to helper
const buttonClasses = {
  primary:
    "px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors",
};

<button className={buttonClasses.primary}>Save</button>;

// ✅ BETTER: Extract to component
function Button({ variant = "primary", children, ...props }) {
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700",
    secondary: "bg-gray-600 hover:bg-gray-500 active:bg-gray-400",
  };

  return (
    <button
      className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## 7. Notes List & Editor UI

### HomePage Component

```jsx
// pages/HomePage.jsx
import { useState } from "react";
import { useNotes } from "../hooks/useNotes";
import NoteForm from "../components/NoteForm";
import { deleteNote } from "../services/notes-api";

function HomePage({ selectedNoteId }) {
  const { notes, refreshNotes } = useNotes();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Find selected note
  const currentNote = selectedNoteId
    ? notes.find((note) => note.id === selectedNoteId)
    : null;

  const handleSave = async (savedNote) => {
    await refreshNotes();
    setSelectedNote(savedNote);
    setIsCreating(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        await refreshNotes();
        setSelectedNote(null);
        setIsCreating(false);
      } catch (error) {
        alert(`Failed to delete note: ${error.message}`);
      }
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-100">
          {currentNote ? "Edit Note" : isCreating ? "New Note" : "Notes"}
        </h2>
        {!isCreating && (
          <button
            onClick={handleNewNote}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
          >
            New Note
          </button>
        )}
      </div>

      {isCreating || currentNote ? (
        <NoteForm
          note={currentNote}
          onSave={handleSave}
          onCancel={() => {
            setIsCreating(false);
            setSelectedNote(null);
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <p className="text-lg mb-2">No note selected</p>
          <p className="text-sm">
            Select a note from the sidebar or create a new one
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
```

### Accessibility Features

1. **Labels**: All inputs should have proper labels (use `aria-label` if visual label not needed)
2. **Focus States**: All interactive elements have visible focus indicators
3. **Keyboard Navigation**: All functionality accessible via keyboard
4. **ARIA Attributes**: Use ARIA labels for icon buttons
5. **Semantic HTML**: Use proper HTML elements (`button`, `form`, `input`, etc.)

---

## 8. Testing & Unit Tests

### Testing Setup

Install testing dependencies:

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

### Test Examples

```jsx
// components/NoteCard.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NoteCard from "./NoteCard";

describe("NoteCard", () => {
  const mockNote = {
    id: "123",
    title: "Test Note",
    content: "Test content",
    lastModified: "2025-11-24T10:20:01.882Z",
  };

  it("should render note title and content", () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should apply selected styles when isSelected is true", () => {
    const { container } = render(
      <NoteCard note={mockNote} isSelected={true} />
    );
    const card = container.firstChild;
    expect(card).toHaveClass("bg-indigo-500");
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<NoteCard note={mockNote} onClick={handleClick} />);
    screen.getByText("Test Note").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

```jsx
// hooks/useNotes.test.js
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useNotes } from "./useNotes";
import * as notesApi from "../services/notes-api";

vi.mock("../services/notes-api");

describe("useNotes", () => {
  it("should fetch notes on mount", async () => {
    const mockNotes = [
      { id: "1", title: "Note 1", content: "Content 1" },
      { id: "2", title: "Note 2", content: "Content 2" },
    ];

    notesApi.getAllNotes.mockResolvedValue(mockNotes);

    const { result } = renderHook(() => useNotes());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notes).toEqual(mockNotes);
    expect(result.current.error).toBe(null);
  });
});
```

### Testing Checklist

- ✅ Component rendering
- ✅ User interactions (clicks, form submissions)
- ✅ API integration (mocked)
- ✅ Error handling
- ✅ Loading states
- ✅ Conditional rendering

---

## 9. Best Practices

### Component Design

1. **Keep Components Small**: Each component should have a single responsibility
2. **Reusable Components**: Extract reusable UI patterns into components
3. **Props Validation**: Use PropTypes or TypeScript for type checking
4. **Clean JSX**: Extract large className strings to helpers or components

### Code Organization

1. **Separation of Concerns**:
   - Components handle UI
   - Hooks handle state logic
   - Services handle API calls
2. **Single Responsibility**: Each file should do one thing well
3. **DRY Principle**: Don't repeat yourself - extract common patterns

### Performance

1. **Avoid Unnecessary Re-renders**: Use `React.memo` for expensive components if needed
2. **Lazy Loading**: Use `React.lazy` for code splitting if app grows
3. **Optimize Images**: Compress and optimize images
4. **Bundle Size**: Keep bundle size small (Vite helps with this)

### Error Handling

1. **Always Handle Errors**: Never let errors go unhandled
2. **User-Friendly Messages**: Show clear, actionable error messages
3. **Error Boundaries**: Consider adding error boundaries for production

### Accessibility

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add ARIA labels for screen readers
3. **Keyboard Navigation**: Ensure all functionality is keyboard accessible
4. **Focus Management**: Manage focus appropriately

---

## 10. Development Workflow

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting (if configured)

```bash
npm run lint
```

---

## 11. Common Patterns

### Loading State

```jsx
if (isLoading) {
  return <div className="text-gray-400">Loading...</div>;
}
```

### Error State

```jsx
if (error) {
  return (
    <div className="p-3 bg-red-900/20 border border-red-600 rounded-md text-red-400">
      Error: {error}
    </div>
  );
}
```

### Empty State

```jsx
if (notes.length === 0) {
  return (
    <div className="text-center text-gray-400">
      <p>No notes yet</p>
    </div>
  );
}
```

### Conditional Rendering

```jsx
{
  selectedNote ? (
    <NoteForm note={selectedNote} onSave={handleSave} />
  ) : (
    <EmptyState />
  );
}
```

---

## 12. Troubleshooting

### API Connection Issues

1. **Check Base URL**: Ensure `VITE_API_BASE_URL` is set correctly
2. **CORS Issues**: Backend must allow frontend origin
3. **Network Tab**: Check browser DevTools Network tab for request details

### Tailwind Classes Not Working

1. **Check Config**: Ensure `content` paths include your files
2. **Rebuild**: Restart dev server after config changes
3. **Purge**: Check if classes are being purged (add to `safelist` if needed)

### State Not Updating

1. **Check Dependencies**: Ensure `useEffect` dependencies are correct
2. **Immutable Updates**: Always create new objects/arrays when updating state
3. **Console Logs**: Add console logs to debug state changes

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Overall system architecture
- **[TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)**: Detailed Tailwind styling guidelines
- **[API.md](./API.md)**: API endpoint documentation
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**: Backend setup guide
- **[RULES.md](./RULES.md)**: Development best practices
