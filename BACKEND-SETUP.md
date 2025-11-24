# Backend Setup Guide (Node.js + Express)

This document outlines the setup and structure for the backend of the **Notes Management Tool**, which uses an in-memory database and provides CRUD API endpoints.

---

## 1. Project Setup

### Initial Setup

1. **Initialize a Node.js project**:

   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. **Update `package.json`** to use ES modules:

   ```json
   {
     "name": "notes-backend",
     "type": "module",
     "version": "1.0.0",
     "main": "app.js",
     "scripts": {
       "start": "node app.js",
       "dev": "nodemon app.js",
       "test": "jest"
     }
   }
   ```

   **Important**: Add `"type": "module"` to enable ES6 module syntax (`import`/`export`).

3. **Install required dependencies**:

   ```bash
   npm install express cors
   npm install -D nodemon jest
   ```

   **Dependencies**:

   - `express`: Web framework for REST API
   - `cors`: Enable Cross-Origin Resource Sharing for frontend communication

   **Dev Dependencies**:

   - `nodemon`: Auto-restart server during development
   - `jest`: Testing framework

4. **Create `.env.example`** file:

   ```env
   PORT=3001
   NODE_ENV=development
   ```

5. **Create `.env`** file (and add to `.gitignore`):

   ```env
   PORT=3001
   NODE_ENV=development
   ```

6. **Create `.gitignore`**:

   ```
   node_modules/
   .env
   *.log
   .DS_Store
   ```

---

## 2. Folder Structure

### Complete Structure

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
│   └── error-handler.js   # Centralized error handling
├── middleware/
│   └── error-middleware.js # Express error middleware
├── config/
│   └── config.js          # Environment configuration
├── tests/                 # Unit tests
│   ├── notes-service.test.js
│   └── logger-service.test.js
├── package.json
├── .env.example           # Environment variables template
└── .gitignore
```

### Naming Conventions

- **Files**: `kebab-case` (e.g., `notes-service.js`, `error-handler.js`)
- **Functions/Variables**: `camelCase` (e.g., `createNote`, `getAllNotes`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

---

## 3. Environment Configuration

### Config Module

```javascript
// config/config.js
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
};
```

**Why a config module?**

- Centralized configuration access
- Default values for development
- Type safety (if using TypeScript)
- Easy to test and mock

---

## 4. Express Setup (app.js)

### Complete Express Application

```javascript
// app.js
import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import notesRouter from "./routes/notes.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { loggerService, LogAction } from "./services/logger-service.js";

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies

// Log app start
loggerService.add({
  action: LogAction.APP_STARTED,
  details: {
    port: config.port,
    environment: config.nodeEnv,
  },
});

// Routes
app.use("/notes", notesRouter);

// Health check endpoint (optional)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    code: "NOT_FOUND",
    details: {
      path: req.path,
      method: req.method,
    },
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
});
```

---

## 5. In-Memory Database

### Database Implementation

```javascript
// db/notes-db.js
/**
 * In-memory database for notes
 * Uses Map for O(1) lookup and deletion by ID
 * Data resets when server restarts (intended behavior)
 */
export const notesDB = new Map();
```

**Key Points**:

- Single shared instance exported
- Uses `Map` for O(1) performance
- Data is volatile (resets on restart)
- Accessed only through service layer

**See [IN-MEMORY-DB.md](./IN-MEMORY-DB.md)** for detailed explanation.

---

## 6. Routes (routes/notes.js)

### Route Implementation

```javascript
// routes/notes.js
import express from "express";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes-service.js";

const router = express.Router();

/**
 * GET /notes
 * Fetch all notes
 */
