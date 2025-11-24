# Architecture Overview

This document provides a high-level architectural overview of the **Notes Management Tool**, designed according to the project requirements. The system consists of a lightweight backend and a React-based frontend, using an in-memory database and enforcing logging and unit testing standards.

---

## 1. System Summary

The project is a small full‑stack application that allows users to:

- Create notes (title + content)
- View all notes
- Edit existing notes
- Delete notes

Each note stores a `lastModified` timestamp, and all user actions are logged. No persistent storage is used; the backend keeps data only in memory.

The architecture focuses on simplicity, modularity, and clean separation of responsibilities.

---

## 2. High-Level Architecture

```
┌────────────────────┐        ┌─────────────────────────────┐
│      Frontend      │ <----> │           Backend             │
│     (React +       │  API   │  Node.js + Express +         │
│      Tailwind)     │ calls  │     In-Memory Database       │
└────────────────────┘        └─────────────────────────────┘
```

The frontend communicates with the backend exclusively through REST API endpoints. The backend handles business logic, manages the in-memory database, and logs all operations.

### Key Principles

- **Separation of Concerns**: Frontend handles UI, backend handles business logic
- **Service Layer Pattern**: Routes delegate to services, services interact with database
- **Single Responsibility**: Each module has one clear purpose
- **No Direct DB Access**: Routes never access the database directly

---

## 3. Folder Structure

### Root Structure

```
notes-tracker/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend
├── README.md          # Project overview
├── RULES.md           # Development best practices
├── API.md             # API documentation
└── ARCHITECTURE.md    # This file
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/        # Reusable UI components (PascalCase)
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
│   │   └── formatters.js
│   ├── styles/            # Tailwind utilities (if needed)
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── package.json
└── tailwind.config.js
```

### Backend (Node + Express)

```
backend/
├── app.js                 # Express entry point
├── routes/
│   └── notes.js           # CRUD routes (kebab-case)
├── services/              # Business logic layer
│   ├── notes-service.js   # Notes business logic
│   └── logger-service.js  # Logging functionality
├── db/
│   └── notes-db.js        # In-memory DB instance
├── utils/
│   ├── validation.js      # Input validation helpers
│   └── error-handler.js    # Centralized error handling
├── middleware/
│   └── error-middleware.js # Express error middleware
├── config/
│   └── config.js          # Environment configuration
├── package.json
└── .env.example           # Environment variables template
```

### Naming Conventions

