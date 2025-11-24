# Tailwind Style Guide for Notes Management Tool

This document outlines the **UI styling guidelines** for the Notes Management Tool using **Tailwind CSS**.

---

## 1. Design Philosophy

### Core Principles

- **Utility-First**: Use Tailwind utility classes; avoid external CSS files unless absolutely necessary
- **Consistent Design**: Maintain a cohesive gray-and-black color scheme throughout
- **Semantic HTML**: Use semantic HTML elements with Tailwind classes
- **Responsive by Default**: Design mobile-first, then enhance for larger screens
- **Clean JSX**: Extract large class groups into helper functions or small components when needed

### Theme Overview

The application uses a **dark theme** with:

- Dark gray backgrounds (`gray-900`, `gray-800`, `gray-700`)
- Light gray text (`gray-100`, `gray-400`)
- Indigo accents for interactive elements and selections
- High contrast for readability
- Subtle shadows and borders for depth

---

## 2. Color Palette

### Primary Colors

| Color             | Usage                  | Tailwind Class                          |
| ----------------- | ---------------------- | --------------------------------------- |
| **Background**    | Main app background    | `bg-gray-900`                           |
| **Header**        | Header bar background  | `bg-gray-800`                           |
| **Sidebar**       | Sidebar background     | `bg-gray-850` (custom) or `bg-gray-800` |
| **Cards/Items**   | Note cards, list items | `bg-gray-700`                           |
| **Hover States**  | Hover backgrounds      | `bg-gray-600`                           |
| **Active States** | Active/selected items  | `bg-gray-500` or `bg-indigo-500`        |

### Text Colors

| Color              | Usage                | Tailwind Class    |
| ------------------ | -------------------- | ----------------- |
| **Primary Text**   | Main content, titles | `text-gray-100`   |
| **Secondary Text** | Timestamps, metadata | `text-gray-400`   |
| **Muted Text**     | Placeholders, hints  | `text-gray-500`   |
| **Accent Text**    | Links, highlights    | `text-indigo-400` |

### Accent Colors

| Color              | Usage                        | Tailwind Class                         |
| ------------------ | ---------------------------- | -------------------------------------- |
| **Primary Accent** | Selected notes, focus states | `bg-indigo-500`, `text-indigo-400`     |
| **Focus Ring**     | Input focus indicators       | `ring-indigo-400`, `border-indigo-400` |
| **Hover Accent**   | Interactive elements         | `hover:bg-indigo-600`                  |

### Border Colors

| Color              | Usage                   | Tailwind Class      |
| ------------------ | ----------------------- | ------------------- |
| **Default Border** | Input borders, dividers | `border-gray-700`   |
| **Focus Border**   | Focused inputs          | `border-indigo-400` |
| **Hover Border**   | Hover states            | `border-gray-600`   |

---

## 3. Layout Structure

### Overall Layout

```
┌─────────────────────────────────────────┐
│              Header                      │
│         (Fixed, Full Width)             │
└─────────────────────────────────────────┘
┌──────────────┬──────────────────────────┐
│              │                          │
│   Sidebar    │    Main Content Area     │
│   (Notes)    │   (Editor + Preview)    │
│              │                          │
│   Fixed      │    Flexible              │
│   Width      │    Width                 │
│              │                          │
└──────────────┴──────────────────────────┘
```

### Layout Classes

```jsx
// Main container
<div className="flex flex-col h-screen bg-gray-900">
  {/* Header */}
  <header className="w-full h-16 bg-gray-800 flex items-center justify-between px-6">
    {/* Header content */}
  </header>

  {/* Main layout: Sidebar + Content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar */}
    <aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto">
      {/* Sidebar content */}
    </aside>

    {/* Main content */}
    <main className="flex-1 bg-gray-900 p-6 overflow-y-auto">
      {/* Main content */}
    </main>
  </div>
</div>
```

---

## 4. Component Styles

### Header

**Purpose**: Application header with title and optional actions

**Classes**:

```jsx
<header className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 border-b border-gray-700">
  <h1 className="text-xl font-semibold text-gray-100">Notes Tracker</h1>
  {/* Optional: Action buttons */}
</header>
```

**Variations**:

- **Sticky Header**: Add `sticky top-0 z-10` for sticky positioning
- **With Shadow**: Add `shadow-md` for depth

