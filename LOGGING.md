# Logging Standards

This document defines the logging rules and conventions for the **Notes Management Tool**. The goal is to ensure consistent, structured, and useful logs across all features.

---

## 1. General Requirements

- **All user actions must be logged**: Every CRUD operation generates a log entry
- **In-memory storage only**: Logs must be stored **in memory** (no persistent files or external log services)
- **Non-blocking**: Logging must be lightweight and should not block UI or API responsiveness
- **Consistent structure**: Every log entry must follow a consistent structure
- **Backend only**: Keep logging within the backend (not the frontend) - as per RULES.md
- **Short but meaningful**: Logs must be short but meaningful - as per RULES.md

---

## 2. Loggable Actions

The following actions must generate a log entry:

### Notes Operations

- **`NOTE_CREATED`** — A user adds a new note
- **`NOTE_UPDATED`** — A user updates an existing note
- **`NOTE_DELETED`** — A user deletes a note
- **`NOTES_LIST_VIEWED`** — A user opens or refreshes the list of notes (GET /notes)
- **`NOTE_DETAILS_VIEWED`** (optional) — A user opens a specific note (if implemented)

### System / Utility

- **`APP_STARTED`** — Application initialization (server startup)
- **`DB_RESET`** — In-memory database was cleared (used for tests)

### Action Naming Convention

- Use `UPPER_SNAKE_CASE` for action names
- Be descriptive but concise
- Use past tense for completed actions (e.g., `NOTE_CREATED`, not `CREATE_NOTE`)

---

## 3. Log Entry Format

Each log entry must adhere to the following structure:

### TypeScript Interface

```typescript
interface LogEntry {
  id: string; // Unique identifier (UUID or timestamp-based)
  action: LogAction; // Type of action (enum)
  timestamp: string; // ISO 8601 format
  details?: Record<string, any>; // Optional metadata depending on action
}
```

### JavaScript Implementation

```javascript
{
  id: "1732451239123",
  action: "NOTE_CREATED",
  timestamp: "2025-11-24T10:12:45.321Z",
  details: {
    noteId: "1732451239123",
    title: "My First Note"
  }
}
```

### Field Requirements

- **`id`**: Must be unique per log entry
  - Can be UUID: `"550e8400-e29b-41d4-a716-446655440000"`
  - Or timestamp-based: `Date.now().toString()`
- **`action`**: Required, must be one of the defined LogAction enum values
- **`timestamp`**: Required, must always be in ISO 8601 format (`new Date().toISOString()`)
- **`details`**: Optional but recommended for context
  - Should contain relevant metadata (noteId, title, etc.)
  - Should NOT contain large objects or full note content
  - Keep it lightweight

---

## 4. Action Enum Definition

### TypeScript Enum

```typescript
enum LogAction {
  NOTE_CREATED = "NOTE_CREATED",
  NOTE_UPDATED = "NOTE_UPDATED",
  NOTE_DELETED = "NOTE_DELETED",
  NOTES_LIST_VIEWED = "NOTES_LIST_VIEWED",
  NOTE_DETAILS_VIEWED = "NOTE_DETAILS_VIEWED",
  APP_STARTED = "APP_STARTED",
  DB_RESET = "DB_RESET",
}
```

### JavaScript Constants

```javascript
// logger-service.js
export const LogAction = {
  NOTE_CREATED: "NOTE_CREATED",
  NOTE_UPDATED: "NOTE_UPDATED",
  NOTE_DELETED: "NOTE_DELETED",
  NOTES_LIST_VIEWED: "NOTES_LIST_VIEWED",
  NOTE_DETAILS_VIEWED: "NOTE_DETAILS_VIEWED",
  APP_STARTED: "APP_STARTED",
  DB_RESET: "DB_RESET",
};
```

---

## 5. Log Entry Examples

### Creating a Log When a Note is Added

```javascript
import { loggerService } from "./services/logger-service.js";
import { LogAction } from "./services/logger-service.js";

// In notes-service.js after creating a note
loggerService.add({
  action: LogAction.NOTE_CREATED,
  details: {
    noteId: note.id,
    title: note.title,
  },
});
```

**Resulting Log Entry:**

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

### Log When a Note is Updated

```javascript
loggerService.add({
  action: LogAction.NOTE_UPDATED,
  details: {
    noteId: note.id,
    updatedFields: ["title", "content"],
  },
});
```

**Resulting Log Entry:**

```json
{
  "id": "1732451239124",
  "action": "NOTE_UPDATED",
  "timestamp": "2025-11-24T10:20:01.882Z",
  "details": {
    "noteId": "1732451239123",
    "updatedFields": ["title", "content"]
  }
}
```

