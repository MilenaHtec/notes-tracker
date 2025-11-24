# API Documentation

This document describes the API endpoints for the Notes Management Tool. The backend uses an in-memory database and exposes simple CRUD operations for managing notes.

---

## Base URL

```
http://localhost:3001
```

---

## Request/Response Format

All requests and responses use JSON format. Set the `Content-Type` header to `application/json` for POST and PUT requests.

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Notes Endpoints

### 1. Create a Note

**POST** `/notes`

Creates a new note with a title and content.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body (JSON)

```json
{
  "title": "My First Note",
  "content": "This is a sample note."
}
```

#### Validation Rules

- `title` (required, string): Cannot be empty or whitespace only
- `content` (required, string): Cannot be empty or whitespace only

#### Success Response (201 Created)

```json
{
  "id": "1732451239123",
  "title": "My First Note",
  "content": "This is a sample note.",
  "lastModified": "2025-11-24T10:12:45.321Z"
}
```

#### Error Responses

**400 Bad Request** - Invalid input

```json
{
  "error": "Title and content are required and cannot be empty",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "title",
    "message": "Title cannot be empty"
  }
}
```

**500 Internal Server Error** - Unexpected server error

```json
{
  "error": "An unexpected error occurred while creating the note",
  "code": "INTERNAL_ERROR",
  "details": {}
}
```

#### Example cURL Request

```bash
curl -X POST http://localhost:3001/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is a sample note."
  }'
```

---

### 2. Get All Notes

**GET** `/notes`

Returns a list of all saved notes.

#### Success Response (200 OK)

```json
[
  {
    "id": "1732451239123",
    "title": "My First Note",
    "content": "This is a sample note.",
    "lastModified": "2025-11-24T10:12:45.321Z"
  },
  {
    "id": "1732451239124",
    "title": "Second Note",
    "content": "Another note here.",
    "lastModified": "2025-11-24T10:15:30.123Z"
  }
]
```

**Note:** Returns an empty array `[]` if no notes exist.

#### Error Responses

**500 Internal Server Error** - Unexpected server error

```json
{
  "error": "An unexpected error occurred while fetching notes",
  "code": "INTERNAL_ERROR",
  "details": {}
}
```

#### Example cURL Request

```bash
curl -X GET http://localhost:3001/notes
```

---

### 3. Update a Note

**PUT** `/notes/:id`

Updates the title or content of an existing note. The `lastModified` timestamp is automatically updated.

#### Request Headers

```
Content-Type: application/json
```

#### URL Parameters

- `id` (required, string): The unique identifier of the note to update

#### Request Body (JSON)

```json
{
  "title": "Updated Note Title",
  "content": "Updated content."
}
```

#### Validation Rules

- `title` (required, string): Cannot be empty or whitespace only
- `content` (required, string): Cannot be empty or whitespace only

#### Success Response (200 OK)

```json
{
  "id": "1732451239123",
  "title": "Updated Note Title",
  "content": "Updated content.",
  "lastModified": "2025-11-24T10:20:01.882Z"
}
```

#### Error Responses

**400 Bad Request** - Invalid input

```json
{
  "error": "Title and content are required and cannot be empty",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "content",
    "message": "Content cannot be empty"
  }
}
```

**404 Not Found** - Note does not exist

```json
{
  "error": "Note with id '1732451239123' not found",
  "code": "NOT_FOUND",
  "details": {
    "id": "1732451239123"
  }
}
```

**500 Internal Server Error** - Unexpected server error

```json
{
  "error": "An unexpected error occurred while updating the note",
  "code": "INTERNAL_ERROR",
  "details": {}
}
```

#### Example cURL Request

```bash
curl -X PUT http://localhost:3001/notes/1732451239123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note Title",
    "content": "Updated content."
  }'
```

---

### 4. Delete a Note

**DELETE** `/notes/:id`

Deletes a note by ID.

#### URL Parameters

- `id` (required, string): The unique identifier of the note to delete

#### Success Response (204 No Content)

No response body. The note has been successfully deleted.

#### Error Responses

**404 Not Found** - Note does not exist

```json
{
  "error": "Note with id '1732451239123' not found",
  "code": "NOT_FOUND",
  "details": {
    "id": "1732451239123"
  }
}
```

**500 Internal Server Error** - Unexpected server error

```json
{
  "error": "An unexpected error occurred while deleting the note",
  "code": "INTERNAL_ERROR",
  "details": {}
}
```

#### Example cURL Request

```bash
curl -X DELETE http://localhost:3001/notes/1732451239123
```

---

## Logging Behavior

Every CRUD action (create, update, delete) triggers a log entry with:

- **action type** - The type of operation performed
- **affected note ID** - The ID of the note being operated on
- **optional payload** - Additional data relevant to the action
- **timestamp** - ISO 8601 formatted timestamp

### Example Log Entries

**Create Note:**

```json
{
  "action": "CREATE_NOTE",
  "payload": {
    "id": "1732451239123",
    "title": "My First Note"
  },
  "timestamp": "2025-11-24T10:12:45.321Z"
}
```

**Update Note:**

```json
{
  "action": "UPDATE_NOTE",
  "payload": {
    "id": "1732451239123",
    "title": "Updated Note Title"
  },
  "timestamp": "2025-11-24T10:20:01.882Z"
}
```

**Delete Note:**

```json
{
  "action": "DELETE_NOTE",
  "payload": {
    "id": "1732451239123"
  },
  "timestamp": "2025-11-24T10:25:15.456Z"
}
```

**Note:** Logs are only generated for successful operations. Failed operations (validation errors, not found, etc.) are logged as errors but do not generate action logs.

---

## Data Model

### Note Object

```typescript
{
  id: string; // Unique identifier (timestamp-based)
  title: string; // Note title (required, non-empty)
  content: string; // Note content (required, non-empty)
  lastModified: string; // ISO 8601 timestamp of last modification
}
```

### Field Descriptions

- **id**: Automatically generated unique identifier (typically a timestamp string)
- **title**: User-provided title for the note (must be non-empty string)
- **content**: User-provided content for the note (must be non-empty string)
- **lastModified**: Automatically updated timestamp in ISO 8601 format (e.g., `2025-11-24T10:12:45.321Z`)

---

## Important Notes

1. **In-Memory Database**: All data is stored in memory and will be lost when the server restarts. This is intended behavior for this application.

2. **ID Format**: Note IDs are typically timestamp-based strings, but the API accepts any string as a valid ID format.

3. **Timestamps**: All timestamps are in ISO 8601 format (UTC timezone).

4. **Data Persistence**: This API does not persist data to disk. All notes exist only in memory during the server's runtime.

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System architecture and API design
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**: Backend setup and route implementation
- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)**: Frontend API integration examples
- **[RULES.md](./RULES.md)**: Development best practices (includes API design rules)
- **[IN-MEMORY-DB.md](./IN-MEMORY-DB.md)**: In-memory database explanation
- **[LOGGING.md](./LOGGING.md)**: Logging standards (mentions API logging behavior)