### Sidebar

**Purpose**: List of all notes with navigation

**Container Classes**:

```jsx
<aside className="w-64 bg-gray-850 flex flex-col overflow-y-auto border-r border-gray-700">
  {/* Sidebar content */}
</aside>
```

**Note List Item**:

```jsx
<div className="bg-gray-700 rounded-lg p-4 mb-2 cursor-pointer hover:bg-gray-600 transition-colors">
  <h3 className="text-md font-medium text-gray-100 mb-1">Note Title</h3>
  <p className="text-sm text-gray-400 line-clamp-2">Note content preview...</p>
  <span className="text-xs text-gray-500 mt-2 block">2025-11-24 10:20</span>
</div>
```

**Selected Note**:

```jsx
<div className="bg-indigo-500 rounded-lg p-4 mb-2 cursor-pointer text-white">
  <h3 className="text-md font-medium mb-1">Selected Note Title</h3>
  <p className="text-sm text-indigo-100 line-clamp-2">
    Note content preview...
  </p>
  <span className="text-xs text-indigo-200 mt-2 block">2025-11-24 10:20</span>
</div>
```

**Empty State**:

```jsx
<div className="p-4 text-center text-gray-400">
  <p className="text-sm">No notes yet</p>
  <p className="text-xs mt-1">Create your first note to get started</p>
</div>
```

### Main Content Area

**Purpose**: Note editor and preview

**Container Classes**:

```jsx
<main className="flex-1 bg-gray-900 p-6 overflow-y-auto">{/* Content */}</main>
```

### Note Editor Form

**Form Container**:

```jsx
<form className="flex flex-col space-y-4">{/* Form fields */}</form>
```

**Title Input**:

```jsx
<input
  type="text"
  placeholder="Note title..."
  className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500"
/>
```

**Content Textarea**:

```jsx
<textarea
  placeholder="Note content..."
  rows={12}
  className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500 resize-y"
/>
```

**Button Group**:

```jsx
<div className="flex flex-row justify-start space-x-2">{/* Buttons */}</div>
```

### Buttons

**Primary Button** (Save/Update):

```jsx
<button
  type="submit"
  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
>
  Save Note
</button>
```

**Secondary Button** (Cancel/Delete):

```jsx
<button
  type="button"
  className="px-4 py-2 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-500 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
>
  Cancel
</button>
```

**Danger Button** (Delete):

```jsx
<button
  type="button"
  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
>
  Delete
</button>
```

**Icon Button** (Small delete in note card):

```jsx
<button
  type="button"
  className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
  aria-label="Delete note"
>
  {/* Trash icon */}
</button>
```

### Note Cards / Preview

**Card Container**:

```jsx
<div className="bg-gray-700 rounded-md p-4 shadow-md">
  <h2 className="text-lg font-semibold text-gray-100 mb-2">Note Title</h2>
  <p className="text-gray-100 text-base whitespace-pre-wrap">
    Note content here...
  </p>
  <span className="text-gray-400 text-sm mt-2 block">
    Last modified: 2025-11-24 10:20:01
  </span>
</div>
```

**Empty Editor State**:

```jsx
<div className="flex flex-col items-center justify-center h-full text-gray-400">
  <p className="text-lg mb-2">No note selected</p>
  <p className="text-sm">Select a note from the sidebar or create a new one</p>
</div>
```

---

## 5. Typography

### Font Families

- **Default**: `font-sans` (Tailwind default - system font stack)
- **Monospace** (for code/timestamps if needed): `font-mono`

### Font Sizes and Weights

| Element                 | Classes                 | Usage                 |
| ----------------------- | ----------------------- | --------------------- |
| **App Title**           | `text-xl font-semibold` | Header title          |
| **Note Title (Editor)** | `text-lg font-semibold` | Main note title input |
| **Note Title (Card)**   | `text-md font-medium`   | Sidebar note titles   |
| **Body Text**           | `text-base`             | Main content          |
| **Secondary Text**      | `text-sm text-gray-400` | Timestamps, metadata  |
| **Small Text**          | `text-xs text-gray-500` | Hints, labels         |

### Text Utilities

- **Line Clamping**: `line-clamp-2` (for note previews)
- **Text Truncation**: `truncate` (for long titles)
- **Whitespace**: `whitespace-pre-wrap` (for note content with line breaks)

---