router.get("/", async (req, res, next) => {
  try {
    const notes = await getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

/**
 * POST /notes
 * Create a new note
 */
router.post("/", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await createNote({ title, content });
    res.status(201).json(note);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

/**
 * PUT /notes/:id
 * Update an existing note
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await updateNote(id, { title, content });
    res.status(200).json(note);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

/**
 * DELETE /notes/:id
 * Delete a note
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteNote(id);
    res.status(204).send(); // No content
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

export default router;
```

### Route Best Practices

1. **Keep routes thin**: Delegate business logic to services
2. **Use async/await**: Handle asynchronous operations properly
3. **Error handling**: Always use `next(error)` to pass errors to middleware
4. **HTTP status codes**: Use appropriate status codes (200, 201, 204, 400, 404, 500)
5. **No direct DB access**: Routes never access the database directly

---

## 7. Services

### Notes Service (services/notes-service.js)

```javascript
// services/notes-service.js
import { notesDB } from "../db/notes-db.js";
import { loggerService, LogAction } from "./logger-service.js";
import { validateNoteData } from "../utils/validation.js";

/**
 * Get all notes
 * @returns {Array} Array of all notes
 */
export function getAllNotes() {
  const notes = Array.from(notesDB.values());

  // Log the action
  loggerService.add({
    action: LogAction.NOTES_LIST_VIEWED,
  });

  return notes;
}

/**
 * Create a new note
 * @param {Object} noteData - Note data with title and content
 * @returns {Object} Created note object
 * @throws {Error} If validation fails
 */
export function createNote(noteData) {
  // Validate input
  validateNoteData(noteData);

  // Generate ID
  const id = Date.now().toString();

  // Create note object
  const note = {
    id,
    title: noteData.title.trim(),
    content: noteData.content.trim(),
    lastModified: new Date().toISOString(),
  };

  // Store in DB
  notesDB.set(id, note);

  // Log the action
  loggerService.add({
    action: LogAction.NOTE_CREATED,
    details: {
      noteId: note.id,
      title: note.title,
    },
  });

  return note;
}

/**
 * Get a note by ID
 * @param {string} id - Note ID
 * @returns {Object} Note object
 * @throws {Error} If note not found
 */
export function getNoteById(id) {
  const note = notesDB.get(id);

  if (!note) {
    throw new Error(`Note with id '${id}' not found`);
  }

  return note;
}

/**
 * Update an existing note
 * @param {string} id - Note ID
 * @param {Object} updates - Updated title and/or content
 * @returns {Object} Updated note object
 * @throws {Error} If note not found or validation fails
 */
export function updateNote(id, updates) {
  // Check if note exists
  if (!notesDB.has(id)) {
    throw new Error(`Note with id '${id}' not found`);
  }

  // Validate updates
  if (updates.title !== undefined) {
    if (!updates.title || !updates.title.trim()) {
      throw new Error("Title cannot be empty");
    }
  }
  if (updates.content !== undefined) {
    if (!updates.content || !updates.content.trim()) {
      throw new Error("Content cannot be empty");
    }
  }

  // Get existing note
  const note = notesDB.get(id);

  // Determine updated fields
  const updatedFields = [];
  if (updates.title !== undefined) updatedFields.push("title");
  if (updates.content !== undefined) updatedFields.push("content");

  // Update note
  const updatedNote = {
    ...note,
    ...updates,
    title: updates.title?.trim() || note.title,
    content: updates.content?.trim() || note.content,
    lastModified: new Date().toISOString(),
  };

  // Save back to DB
  notesDB.set(id, updatedNote);

  // Log the action
  loggerService.add({
    action: LogAction.NOTE_UPDATED,
    details: {
      noteId: id,
      updatedFields,
    },
  });

  return updatedNote;
}

/**
 * Delete a note by ID
 * @param {string} id - Note ID
 * @returns {boolean} True if deleted, false if not found
 * @throws {Error} If note not found
 */
export function deleteNote(id) {
  // Check if note exists
  if (!notesDB.has(id)) {
    throw new Error(`Note with id '${id}' not found`);
  }

  // Delete from DB
  notesDB.delete(id);

  // Log the action
  loggerService.add({
    action: LogAction.NOTE_DELETED,
    details: {
      noteId: id,
    },
  });

  return true;
}
```

### Logger Service (services/logger-service.js)

```javascript
// services/logger-service.js
const logs = [];

export const LogAction = {
  NOTE_CREATED: "NOTE_CREATED",
  NOTE_UPDATED: "NOTE_UPDATED",
  NOTE_DELETED: "NOTE_DELETED",
  NOTES_LIST_VIEWED: "NOTES_LIST_VIEWED",
  APP_STARTED: "APP_STARTED",
  DB_RESET: "DB_RESET",
};

/**
 * Adds a new log entry
 * @param {Object} entry - Log entry without id and timestamp
 * @param {string} entry.action - Action type (required)
 * @param {Object} [entry.details] - Optional metadata
 */
export function add(entry) {
  try {
    // Validate action
    if (!entry.action || !Object.values(LogAction).includes(entry.action)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Invalid log action: ${entry.action}`);
      }
      return; // Silently ignore invalid entries
    }

    // Create log entry
    const logEntry = {
      id: Date.now().toString(),
      action: entry.action,
      timestamp: new Date().toISOString(),
      details: entry.details || undefined,
    };

    // Store in memory
    logs.push(logEntry);
  } catch (error) {
    // Logging must never throw - swallow errors silently
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to add log entry:", error);
    }
  }
}

/**
 * Gets all log entries
 * @returns {Array} Array of all log entries
 */
export function getAll() {
  return [...logs]; // Return copy to prevent external mutation
}

/**
 * Clears all log entries (primarily for tests)
 */
export function clear() {
  logs.length = 0;
}

// Export as service object
export const loggerService = {
  add,
  getAll,
  clear,
};
```

**See [LOGGING.md](./LOGGING.md)** for detailed logging standards.

---

## 8. Validation

### Validation Utilities

```javascript
// utils/validation.js
/**
 * Validates note data (title and content)
 * @param {Object} noteData - Note data to validate
 * @throws {Error} If validation fails
 */
export function validateNoteData(noteData) {
  if (!noteData) {
    throw new Error("Note data is required");
  }

  if (!noteData.title || typeof noteData.title !== "string") {
    throw new Error("Title is required and must be a string");
  }

  if (!noteData.title.trim()) {
    throw new Error("Title cannot be empty");
  }

  if (!noteData.content || typeof noteData.content !== "string") {
    throw new Error("Content is required and must be a string");
  }

  if (!noteData.content.trim()) {
    throw new Error("Content cannot be empty");
  }
}

/**
 * Validates note ID
 * @param {string} id - Note ID to validate
 * @throws {Error} If validation fails
 */
export function validateNoteId(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Note ID is required and must be a string");
  }

  if (id.trim().length === 0) {
    throw new Error("Note ID cannot be empty");
  }
}
```

---

## 9. Error Handling

### Error Handler Utility

```javascript
// utils/error-handler.js
/**
 * Creates a standardized error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Error object
 */
export function createError(message, code, statusCode = 500, details = {}) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

/**
 * Creates a validation error
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Error object
 */
export function createValidationError(message, details = {}) {
  return createError(message, "VALIDATION_ERROR", 400, details);
}

/**
 * Creates a not found error
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Error object
 */
export function createNotFoundError(message, details = {}) {
  return createError(message, "NOT_FOUND", 404, details);
}

/**
 * Creates an internal server error
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Error object
 */
export function createInternalError(message, details = {}) {
  return createError(message, "INTERNAL_ERROR", 500, details);
}
```

### Error Middleware

```javascript
// middleware/error-middleware.js
/**
 * Centralized error handling middleware
 * Formats all errors into consistent JSON structure
 */
export function errorMiddleware(err, req, res, next) {
  // Log error (but don't expose internal details in production)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Determine status code and error details
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_ERROR";
  const errorMessage = err.message || "An unexpected error occurred";
  const errorDetails = err.details || {};

  // Don't expose internal error details in production
  const response = {
    error: errorMessage,
    code: errorCode,
    details: process.env.NODE_ENV === "production" ? {} : errorDetails,
  };

  res.status(statusCode).json(response);
}
```

### Error Response Format

All errors follow this structure (as per RULES.md):

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Error Types

- **400 Bad Request**: Invalid input data (validation errors)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Unexpected server errors

---

## 10. Updated Service with Error Handling

### Notes Service with Proper Error Handling

```javascript
// services/notes-service.js (updated)
import { notesDB } from "../db/notes-db.js";
import { loggerService, LogAction } from "./logger-service.js";
import { validateNoteData } from "../utils/validation.js";
import {
  createValidationError,
  createNotFoundError,
  createInternalError,
} from "../utils/error-handler.js";

export function createNote(noteData) {
  try {
    // Validate input
    validateNoteData(noteData);

    // Generate ID
    const id = Date.now().toString();

    // Create note object
    const note = {
      id,
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      lastModified: new Date().toISOString(),
    };

    // Store in DB
    notesDB.set(id, note);

    // Log the action (only on success)
    loggerService.add({
      action: LogAction.NOTE_CREATED,
      details: {
        noteId: note.id,
        title: note.title,
      },
    });

    return note;
  } catch (error) {
    // Re-throw validation errors
    if (error.message.includes("required") || error.message.includes("empty")) {
      throw createValidationError(error.message, {
        field: error.message.includes("Title") ? "title" : "content",
      });
    }
    // Re-throw other errors as internal errors
    throw createInternalError("Failed to create note", {
      originalError: error.message,
    });
  }
}

export function updateNote(id, updates) {
  try {
    // Check if note exists
    if (!notesDB.has(id)) {
      throw createNotFoundError(`Note with id '${id}' not found`, { id });
    }

    // Validate updates
    if (updates.title !== undefined && !updates.title.trim()) {
      throw createValidationError("Title cannot be empty", { field: "title" });
    }
    if (updates.content !== undefined && !updates.content.trim()) {
      throw createValidationError("Content cannot be empty", {
        field: "content",
      });
    }

    // Get existing note
    const note = notesDB.get(id);

    // Update note
    const updatedNote = {
      ...note,
      ...updates,
      title: updates.title?.trim() || note.title,
      content: updates.content?.trim() || note.content,
      lastModified: new Date().toISOString(),
    };

    // Save back to DB
    notesDB.set(id, updatedNote);

    // Log the action (only on success)
    loggerService.add({
      action: LogAction.NOTE_UPDATED,
      details: {
        noteId: id,
        updatedFields: Object.keys(updates),
      },
    });

    return updatedNote;
  } catch (error) {
    // Re-throw known errors
    if (error.code) {
      throw error;
    }
    // Re-throw other errors as internal errors
    throw createInternalError("Failed to update note", {
      originalError: error.message,
    });
  }
}

export function deleteNote(id) {
  try {
    // Check if note exists
    if (!notesDB.has(id)) {
      throw createNotFoundError(`Note with id '${id}' not found`, { id });
    }

    // Delete from DB
    notesDB.delete(id);

    // Log the action (only on success)
    loggerService.add({
      action: LogAction.NOTE_DELETED,
      details: {
        noteId: id,
      },
    });

    return true;
  } catch (error) {
    // Re-throw known errors
    if (error.code) {
      throw error;
    }
    // Re-throw other errors as internal errors
    throw createInternalError("Failed to delete note", {
      originalError: error.message,
    });
  }
}
```

---

## 11. Unit Testing

### Jest Configuration

Create `jest.config.js`:

```javascript
// jest.config.js
export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
```

### Test Example: Notes Service

```javascript
// tests/notes-service.test.js
import { describe, it, expect, beforeEach } from "@jest/globals";
import { notesDB } from "../db/notes-db.js";
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
} from "../services/notes-service.js";
import { loggerService } from "../services/logger-service.js";

describe("Notes Service", () => {
  beforeEach(() => {
    // Reset in-memory DB before each test
    notesDB.clear();
    loggerService.clear();
  });

  describe("createNote", () => {
    it("should create a note successfully", () => {
      const noteData = {
        title: "Test Note",
        content: "Test content",
      };

      const note = createNote(noteData);

      expect(note).toHaveProperty("id");
      expect(note.title).toBe("Test Note");
      expect(note.content).toBe("Test content");
      expect(note).toHaveProperty("lastModified");
      expect(notesDB.has(note.id)).toBe(true);
    });

    it("should throw error when title is empty", () => {
      const noteData = {
        title: "",
        content: "Content",
      };

      expect(() => createNote(noteData)).toThrow("Title cannot be empty");
    });

    it("should throw error when content is empty", () => {
      const noteData = {
        title: "Title",
        content: "",
      };

      expect(() => createNote(noteData)).toThrow("Content cannot be empty");
    });
  });

  describe("getAllNotes", () => {
    it("should return empty array when no notes exist", () => {
      expect(getAllNotes()).toEqual([]);
    });

    it("should return all notes", () => {
      createNote({ title: "Note 1", content: "Content 1" });
      createNote({ title: "Note 2", content: "Content 2" });

      const notes = getAllNotes();
      expect(notes).toHaveLength(2);
    });
  });

  describe("updateNote", () => {
    it("should update a note successfully", () => {
      const note = createNote({
        title: "Original",
        content: "Original content",
      });
      const updated = updateNote(note.id, { title: "Updated" });

      expect(updated.title).toBe("Updated");
      expect(updated.content).toBe("Original content");
      expect(updated.lastModified).not.toBe(note.lastModified);
    });

    it("should throw error when note not found", () => {
      expect(() => updateNote("nonexistent", { title: "Updated" })).toThrow(
        "not found"
      );
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", () => {
      const note = createNote({ title: "To Delete", content: "Content" });
      const deleted = deleteNote(note.id);

      expect(deleted).toBe(true);
      expect(notesDB.has(note.id)).toBe(false);
    });

    it("should throw error when note not found", () => {
      expect(() => deleteNote("nonexistent")).toThrow("not found");
    });
  });
});
```

### Test Example: Logger Service

```javascript
// tests/logger-service.test.js
import { describe, it, expect, beforeEach } from "@jest/globals";
import { loggerService, LogAction } from "../services/logger-service.js";

describe("Logger Service", () => {
  beforeEach(() => {
    loggerService.clear();
  });

  it("should add a log entry", () => {
    loggerService.add({
      action: LogAction.NOTE_CREATED,
      details: { noteId: "123" },
    });

    const logs = loggerService.getAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe(LogAction.NOTE_CREATED);
    expect(logs[0]).toHaveProperty("id");
    expect(logs[0]).toHaveProperty("timestamp");
  });

  it("should ignore invalid actions", () => {
    loggerService.add({ action: "INVALID_ACTION" });
    expect(loggerService.getAll()).toHaveLength(0);
  });
});
```

---

## 12. Development Workflow

### Running the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

### Testing

```bash
npm test
```

### Environment Variables

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
```

---

## 13. Best Practices Summary

### Architecture

1. **Separation of Concerns**: Routes handle HTTP, services handle business logic
2. **Service Layer**: All business logic in services, not routes
3. **No Direct DB Access**: Routes never access database directly
4. **Centralized Error Handling**: Use error middleware for consistent error responses
5. **Environment Configuration**: Use config module for all configuration

### Code Quality

1. **ES6 Modules**: Use `import`/`export` syntax
2. **Error Handling**: Always handle errors and use proper HTTP status codes
3. **Validation**: Validate all input data
4. **Logging**: Log all successful CRUD operations
5. **Testing**: Write tests for all service methods

### File Organization

1. **Clear Structure**: Follow the folder structure consistently
2. **Naming Conventions**: Use kebab-case for files, camelCase for functions
3. **Single Responsibility**: Each file should have one clear purpose
4. **Reusability**: Extract common logic into utilities

---

## 14. Troubleshooting

### Common Issues

1. **"Cannot use import statement outside a module"**

   - Solution: Add `"type": "module"` to `package.json`

2. **CORS errors from frontend**

   - Solution: Ensure `cors()` middleware is enabled in `app.js`

3. **Port already in use**

   - Solution: Change `PORT` in `.env` or kill the process using the port

4. **Tests failing**
   - Solution: Ensure `notesDB.clear()` and `loggerService.clear()` are called in `beforeEach`

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Overall system architecture
- **[API.md](./API.md)**: API endpoint documentation
- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)**: Frontend development guide
- **[IN-MEMORY-DB.md](./IN-MEMORY-DB.md)**: In-memory database explanation
- **[LOGGING.md](./LOGGING.md)**: Logging standards and conventions
- **[RULES.md](./RULES.md)**: Development best practices
