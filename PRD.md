# Product Requirements Document (PRD)

## Personal Notes Management Tool

This document outlines the product requirements, features, and implementation tasks for the **Personal Notes Management Tool**.

---

## 1. Product Overview

### 1.1 Purpose

A simple full-stack web application that helps users manage their personal notes. Users can create, view, edit, and delete notes with a clean, intuitive interface.

### 1.2 Target Users

- Individual users who need a simple note-taking solution
- Users who want a lightweight, fast note management tool
- Developers learning full-stack development

### 1.3 Key Value Propositions

- **Simple & Fast**: No complex setup, instant access
- **Clean UI**: Elegant dark theme with intuitive navigation
- **Action Tracking**: All user actions are logged for transparency
- **Testable**: Fully tested codebase for reliability

---

## 2. Functional Requirements

### 2.1 Core Features

#### FR-1: Create Note

**Description**: Users can create a new note with a title and content.

**Requirements**:

- User must provide both title and content (both are required)
- Title and content cannot be empty or whitespace-only
- System automatically generates a unique ID for each note
- System automatically sets `lastModified` timestamp when note is created
- Note is immediately available in the notes list after creation

**User Flow**:

1. User clicks "New Note" button or selects "Create Note" option
2. User enters title in the title input field
3. User enters content in the content textarea
4. User clicks "Save Note" button
5. System validates input (title and content are not empty)
6. System creates note and displays it in the sidebar
7. System logs the creation action

**Acceptance Criteria**:

- ✅ User can create a note with title and content
- ✅ Empty title or content shows validation error
- ✅ Created note appears in sidebar immediately
- ✅ Created note has unique ID and timestamp
- ✅ Action is logged with `NOTE_CREATED` action type

---

#### FR-2: View All Notes

**Description**: Users can view a list of all saved notes.

**Requirements**:

- Display all notes in a scrollable sidebar
- Each note card shows:
  - Note title
  - Content preview (first 2 lines, truncated)
  - Last modified timestamp (formatted for readability)
- Notes are displayed in a list format
- Empty state shown when no notes exist
- List updates automatically when notes are added/updated/deleted

**User Flow**:

1. User opens the application
2. System fetches all notes from backend
3. System displays notes in sidebar
4. If no notes exist, system shows empty state message

**Acceptance Criteria**:

- ✅ All notes are displayed in sidebar
- ✅ Each note shows title, preview, and timestamp
- ✅ Empty state is shown when no notes exist
- ✅ List refreshes when notes change
- ✅ Action is logged with `NOTES_LIST_VIEWED` action type

---

#### FR-3: Edit Note

**Description**: Users can edit existing notes by updating title and/or content.

**Requirements**:

- User can select a note from the sidebar to edit
- Selected note is highlighted in the sidebar
- Note data (title and content) is loaded into the editor
- User can modify title and/or content
- Updated title and content cannot be empty
- System automatically updates `lastModified` timestamp
- Changes are saved when user clicks "Update Note"
- Updated note is reflected in the sidebar immediately

**User Flow**:

1. User clicks on a note in the sidebar
2. Note is highlighted as selected
3. Note data loads into the main editor area
4. User modifies title and/or content
5. User clicks "Update Note" button
6. System validates input (title and content are not empty)
7. System updates note and refreshes the list
8. System logs the update action

**Acceptance Criteria**:

- ✅ User can select a note to edit
- ✅ Selected note is highlighted
- ✅ Note data loads into editor
- ✅ User can modify title and content
- ✅ Empty title or content shows validation error
- ✅ Updated note appears in sidebar with new timestamp
- ✅ Action is logged with `NOTE_UPDATED` action type

---

#### FR-4: Delete Note

**Description**: Users can delete notes they no longer want.

**Requirements**:

- User can delete a note via delete button/icon
- System should confirm deletion (optional but recommended)
- Deleted note is removed from the list immediately
- If deleted note was selected for editing, editor is cleared

**User Flow**:

1. User clicks delete button/icon on a note card
2. System shows confirmation dialog (optional)
3. User confirms deletion
4. System deletes note from database
5. Note is removed from sidebar
6. If note was being edited, editor is cleared
7. System logs the deletion action