### Log When a Note is Deleted

```javascript
loggerService.add({
  action: LogAction.NOTE_DELETED,
  details: {
    noteId: deletedNoteId,
  },
});
```

**Resulting Log Entry:**

```json
{
  "id": "1732451239125",
  "action": "NOTE_DELETED",
  "timestamp": "2025-11-24T10:25:15.456Z",
  "details": {
    "noteId": "1732451239123"
  }
}
```

### Log When Notes List is Viewed

```javascript
loggerService.add({
  action: LogAction.NOTES_LIST_VIEWED,
  // No details needed for list view
});
```

**Resulting Log Entry:**

```json
{
  "id": "1732451239126",
  "action": "NOTES_LIST_VIEWED",
  "timestamp": "2025-11-24T10:30:00.123Z"
}
```

### Log When App Starts

```javascript
// In app.js during server initialization
loggerService.add({
  action: LogAction.APP_STARTED,
  details: {
    port: process.env.PORT || 3001,
    environment: process.env.NODE_ENV || "development",
  },
});
```

**Resulting Log Entry:**

```json
{
  "id": "1732451239000",
  "action": "APP_STARTED",
  "timestamp": "2025-11-24T10:00:00.000Z",
  "details": {
    "port": 3001,
    "environment": "development"
  }
}
```

---

## 6. In-Memory Log Storage

### Storage Structure

Logs must be stored in a simple in-memory structure:

```javascript
// logger-service.js
const logs = []; // Array of LogEntry objects
```

### Service Interface

The logger service should expose the following API:

```typescript
interface LogService {
  add(entry: Omit<LogEntry, "id" | "timestamp">): void;
  getAll(): LogEntry[];
  clear(): void; // Primarily for tests
  getByAction(action: LogAction): LogEntry[]; // Optional: filter by action
}
```

### JavaScript Implementation

```javascript
// services/logger-service.js
const logs = [];

export const LogAction = {
  NOTE_CREATED: "NOTE_CREATED",
  NOTE_UPDATED: "NOTE_UPDATED",
  NOTE_DELETED: "NOTE_DELETED",
  NOTES_LIST_VIEWED: "NOTES_LIST_VIEWED",
  NOTE_DETAILS_VIEWED: "NOTE_DETAILS_VIEWED",
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
      id: Date.now().toString(), // or generateUUID()
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

/**
 * Gets log entries filtered by action (optional helper)
 * @param {string} action - Action type to filter by
 * @returns {Array} Filtered log entries
 */
export function getByAction(action) {
  return logs.filter((log) => log.action === action);
}

// Export as service object
export const loggerService = {
  add,
  getAll,
  clear,
  getByAction,
};
```

---

## 7. Integration with Notes Service

### How Logging is Called

Logging should be integrated into the notes service layer:

```javascript
// services/notes-service.js
import { loggerService, LogAction } from "./logger-service.js";
import { notesDB } from "../db/notes-db.js";

export function createNote(noteData) {
  // Validation
  if (!noteData.title || !noteData.title.trim()) {
    throw new Error("Title is required and cannot be empty");
  }

  // Create note
  const id = Date.now().toString();
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

export function updateNote(id, updates) {
  // Check if note exists
  if (!notesDB.has(id)) {
    throw new Error(`Note with id '${id}' not found`);
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

export function getAllNotes() {
  // Log the action
  loggerService.add({
    action: LogAction.NOTES_LIST_VIEWED,
  });

  return Array.from(notesDB.values());
}
```

### Important Notes

- **Log only successful operations**: Failed operations (validation errors, not found, etc.) should NOT generate action logs
- **Log after operation**: Log after the operation succeeds, not before
- **Keep details lightweight**: Don't store full note content in logs

---

## 8. Unit Testing Requirements

Each major action must have at least one unit test. Test the following scenarios:

### Test Cases

1. **Creating a note generates a `NOTE_CREATED` log**
2. **Editing a note generates a `NOTE_UPDATED` log**
3. **Deleting a note generates a `NOTE_DELETED` log**
4. **Viewing notes generates a `NOTES_LIST_VIEWED` log**
5. **Log entries follow the required structure** (id, action, timestamp, optional details)
6. **Logger stores entries in memory**
7. **Logger resets correctly** (clear() works)
8. **Invalid entries are ignored** (missing action, invalid action)
9. **Logging never throws errors** (error handling)

### Example Test Suite