## 6. Spacing & Layout

### Spacing Scale

Use Tailwind's consistent spacing scale:

- **Tight**: `p-2`, `m-2`, `space-y-2` (8px)
- **Normal**: `p-4`, `m-4`, `space-y-4` (16px)
- **Loose**: `p-6`, `m-6`, `space-y-6` (24px)
- **Extra Loose**: `p-8`, `m-8`, `space-y-8` (32px)

### Common Spacing Patterns

```jsx
// Form spacing
<form className="flex flex-col space-y-4">
  {/* 16px vertical spacing between form fields */}
</form>

// Card padding
<div className="p-4">
  {/* 16px padding on all sides */}
</div>

// Sidebar item spacing
<div className="mb-2">
  {/* 8px margin bottom between items */}
</div>
```

### Flexbox Patterns

```jsx
// Horizontal layout
<div className="flex flex-row items-center space-x-2">
  {/* Horizontal items with 8px spacing */}
</div>

// Vertical layout
<div className="flex flex-col space-y-4">
  {/* Vertical items with 16px spacing */}
</div>

// Centered content
<div className="flex items-center justify-center">
  {/* Centered both axes */}
</div>
```

---

## 7. Responsive Design

### Breakpoints

Use Tailwind's default breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile-First Approach

**Sidebar on Mobile**:

```jsx
{
  /* Hidden on mobile, visible on md+ */
}
<aside className="hidden md:flex w-64 bg-gray-850 flex flex-col">
  {/* Sidebar content */}
</aside>;

{
  /* Mobile menu button */
}
<button className="md:hidden p-2 text-gray-100">{/* Menu icon */}</button>;
```

**Main Content on Mobile**:

```jsx
<main className="flex-1 bg-gray-900 p-4 md:p-6 overflow-y-auto">
  {/* Less padding on mobile, more on desktop */}
</main>
```

**Responsive Text Sizes**:

```jsx
<h1 className="text-lg md:text-xl font-semibold">
  {/* Smaller on mobile, larger on desktop */}
</h1>
```

### Sticky Header

```jsx
<header className="sticky top-0 z-10 w-full h-16 bg-gray-800">
  {/* Stays at top when scrolling */}
</header>
```

---

## 8. States & Interactions

### Hover States

```jsx
// Note item hover
<div className="hover:bg-gray-600 transition-colors">
  {/* Smooth color transition on hover */}
</div>

// Button hover
<button className="hover:bg-gray-500 transition-colors">
  {/* Darker on hover */}
</button>
```

### Active States

```jsx
// Button active
<button className="active:bg-gray-400 transition-colors">
  {/* Even darker when clicked */}
</button>
```

### Focus States

```jsx
// Input focus
<input className="focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />

// Button focus
<button className="focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
  {/* Visible focus ring for accessibility */}
</button>
```

### Selected State

```jsx
// Selected note
<div
  className={
    selected ? "bg-indigo-500 text-white" : "bg-gray-700 text-gray-100"
  }
>
  {/* Different background when selected */}
</div>
```

### Disabled State

```jsx
<button disabled className="opacity-50 cursor-not-allowed">
  {/* Reduced opacity, no pointer cursor */}
</button>
```

### Loading State

```jsx
<button className="opacity-75 cursor-wait">
  <span className="animate-spin">⏳</span>
  Saving...
</button>
```

---

## 9. Tailwind Config Customization

### Custom Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom gray shade for sidebar
        "gray-850": "#1F1F1F",
        // Or use existing gray-800 if custom not needed
      },
    },
  },
  plugins: [
    // Optional: Add line-clamp plugin if not in Tailwind v3.3+
    require("@tailwindcss/line-clamp"),
  ],
};
```

### Custom Spacing (if needed)

```javascript
theme: {
  extend: {
    spacing: {
      '18': '4.5rem', // 72px
      '88': '22rem',  // 352px
    },
  },
}
```

### Custom Font Sizes (if needed)

```javascript
theme: {
  extend: {
    fontSize: {
      '2xs': ['0.625rem', { lineHeight: '0.75rem' }], // 10px
    },
  },
}
```

---

## 10. Component Patterns

### Extracting Large Class Groups

**Problem**: Long className strings make JSX hard to read

**Solution**: Extract to helper functions or small components

```jsx
// ❌ BAD: Long className string
<button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors">
  Save