**Acceptance Criteria**:

- ✅ User can delete a note
- ✅ Deleted note is removed from sidebar immediately
- ✅ Editor is cleared if deleted note was being edited
- ✅ Action is logged with `NOTE_DELETED` action type

---

### 2.2 UI/UX Requirements

#### FR-5: User Interface

**Description**: Clean, elegant dark theme interface.

**Requirements**:

- Dark gray color scheme (gray-900, gray-800, gray-700)
- Indigo accent color for selected items and focus states
- Responsive layout:
  - Header (full width, fixed height)
  - Sidebar (fixed width, scrollable)
  - Main content area (flexible width, note editor)
- Mobile-responsive: Sidebar collapsible on small screens
- All interactive elements have hover and focus states
- Loading states for async operations
- Error messages displayed clearly

**Acceptance Criteria**:

- ✅ Dark theme applied consistently
- ✅ Layout is responsive and works on mobile
- ✅ All interactive elements have proper states
- ✅ Loading indicators shown during operations
- ✅ Error messages are user-friendly

---

## 3. Non-Functional Requirements

### 3.1 Logging (NFR-1)

**Description**: All user actions must be logged.

**Requirements**:

- Log every CRUD action (create, update, delete, view)
- Logs stored in memory (no persistent files)
- Each log entry contains:
  - Unique ID
  - Action type (NOTE_CREATED, NOTE_UPDATED, NOTE_DELETED, NOTES_LIST_VIEWED)
  - Timestamp (ISO 8601 format)
  - Optional details (note ID, title, updated fields, etc.)
- Logging must not block UI or API responsiveness
- Logging must never throw errors (fail silently)
- Logs reset when server restarts

**Acceptance Criteria**:

- ✅ All CRUD actions generate log entries
- ✅ Logs follow required structure
- ✅ Logs are stored in memory only
- ✅ Logging never throws errors
- ✅ Logs are accessible via logger service

**See [LOGGING.md](./LOGGING.md)** for detailed logging standards.

---

### 3.2 Testing (NFR-2)

**Description**: Each feature must be covered with at least one unit test.

**Requirements**:

- Backend: Unit tests for all service methods
- Backend: Tests for logger service
- Backend: Tests for validation utilities
- Frontend: Component rendering tests
- Frontend: User interaction tests
- Frontend: API integration tests (mocked)
- Tests must be fast and isolated
- Database/logs must be reset between tests

**Acceptance Criteria**:

- ✅ Each public function has at least one test
- ✅ Tests cover create, read, update, delete operations
- ✅ Tests cover error scenarios
- ✅ Tests are fast and isolated
- ✅ Test coverage meets minimum requirements

**See [RULES.md](./RULES.md)** for testing standards.

---

### 3.3 Data Storage (NFR-3)

**Description**: No persistent data storage required.

**Requirements**:

- Use in-memory database (JavaScript Map)
- Data resets when server restarts (intended behavior)
- No external database dependencies
- No file system storage
- No localStorage or sessionStorage on frontend

**Acceptance Criteria**:

- ✅ All data stored in memory
- ✅ Data resets on server restart
- ✅ No external database required
- ✅ No file system operations

**See [IN-MEMORY-DB.md](./IN-MEMORY-DB.md)** for database implementation details.

---

### 3.4 Performance (NFR-4)

**Description**: Application must be responsive and fast.

**Requirements**:

- API responses should be fast (< 100ms for simple operations)
- UI should be responsive (no blocking operations)
- Loading states shown for async operations
- Error handling should not cause UI freezes

**Acceptance Criteria**:

- ✅ API responses are fast
- ✅ UI remains responsive during operations
- ✅ Loading indicators shown appropriately
- ✅ No UI freezes or blocking

---

### 3.5 Code Quality (NFR-5)

**Description**: Code must follow best practices and be maintainable.

**Requirements**:

- Follow naming conventions (kebab-case for files, PascalCase for components, camelCase for functions)
- Keep functions short, pure, and predictable
- Use service layer pattern (routes → services → database)
- Centralized error handling
- Consistent code formatting (ESLint, Prettier)

**Acceptance Criteria**:

- ✅ Code follows naming conventions
- ✅ Functions are short and focused
- ✅ Service layer pattern implemented
- ✅ Error handling is centralized
- ✅ Code is formatted consistently

**See [RULES.md](./RULES.md)** for complete coding standards.

---

## 4. Technical Requirements

### 4.1 Technology Stack

**Frontend**:

- React (UI library)
- Vite (build tool)
- Tailwind CSS (styling)
- Fetch API (HTTP requests)

**Backend**:

- Node.js (runtime)
- Express (web framework)
- CORS (cross-origin support)
- In-memory Map (database)

**Testing**:

- Jest (backend testing)
- Vitest + React Testing Library (frontend testing)

**See [ARCHITECTURE.md](./ARCHITECTURE.md)** for detailed architecture.

---

### 4.2 Project Structure

**Backend Structure**:

```
backend/
├── app.js                 # Express entry point
├── routes/
│   └── notes.js          # CRUD routes
├── services/
│   ├── notes-service.js  # Business logic
│   └── logger-service.js # Logging
├── db/
│   └── notes-db.js       # In-memory DB
├── utils/
│   ├── validation.js     # Input validation
│   └── error-handler.js  # Error utilities
├── middleware/
│   └── error-middleware.js # Error middleware
├── config/
│   └── config.js         # Configuration
└── tests/                # Unit tests
```

**Frontend Structure**:

```
frontend/
├── src/
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API calls
│   ├── utils/            # Helpers
│   └── App.jsx           # Root component
└── tailwind.config.js
```

**See [ARCHITECTURE.md](./ARCHITECTURE.md)** for complete structure.

---

### 4.3 API Endpoints

| Method   | Endpoint     | Description   | Status Codes       |
| -------- | ------------ | ------------- | ------------------ |
| `GET`    | `/notes`     | Get all notes | 200, 500           |
| `POST`   | `/notes`     | Create note   | 201, 400, 500      |
| `PUT`    | `/notes/:id` | Update note   | 200, 400, 404, 500 |
| `DELETE` | `/notes/:id` | Delete note   | 204, 404, 500      |

**See [API.md](./API.md)** for detailed API documentation.

---

## 5. User Stories

### US-1: Create Note

**As a** user  
**I want to** create a new note with title and content  
**So that** I can save my thoughts and information

**Acceptance Criteria**:

- I can enter a title and content
- I can save the note
- The note appears in my notes list
- I see an error if title or content is empty

---

### US-2: View Notes

**As a** user  
**I want to** see all my saved notes  
**So that** I can quickly find what I'm looking for

**Acceptance Criteria**:

- I can see all my notes in a list
- Each note shows title, preview, and last modified time
- I see a message when I have no notes

---

### US-3: Edit Note

**As a** user  
**I want to** edit my existing notes  
**So that** I can update information when needed

**Acceptance Criteria**:

- I can select a note to edit
- I can modify the title and content
- I can save the changes
- The note updates with a new timestamp

---

### US-4: Delete Note

**As a** user  
**I want to** delete notes I no longer need  
**So that** I can keep my notes list organized

**Acceptance Criteria**:

- I can delete a note
- The note is removed from my list
- I can confirm before deleting (optional)

---

## 6. Detailed Implementation Tasks

### Phase 1: Backend Setup

#### Task 1.1: Initialize Backend Project

**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:

1. Create `backend/` directory
2. Initialize npm project with `npm init -y`
3. Add `"type": "module"` to `package.json`
4. Install dependencies: `express`, `cors`
5. Install dev dependencies: `nodemon`, `jest`
6. Create `.env.example` and `.env` files
7. Create `.gitignore` file

**Acceptance Criteria**:

- ✅ Backend project initialized
- ✅ Dependencies installed
- ✅ Environment files created
- ✅ `.gitignore` configured

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md)

---

#### Task 1.2: Setup Express Application

**Priority**: High  
**Estimated Time**: 1 hour

**Steps**:

1. Create `app.js` with Express setup
2. Configure CORS middleware
3. Configure JSON body parser
4. Create config module (`config/config.js`)
5. Setup error middleware
6. Add health check endpoint
7. Add 404 handler

**Acceptance Criteria**:

- ✅ Express app runs on port 3001
- ✅ CORS enabled
- ✅ JSON parsing works
- ✅ Error handling middleware in place
- ✅ Health check endpoint responds

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md)

---

#### Task 1.3: Implement In-Memory Database

**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:

1. Create `db/notes-db.js`
2. Export `notesDB` as a Map instance
3. Document the database structure

**Acceptance Criteria**:

- ✅ `notesDB` Map exported
- ✅ Database accessible from services
- ✅ Documented in code

**Related Documentation**: [IN-MEMORY-DB.md](./IN-MEMORY-DB.md)

---

#### Task 1.4: Implement Logger Service

**Priority**: High  
**Estimated Time**: 1 hour

**Steps**:

1. Create `services/logger-service.js`
2. Define `LogAction` enum/constants
3. Implement `add()` function
4. Implement `getAll()` function
5. Implement `clear()` function
6. Add error handling (never throw)
7. Add validation for action types

**Acceptance Criteria**:

- ✅ Logger service exports all required functions
- ✅ Logs stored in memory array
- ✅ Log entries follow required structure
- ✅ Invalid entries are ignored
- ✅ Logging never throws errors

**Related Documentation**: [LOGGING.md](./LOGGING.md)

---

#### Task 1.5: Implement Validation Utilities

**Priority**: Medium  
**Estimated Time**: 1 hour

**Steps**:

1. Create `utils/validation.js`
2. Implement `validateNoteData()` function
3. Implement `validateNoteId()` function
4. Add proper error messages

**Acceptance Criteria**:

- ✅ Validation functions work correctly
- ✅ Proper error messages returned
- ✅ Handles edge cases (null, undefined, empty strings)

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md)

---

#### Task 1.6: Implement Error Handler Utilities

**Priority**: Medium  
**Estimated Time**: 1 hour

**Steps**:

1. Create `utils/error-handler.js`
2. Implement `createError()` function
3. Implement `createValidationError()` function
4. Implement `createNotFoundError()` function
5. Implement `createInternalError()` function

**Acceptance Criteria**:

- ✅ Error creation functions work
- ✅ Errors have proper structure (error, code, details, statusCode)
- ✅ Consistent error format

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md)

---

#### Task 1.7: Implement Error Middleware

**Priority**: Medium  
**Estimated Time**: 1 hour

**Steps**:

1. Create `middleware/error-middleware.js`
2. Implement error middleware function
3. Format errors into consistent JSON structure
4. Log errors in development mode
5. Hide internal details in production

**Acceptance Criteria**:

- ✅ Error middleware catches all errors
- ✅ Consistent error response format
- ✅ Proper HTTP status codes
- ✅ Internal details hidden in production

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md)

---

#### Task 1.8: Implement Notes Service

**Priority**: High  
**Estimated Time**: 2 hours

**Steps**:

1. Create `services/notes-service.js`
2. Implement `getAllNotes()` function
3. Implement `createNote()` function
4. Implement `getNoteById()` function
5. Implement `updateNote()` function
6. Implement `deleteNote()` function
7. Add validation calls
8. Add logging calls (only on success)
9. Add error handling

**Acceptance Criteria**:

- ✅ All CRUD operations implemented
- ✅ Validation integrated
- ✅ Logging integrated
- ✅ Error handling in place
- ✅ Timestamps updated correctly

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md), [LOGGING.md](./LOGGING.md)

---

#### Task 1.9: Implement Notes Routes

**Priority**: High  
**Estimated Time**: 1.5 hours

**Steps**:

1. Create `routes/notes.js`
2. Implement `GET /notes` route
3. Implement `POST /notes` route
4. Implement `PUT /notes/:id` route
5. Implement `DELETE /notes/:id` route
6. Add error handling (use `next(error)`)
7. Use proper HTTP status codes
8. Connect routes to app.js

**Acceptance Criteria**:

- ✅ All routes implemented
- ✅ Routes call service layer
- ✅ Proper HTTP status codes
- ✅ Error handling works
- ✅ Routes registered in app.js

**Related Documentation**: [BACKEND-SETUP.md](./BACKEND-SETUP.md), [API.md](./API.md)

---

#### Task 1.10: Backend Unit Tests

**Priority**: High  
**Estimated Time**: 3 hours