- **Files**: `kebab-case` (e.g., `notes-service.js`, `error-handler.js`)
- **Components**: `PascalCase` (e.g., `NoteCard`, `NoteForm`)
- **Functions/Variables**: `camelCase` (e.g., `createNote`, `getAllNotes`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_TITLE_LENGTH`)

---

## 4. Component Responsibilities

### Frontend Responsibilities

- **UI Rendering**: Render user interface using React components
- **Form Handling**: Provide forms for creating and editing notes
- **Data Fetching**: Fetch notes from the backend API
- **User Interactions**: Trigger CRUD actions (add/edit/delete)
- **Styling**: Use Tailwind CSS for all styling (utility-first approach)
- **State Management**: Manage component state (no global state library needed for small project)
- **Error Display**: Show user-friendly error messages from API responses
- **No Persistence**: Never store notes in localStorage; always use backend as source of truth

### Backend Responsibilities

- **API Endpoints**: Expose REST API endpoints for notes operations
- **Data Validation**: Validate incoming data (title and content cannot be empty)
- **Business Logic**: Perform CRUD operations using the in-memory database
- **Timestamp Management**: Automatically update `lastModified` timestamp on updates
- **Logging**: Log every user action with action type, payload, and timestamp
- **Error Handling**: Return structured JSON error messages with proper HTTP status codes
- **Service Layer**: Provide isolated, testable functions for unit testing

---

## 5. In-Memory Database Layer

### Implementation

- Implemented as a single `Map` instance exported from `db/notes-db.js`
- Lives in backend RAM and resets when the server restarts (intended behavior)
- Accessed **only** via service functions; routes never access it directly

### Example Structure

```javascript
// db/notes-db.js
export const notesDB = new Map();

// Usage in service layer
import { notesDB } from "../db/notes-db.js";

export function createNote(noteData) {
  const id = generateId();
  const note = {
    id,
    ...noteData,
    lastModified: new Date().toISOString(),
  };
  notesDB.set(id, note);
  return note;
}
```

### Why Map Instead of Array?

- **O(1) lookup** by ID (vs O(n) for arrays)
- **O(1) delete** by ID (vs O(n) for arrays)
- **Better performance** for ID-based operations
- **Simpler API** (`map.get(id)`, `map.set(id, value)`, `map.delete(id)`)

---

## 6. Logging Flow

```
Frontend → Backend API → Notes Service → Logger Service → In-Memory Log Store
```

### Logging Architecture

1. **Frontend** makes API request (no logging on frontend)
2. **Backend Route** receives request and delegates to service
3. **Notes Service** performs operation and calls logger
4. **Logger Service** creates log entry and stores it
5. **Response** returned to frontend

### Log Entry Structure

Each action generates a log entry containing:

- **action type**: `NOTE_CREATED`, `NOTE_UPDATED`, `NOTE_DELETED`, `NOTES_LIST_VIEWED`
- **note ID or payload**: The affected note's ID and relevant data
- **timestamp**: ISO 8601 formatted timestamp

### Example Log Entry

```json
{
  "id": "1732451239123",
  "action": "NOTE_CREATED",
  "timestamp": "2025-11-24T10:12:45.321Z",
  "details": {
    "noteId": "1732451239123",
    "title": "My First Note"
  }
}
```

**Note**: Logs are only generated for successful operations. Failed operations (validation errors, not found, etc.) are logged as errors but do not generate action logs.

---

## 7. Error Handling Architecture

### Centralized Error Handling

The backend uses a centralized error handler middleware that:

1. Catches all errors from routes and services
2. Formats errors into consistent JSON structure
3. Logs errors before sending response
4. Returns appropriate HTTP status codes

### Error Flow

```
Route → Service → Error Thrown → Error Middleware → Structured Response
```

### Error Response Format

All errors follow this structure (as defined in RULES.md):

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Error Types

- **Validation Errors** (400): Invalid input data
- **Not Found Errors** (404): Resource doesn't exist
- **Internal Errors** (500): Unexpected server errors

---

## 8. Unit Testing Architecture

### Testing Strategy

Unit tests cover:

- **Service Methods**: All CRUD operations (create, update, delete, getAll)
- **Logging Service**: Log creation and storage
- **Validation Logic**: Input validation functions
- **Route Responses**: HTTP status codes and response formats (optional, can use integration tests)

### Testing Style

- **Framework**: Jest
- **Isolation**: In-memory DB is reset between tests
- **Mocking**: External dependencies (DB, loggers) are mocked when testing routes
- **Focus**: Test behavior, not implementation details

### Test Structure Example

```javascript
describe("Notes Service", () => {
  beforeEach(() => {
    // Reset in-memory DB before each test
    notesDB.clear();
  });

  test("should create a note successfully", () => {
    // Test implementation
  });

  test("should throw error when title is empty", () => {
    // Test implementation
  });
});
```

---

## 9. Data Flow Diagram

### Complete Request Flow

```
User Input (Form)
    ↓
React Component (UI)
    ↓ (API request via Fetch API)
Backend Route (Express) - /notes
    ↓
Validation Middleware (optional)
    ↓
Notes Service (business logic)
    ↓
In-Memory Database (Map)
    ↓
Logger Service (action logging)
    ↓
HTTP Response (JSON)
    ↓
React Component (updates UI)
```

### Detailed Flow for Create Note

1. User fills form and clicks "Create"
2. React component calls `notes-api.createNote(data)`
3. Frontend service makes `POST /notes` request
4. Express route handler receives request
5. Route calls `notesService.createNote(data)`
6. Service validates data (title and content not empty)
7. Service generates ID and timestamp
8. Service stores note in `notesDB` Map
9. Service calls `loggerService.add({ action: LogAction.NOTE_CREATED, details: { noteId, title } })`
10. Service returns created note
11. Route sends 201 response with note JSON
12. Frontend receives response and updates UI

---

## 10. Technology Stack

### Frontend

- **React**: UI library for building components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Fetch API**: Native browser API for HTTP requests (no axios needed)
- **Vite** (or similar): Build tool and dev server

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for REST API
- **In-Memory Map**: Database (no external DB needed)
- **Custom Logger**: Simple in-memory log store

### Development Tools

- **Jest**: Testing framework
- **ESLint**: Code quality and linting
- **Prettier**: Code formatting
- **Git**: Version control

### No External Dependencies Needed

- No database (PostgreSQL, MongoDB, etc.)
- No ORM (Sequelize, Mongoose, etc.)
- No authentication library (not required for this project)
- No state management library (Redux, Zustand, etc.) - React state is sufficient

---

## 11. Environment Configuration

### Environment Variables

The backend uses environment variables for configuration:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (`development`, `production`, `test`)

### Configuration Flow

```
.env file → config/config.js → Application
```

Environment variables are accessed through a centralized config module, never directly in code.

---

## 12. API Communication

### Request/Response Pattern

- **All requests**: JSON format with `Content-Type: application/json`
- **All responses**: JSON format
- **Error responses**: Consistent structure (error, code, details)

### Frontend API Service

The frontend uses a service layer (`services/notes-api.js`) that:

- Encapsulates all API calls
- Handles request/response formatting
- Provides error handling
- Returns promises for async operations

### Example API Service

```javascript
// services/notes-api.js
export async function getAllNotes() {
  const response = await fetch("http://localhost:3001/notes");
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  return response.json();
}
```

---

## 13. Key Design Decisions

### Why In-Memory Database?

- **Simplicity**: No database setup required
- **Speed**: Fast operations (all in RAM)
- **Learning**: Focus on architecture, not DB configuration
- **Suitable for**: Small projects, prototypes, demos

### Why Service Layer?

- **Separation of Concerns**: Routes handle HTTP, services handle business logic
- **Testability**: Services can be tested independently
- **Reusability**: Services can be used by multiple routes
- **Maintainability**: Business logic changes don't affect route structure

### Why No State Management Library?

- **Small Project**: React state + hooks are sufficient
- **Simplicity**: Avoid unnecessary complexity
- **Backend as Source of Truth**: Always fetch from API, no local caching needed

### Why Tailwind CSS?

- **Utility-First**: Fast development, no custom CSS files
- **Consistency**: Built-in design system
- **Responsive**: Built-in responsive utilities
- **No Overhead**: Only used classes are included in build

---

## 14. Future Considerations

If the project grows, consider:

- **Persistent Database**: Replace in-memory DB with PostgreSQL or MongoDB
- **Authentication**: Add user authentication and authorization
- **State Management**: Add Redux or Zustand if state becomes complex
- **Caching**: Add Redis for caching frequently accessed data
- **API Versioning**: Add versioning (`/api/v1/notes`) for backward compatibility
- **Rate Limiting**: Add rate limiting to prevent abuse
- **Input Sanitization**: Add more robust input sanitization
- **Pagination**: Add pagination for large note lists

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[PRD.md](./PRD.md)**: Product Requirements Document with detailed tasks
- **[RULES.md](./RULES.md)**: Development best practices and coding standards
- **[API.md](./API.md)**: Detailed API endpoint documentation
- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)**: Frontend development guide
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**: Backend setup and structure guide
- **[LOGGING.md](./LOGGING.md)**: Logging standards and conventions
- **[IN-MEMORY-DB.md](./IN-MEMORY-DB.md)**: In-memory database explanation
- **[TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)**: UI styling guidelines