```javascript
// tests/logger-service.test.js
import { loggerService, LogAction } from "../services/logger-service.js";

describe("Logger Service", () => {
  beforeEach(() => {
    loggerService.clear();
  });

  describe("add", () => {
    test("should create a log entry with required fields", () => {
      loggerService.add({
        action: LogAction.NOTE_CREATED,
        details: { noteId: "123" },
      });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toHaveProperty("id");
      expect(logs[0]).toHaveProperty("action", LogAction.NOTE_CREATED);
      expect(logs[0]).toHaveProperty("timestamp");
      expect(logs[0]).toHaveProperty("details");
    });

    test("should generate unique IDs for each log entry", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      loggerService.add({ action: LogAction.NOTE_UPDATED });

      const logs = loggerService.getAll();
      expect(logs[0].id).not.toBe(logs[1].id);
    });

    test("should generate ISO 8601 timestamps", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });

      const logs = loggerService.getAll();
      const timestamp = logs[0].timestamp;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    test("should ignore invalid actions", () => {
      loggerService.add({ action: "INVALID_ACTION" });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(0);
    });

    test("should not throw on errors", () => {
      expect(() => {
        loggerService.add(null);
        loggerService.add(undefined);
        loggerService.add({});
      }).not.toThrow();
    });
  });

  describe("getAll", () => {
    test("should return all log entries", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      loggerService.add({ action: LogAction.NOTE_UPDATED });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(2);
    });

    test("should return empty array when no logs exist", () => {
      const logs = loggerService.getAll();
      expect(logs).toEqual([]);
    });
  });

  describe("clear", () => {
    test("should remove all log entries", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      loggerService.add({ action: LogAction.NOTE_UPDATED });

      loggerService.clear();

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(0);
    });
  });
});

// tests/notes-service-logging.test.js
import { notesDB } from "../db/notes-db.js";
import { loggerService, LogAction } from "../services/logger-service.js";
import {
  createNote,
  updateNote,
  deleteNote,
  getAllNotes,
} from "../services/notes-service.js";

describe("Notes Service Logging", () => {
  beforeEach(() => {
    notesDB.clear();
    loggerService.clear();
  });

  test("should log NOTE_CREATED when creating a note", () => {
    createNote({ title: "Test", content: "Content" });

    const logs = loggerService.getAll();
    const createLog = logs.find((log) => log.action === LogAction.NOTE_CREATED);

    expect(createLog).toBeDefined();
    expect(createLog.details).toHaveProperty("noteId");
    expect(createLog.details).toHaveProperty("title", "Test");
  });

  test("should log NOTE_UPDATED when updating a note", () => {
    const note = createNote({ title: "Test", content: "Content" });
    updateNote(note.id, { title: "Updated" });

    const logs = loggerService.getAll();
    const updateLog = logs.find((log) => log.action === LogAction.NOTE_UPDATED);

    expect(updateLog).toBeDefined();
    expect(updateLog.details).toHaveProperty("noteId", note.id);
    expect(updateLog.details).toHaveProperty("updatedFields");
  });

  test("should log NOTE_DELETED when deleting a note", () => {
    const note = createNote({ title: "Test", content: "Content" });
    deleteNote(note.id);

    const logs = loggerService.getAll();
    const deleteLog = logs.find((log) => log.action === LogAction.NOTE_DELETED);

    expect(deleteLog).toBeDefined();
    expect(deleteLog.details).toHaveProperty("noteId", note.id);
  });

  test("should log NOTES_LIST_VIEWED when getting all notes", () => {
    getAllNotes();

    const logs = loggerService.getAll();
    const viewLog = logs.find(
      (log) => log.action === LogAction.NOTES_LIST_VIEWED
    );

    expect(viewLog).toBeDefined();
  });
});
```

---

## 9. Error Handling Rules

### Core Principles

- **Logging must never throw**: Errors are swallowed silently
- **Invalid entries are ignored**: Missing action, invalid action type, etc.
- **Development warnings**: System should warn in dev mode via `console.warn` for debugging

### Error Handling Implementation