**Steps**:

1. Setup Jest configuration
2. Create `tests/notes-service.test.js`
3. Test `createNote()` - success and validation errors
4. Test `getAllNotes()` - empty and with notes
5. Test `updateNote()` - success and not found
6. Test `deleteNote()` - success and not found
7. Create `tests/logger-service.test.js`
8. Test logger `add()`, `getAll()`, `clear()`
9. Test invalid action handling
10. Ensure DB and logs are reset between tests

**Acceptance Criteria**:

- ✅ All service methods have tests
- ✅ Logger service has tests
- ✅ Tests are isolated (reset DB/logs)
- ✅ Tests cover success and error cases
- ✅ All tests pass

**Related Documentation**: [RULES.md](./RULES.md), [BACKEND-SETUP.md](./BACKEND-SETUP.md)

---

### Phase 2: Frontend Setup

#### Task 2.1: Initialize Frontend Project

**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:

1. Create `frontend/` directory
2. Initialize Vite React project
3. Install Tailwind CSS and dependencies
4. Configure Tailwind (`tailwind.config.js`)
5. Add Tailwind directives to CSS
6. Create `.env` file for API URL

**Acceptance Criteria**:

- ✅ Frontend project initialized
- ✅ Tailwind configured
- ✅ Environment variables set up
- ✅ Dev server runs successfully

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.2: Setup Project Structure

**Priority**: High  
**Estimated Time**: 30 minutes

**Steps**:

1. Create folder structure:
   - `src/components/`
   - `src/pages/`
   - `src/hooks/`
   - `src/services/`
   - `src/utils/`
2. Create placeholder files
3. Setup main `App.jsx` structure

**Acceptance Criteria**:

- ✅ Folder structure created
- ✅ Naming conventions followed
- ✅ Basic App.jsx structure in place

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md), [ARCHITECTURE.md](./ARCHITECTURE.md)

---

#### Task 2.3: Implement API Service

**Priority**: High  
**Estimated Time**: 1.5 hours

**Steps**:

1. Create `services/notes-api.js`
2. Implement `getAllNotes()` function
3. Implement `createNote()` function
4. Implement `updateNote()` function
5. Implement `deleteNote()` function
6. Add error handling
7. Use environment variable for base URL

**Acceptance Criteria**:

- ✅ All API functions implemented
- ✅ Error handling in place
- ✅ Uses environment variable for URL
- ✅ Proper error messages

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md), [API.md](./API.md)

---

#### Task 2.4: Implement Custom Hooks

**Priority**: High  
**Estimated Time**: 2 hours

**Steps**:

1. Create `hooks/useNotes.js`
2. Implement state management (notes, loading, error)
3. Implement `fetchNotes()` function
4. Implement `refreshNotes()` function
5. Use `useEffect` to fetch on mount
6. Create `hooks/useNoteForm.js` (optional)

**Acceptance Criteria**:

- ✅ `useNotes` hook works correctly
- ✅ Loading and error states handled
- ✅ Notes fetched on mount
- ✅ Refresh function works

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.5: Implement Utility Functions

**Priority**: Low  
**Estimated Time**: 30 minutes

**Steps**:

1. Create `utils/formatters.js`
2. Implement `formatDate()` function
3. Create `utils/constants.js` if needed

**Acceptance Criteria**:

- ✅ Date formatting works
- ✅ Functions are reusable

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.6: Implement Header Component

**Priority**: Medium  
**Estimated Time**: 30 minutes

**Steps**:

1. Create `components/Header.jsx`
2. Apply Tailwind styles (bg-gray-800, etc.)
3. Add app title
4. Make it responsive

**Acceptance Criteria**:

- ✅ Header renders correctly
- ✅ Styled with Tailwind
- ✅ Responsive design