</button>;

// ✅ GOOD: Extract to helper
const buttonClasses = {
  primary:
    "px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors",
  secondary:
    "px-4 py-2 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-500 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors",
};

<button className={buttonClasses.primary}>Save</button>;

// ✅ BETTER: Extract to component
function Button({ variant = "primary", children, ...props }) {
  const baseClasses =
    "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors";
  const variants = {
    primary:
      "bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 focus:ring-indigo-400",
    secondary:
      "bg-gray-600 text-gray-100 hover:bg-gray-500 active:bg-gray-400 focus:ring-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-400",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

<Button variant="primary">Save</Button>;
```

### Reusable UI Patterns

**Note Card Component**:

```jsx
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
      </div>
    </div>
  );
}
```

---

## 11. Accessibility Considerations

### Focus Indicators

Always include visible focus indicators for keyboard navigation:

```jsx
<input className="focus:outline-none focus:ring-2 focus:ring-indigo-400" />
<button className="focus:outline-none focus:ring-2 focus:ring-indigo-400" />
```

### ARIA Labels

```jsx
<button
  aria-label="Delete note"
  className="p-1 text-gray-400 hover:text-red-400"
>
  🗑️
</button>
```

### Semantic HTML

```jsx
// ✅ GOOD: Semantic elements
<header>...</header>
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<button>...</button>

// ❌ BAD: Divs with onClick
<div onClick={handleClick}>...</div>
```

### Color Contrast

Ensure sufficient contrast ratios:

- Text on `bg-gray-900`: Use `text-gray-100` (high contrast)
- Text on `bg-gray-700`: Use `text-gray-100` (high contrast)
- Secondary text: `text-gray-400` is acceptable for non-critical text

---

## 12. Animation & Transitions

### Transitions

Use `transition-colors` for smooth color changes:

```jsx
<div className="hover:bg-gray-600 transition-colors">
  {/* Smooth background color transition */}
</div>
```

### Loading Spinner

```jsx
<div className="animate-spin text-indigo-400">{/* Rotating spinner */}</div>
```

### Fade In (if needed)

```jsx
<div className="animate-fade-in">{/* Custom animation in config */}</div>
```

---

## 13. Common Patterns & Examples

### Complete Note Editor

```jsx
function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, content });
      }}
      className="flex flex-col space-y-4"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content..."
        rows={12}
        className="w-full p-3 rounded-md bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-gray-500 resize-y"
      />
      <div className="flex flex-row justify-start space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
        >
          {note ? "Update Note" : "Save Note"}
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
```

### Complete Sidebar

```jsx
function Sidebar({ notes, selectedNoteId, onSelectNote, onDeleteNote }) {
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
            onDelete={onDeleteNote}
          />
        ))
      )}
    </aside>
  );
}
```

---

## 14. Best Practices Summary

### Do's ✅

- Use utility-first approach with Tailwind classes
- Extract large class groups to helper functions or components
- Use semantic HTML elements
- Include focus states for accessibility
- Use consistent spacing scale
- Design mobile-first, then enhance for larger screens
- Use transition-colors for smooth interactions
- Keep color palette consistent

### Don'ts ❌

- Don't mix custom CSS with Tailwind unless necessary
- Don't use inline styles (use Tailwind classes instead)
- Don't create overly long className strings (extract to helpers)
- Don't forget focus states for keyboard navigation
- Don't use arbitrary values (`p-[13px]`) unless absolutely necessary
- Don't ignore responsive design
- Don't forget to test on different screen sizes

---

## 15. Troubleshooting

### Custom Color Not Working

If `bg-gray-850` doesn't work, ensure it's defined in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        "gray-850": "#1F1F1F",
      },
    },
  },
};
```

### Line Clamp Not Working

If `line-clamp-2` doesn't work, you may need the plugin:

```bash
npm install @tailwindcss/line-clamp
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require("@tailwindcss/line-clamp")],
};
```

### Styles Not Applying

1. Ensure Tailwind is properly configured in your build tool
2. Check that classes are not being purged (add to `safelist` if needed)
3. Verify Tailwind directives are in your CSS file:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[RULES.md](./RULES.md)**: Development best practices (includes Tailwind CSS best practices)
- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)**: Frontend development guide (includes Tailwind usage examples)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System architecture overview