```javascript
export function add(entry) {
  try {
    // Validate entry exists
    if (!entry) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Log entry is null or undefined");
      }
      return;
    }

    // Validate action
    if (!entry.action || !Object.values(LogAction).includes(entry.action)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Invalid log action: ${entry.action}`);
      }
      return; // Silently ignore
    }

    // Create and store log entry
    const logEntry = {
      id: Date.now().toString(),
      action: entry.action,
      timestamp: new Date().toISOString(),
      details: entry.details || undefined,
    };

    logs.push(logEntry);
  } catch (error) {
    // Logging must never throw - swallow errors silently
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to add log entry:", error);
    }
    // Do not rethrow - logging failures should not break the application
  }
}
```

### Error Scenarios

| Scenario                 | Behavior                              |
| ------------------------ | ------------------------------------- |
| Missing action           | Ignored, warning in dev mode          |
| Invalid action           | Ignored, warning in dev mode          |
| Null/undefined entry     | Ignored, warning in dev mode          |
| Exception during logging | Caught, warning in dev mode, no throw |
| Memory issues            | Handled by JavaScript runtime         |

---

## 10. Performance Considerations

### Guidelines

- **Keep logs lightweight**: No large objects in log entries
- **Avoid storing note content**: Store only IDs and titles, not full content
- **Limit memory usage**: Consider log rotation or limits for long-running tests
- **Non-blocking**: Logging should be synchronous but fast (no async operations needed)

### Best Practices

1. **Don't log full objects**:

   ```javascript
   // ❌ BAD
   loggerService.add({
     action: LogAction.NOTE_CREATED,
     details: { note: fullNoteObject }, // Too large
   });

   // ✅ GOOD
   loggerService.add({
     action: LogAction.NOTE_CREATED,
     details: { noteId: note.id, title: note.title }, // Lightweight
   });
   ```

2. **Don't log arrays of large objects**:

   ```javascript
   // ❌ BAD
   loggerService.add({
     action: LogAction.NOTES_LIST_VIEWED,
     details: { notes: allNotes }, // Could be large
   });

   // ✅ GOOD
   loggerService.add({
     action: LogAction.NOTES_LIST_VIEWED,
     // No details needed, or just count
     details: { count: allNotes.length },
   });
   ```

3. **Consider log limits for tests**:
   ```javascript
   // Optional: Add max log limit for very long test runs
   const MAX_LOGS = 10000;
   if (logs.length >= MAX_LOGS) {
     logs.shift(); // Remove oldest log
   }
   ```

---

## 11. Logging Flow Diagram

```
User Action (Frontend)
    ↓
API Request (Backend Route)
    ↓
Notes Service (Business Logic)
    ↓
Operation Success? → Yes → Logger Service
    ↓                              ↓
    No                        Create Log Entry
    ↓                              ↓
Error Response              Store in Memory
    ↓                              ↓
(No log generated)         Return to Service
                                    ↓
                            Service Returns Result
                                    ↓
                            Route Sends Response
```

**Key Points:**

- Logging happens **after** successful operations
- Failed operations do **not** generate action logs
- Logging is **non-blocking** and fast
- All logs stored **in memory** only

---

## 12. Future Expansion

This structure allows future extensions such as:

### Potential Enhancements

1. **Persisting logs to LocalStorage** (browser) or file system (Node.js)
2. **Exporting logs** to JSON or CSV format
3. **Filtering logs** by action, date range, or other criteria
4. **Adding user_id** once authentication exists
5. **Log levels** (INFO, WARN, ERROR) if needed
6. **Log rotation** to prevent memory issues in long-running applications
7. **Log aggregation** for multiple server instances
8. **Search functionality** within logs
9. **Log retention policies** (keep last N logs, or logs from last N hours)

### Example: Future Log Export

```javascript
// Future enhancement
export function exportToJSON() {
  return JSON.stringify(logs, null, 2);
}

export function exportToCSV() {
  const headers = "id,action,timestamp,details\n";
  const rows = logs.map((log) => {
    const details = log.details ? JSON.stringify(log.details) : "";
    return `${log.id},${log.action},${log.timestamp},"${details}"`;
  });
  return headers + rows.join("\n");
}
```

### Example: Future Log Filtering

```javascript
// Future enhancement
export function getByDateRange(startDate, endDate) {
  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}

export function getByAction(action) {
  return logs.filter((log) => log.action === action);
}
```

---

## 13. Summary Checklist

When implementing logging, ensure:

- ✅ All CRUD actions generate logs
- ✅ Logs follow the required structure (id, action, timestamp, optional details)
- ✅ Logs are stored in memory only
- ✅ Logging never throws errors
- ✅ Invalid entries are ignored
- ✅ Logs are lightweight (no large objects)
- ✅ Logging is integrated into service layer
- ✅ Unit tests cover all logging scenarios
- ✅ Logs are cleared in test setup
- ✅ Development warnings are shown for invalid entries

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[RULES.md](./RULES.md)**: Development best practices (includes logging rules)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System architecture (includes logging flow)
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**: Backend setup (includes logger service implementation)
- **[API.md](./API.md)**: API documentation (mentions logging behavior)