**Related Documentation**: [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md), [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.7: Implement NoteCard Component

**Priority**: High  
**Estimated Time**: 1.5 hours

**Steps**:

1. Create `components/NoteCard.jsx`
2. Display note title, preview, timestamp
3. Add selected state styling
4. Add hover states
5. Add delete button/icon
6. Handle click to select note
7. Handle delete action

**Acceptance Criteria**:

- ✅ Note card displays correctly
- ✅ Selected state works
- ✅ Hover states work
- ✅ Delete button works
- ✅ Click to select works

**Related Documentation**: [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md), [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.8: Implement Sidebar Component

**Priority**: High  
**Estimated Time**: 1.5 hours

**Steps**:

1. Create `components/Sidebar.jsx`
2. Use `useNotes` hook to fetch notes
3. Display list of NoteCard components
4. Handle note selection
5. Show empty state when no notes
6. Show loading state
7. Show error state
8. Make it responsive (hidden on mobile)

**Acceptance Criteria**:

- ✅ Sidebar displays notes list
- ✅ Empty state shown when no notes
- ✅ Loading state shown
- ✅ Error state shown
- ✅ Responsive design works

**Related Documentation**: [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md), [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.9: Implement NoteForm Component

**Priority**: High  
**Estimated Time**: 2 hours

**Steps**:

1. Create `components/NoteForm.jsx`
2. Add title input field
3. Add content textarea
4. Add Save/Update button
5. Add Cancel button (when editing)
6. Handle form submission
7. Add validation (client-side)
8. Show error messages
9. Show loading state during save
10. Clear form after creating new note

**Acceptance Criteria**:

- ✅ Form displays correctly
- ✅ Validation works
- ✅ Save/Update works
- ✅ Error messages shown
- ✅ Loading state shown
- ✅ Form clears after create

**Related Documentation**: [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md), [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.10: Implement HomePage Component

**Priority**: High  
**Estimated Time**: 1.5 hours

**Steps**:

1. Create `pages/HomePage.jsx`
2. Manage selected note state
3. Manage "creating new note" state
4. Display NoteForm when editing/creating
5. Display empty state when no note selected
6. Handle note save callback
7. Handle note delete callback
8. Refresh notes list after operations

**Acceptance Criteria**:

- ✅ HomePage manages state correctly
- ✅ Form shown when editing/creating
- ✅ Empty state shown when no selection
- ✅ Notes refresh after operations

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)

---

#### Task 2.11: Implement Main App Component

**Priority**: High  
**Estimated Time**: 1 hour

**Steps**:

1. Update `App.jsx`
2. Setup main layout (Header, Sidebar, Main)
3. Manage selected note ID state
4. Pass props to child components
5. Apply Tailwind layout classes

**Acceptance Criteria**:

- ✅ Layout structure correct
- ✅ State management works
- ✅ Components connected properly
- ✅ Responsive design works

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md), [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)

---

#### Task 2.12: Frontend Unit Tests

**Priority**: High  
**Estimated Time**: 3 hours

**Steps**:

1. Setup Vitest and React Testing Library
2. Test NoteCard component
3. Test NoteForm component
4. Test Sidebar component
5. Test useNotes hook
6. Test API service (mocked)
7. Test error handling
8. Test loading states

**Acceptance Criteria**:

- ✅ Components have tests
- ✅ Hooks have tests
- ✅ API service has tests (mocked)
- ✅ Tests cover user interactions
- ✅ All tests pass

**Related Documentation**: [FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md), [RULES.md](./RULES.md)

---

### Phase 3: Integration & Polish

#### Task 3.1: End-to-End Testing

**Priority**: Medium  
**Estimated Time**: 2 hours

**Steps**:

1. Test complete user flows:
   - Create note → View → Edit → Delete
2. Test error scenarios
3. Test edge cases
4. Verify logging works
5. Verify timestamps update

**Acceptance Criteria**:

- ✅ All user flows work
- ✅ Error scenarios handled
- ✅ Edge cases handled
- ✅ Logging verified

---

#### Task 3.2: UI/UX Polish

**Priority**: Medium  
**Estimated Time**: 2 hours

**Steps**:

1. Review all UI components
2. Ensure consistent spacing
3. Ensure consistent colors
4. Add smooth transitions
5. Improve error messages
6. Improve loading states
7. Test responsive design
8. Test accessibility

**Acceptance Criteria**:

- ✅ UI is consistent
- ✅ Transitions are smooth
- ✅ Responsive design works
- ✅ Accessibility basics covered

**Related Documentation**: [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)

---

#### Task 3.3: Documentation Review

**Priority**: Low  
**Estimated Time**: 1 hour

**Steps**:

1. Review all documentation
2. Ensure code examples are accurate
3. Update any outdated information
4. Verify all links work

**Acceptance Criteria**:

- ✅ Documentation is accurate
- ✅ Code examples work
- ✅ All links functional

---

## 7. Acceptance Criteria Summary

### Functional Requirements

- ✅ Users can create notes with title and content
- ✅ Users can view all notes in a list
- ✅ Users can edit existing notes
- ✅ Users can delete notes
- ✅ Each note shows last modified timestamp
- ✅ UI is clean and responsive

### Non-Functional Requirements

- ✅ All actions are logged
- ✅ Each feature has unit tests
- ✅ No persistent storage (in-memory only)
- ✅ Code follows best practices
- ✅ Error handling is consistent

### Technical Requirements

- ✅ Backend uses Node.js + Express
- ✅ Frontend uses React + Tailwind
- ✅ In-memory database (Map)
- ✅ Logging service implemented
- ✅ Tests written and passing

---

## 8. Testing Requirements

### 8.1 Backend Testing

**Minimum Test Coverage**:

- ✅ `createNote()` - success and validation errors
- ✅ `getAllNotes()` - empty and with notes
- ✅ `updateNote()` - success, not found, validation errors
- ✅ `deleteNote()` - success and not found
- ✅ Logger service - add, getAll, clear, invalid actions

**Test Files**:

- `tests/notes-service.test.js`
- `tests/logger-service.test.js`

---

### 8.2 Frontend Testing

**Minimum Test Coverage**:

- ✅ NoteCard component - rendering, selection, delete
- ✅ NoteForm component - form submission, validation
- ✅ Sidebar component - list display, empty state
- ✅ useNotes hook - fetching, loading, error states
- ✅ API service - all CRUD operations (mocked)

**Test Files**:

- `src/components/__tests__/NoteCard.test.jsx`
- `src/components/__tests__/NoteForm.test.jsx`
- `src/hooks/__tests__/useNotes.test.js`
- `src/services/__tests__/notes-api.test.js`

---

## 9. Definition of Done

A task is considered "Done" when:

1. ✅ Code is implemented and working
2. ✅ Code follows naming conventions and best practices
3. ✅ Unit tests are written and passing
4. ✅ Error handling is in place
5. ✅ Code is reviewed (self-review at minimum)
6. ✅ Documentation is updated if needed
7. ✅ Feature works end-to-end
8. ✅ No console errors or warnings

---

## 10. Risk Assessment

### Low Risk

- **In-memory database**: Well understood, simple implementation
- **Basic CRUD operations**: Standard patterns
- **UI components**: Standard React patterns

### Medium Risk

- **State management**: Need to ensure proper state flow
- **Error handling**: Need to ensure all errors are caught
- **Testing**: Need to ensure adequate coverage

### Mitigation

- Follow established patterns from documentation
- Write tests early
- Review code frequently
- Test error scenarios thoroughly

---

## 11. Timeline Estimate

### Phase 1: Backend (8-10 hours)

- Setup: 1 hour
- Services & Routes: 4-5 hours
- Testing: 3-4 hours

### Phase 2: Frontend (10-12 hours)

- Setup: 1 hour
- Components: 6-7 hours
- Testing: 3-4 hours

### Phase 3: Integration (3-4 hours)

- End-to-end testing: 2 hours
- Polish: 1-2 hours

**Total Estimated Time**: 21-26 hours

---

## 12. Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[RULES.md](./RULES.md)**: Development best practices and coding standards
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System architecture and design decisions
- **[API.md](./API.md)**: Complete API endpoint documentation
- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)**: Frontend development guide
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**: Backend setup and structure guide
- **[LOGGING.md](./LOGGING.md)**: Logging standards and conventions
- **[IN-MEMORY-DB.md](./IN-MEMORY-DB.md)**: In-memory database explanation
- **[TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)**: UI styling guidelines

---

## 13. Change Log

| Version | Date       | Changes             | Author           |
| ------- | ---------- | ------------------- | ---------------- |
| 1.0     | 2025-11-24 | Initial PRD created | Development Team |

---

**Document Status**: ✅ Ready for Implementation
