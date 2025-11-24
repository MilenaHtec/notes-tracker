# Personal Notes Management Tool

This README provides setup instructions, project structure, and guidelines for running the **Personal Notes Management Tool**.

---

## 1. Project Overview

A simple full-stack application that helps users manage their personal notes. Users can:

- **Create notes** (title + content)
- **View all saved notes**
- **Edit existing notes**
- **Delete unwanted notes**

### Features

- **Last modified timestamp** for each note
- **Action logging** - All user actions (create, update, delete, view) are logged
- **Fully testable** with unit tests for both frontend and backend
- **In-memory database** - No persistent storage (data resets on server restart)
- **Elegant dark theme** UI with Tailwind CSS

### Technology Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: In-memory Map (no external database)
- **Testing**: Jest (backend), Vitest + React Testing Library (frontend)
- **Logging**: Custom in-memory logger service

---

## 2. Repository Structure

```
notes-tracker/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components (PascalCase)
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks (camelCase)
│   │   ├── services/      # API communication layer
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # Tailwind utilities (if needed)
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/               # Node.js/Express backend
│   ├── app.js             # Express entry point
│   ├── routes/            # API routes (kebab-case)
│   │   └── notes.js
│   ├── services/          # Business logic layer
│   │   ├── notes-service.js
│   │   └── logger-service.js
│   ├── db/                # In-memory database
│   │   └── notes-db.js
│   ├── utils/             # Helper functions
│   │   ├── validation.js
│   │   └── error-handler.js
│   ├── middleware/        # Express middleware
│   │   └── error-middleware.js
│   ├── config/            # Configuration
│   │   └── config.js
│   ├── tests/             # Unit tests
│   ├── package.json
│   └── .env.example
│
└── Documentation          # Project documentation (Markdown files)
    ├── README.md          # This file
    ├── RULES.md          # Development best practices
    ├── ARCHITECTURE.md   # System architecture overview
    ├── API.md            # API endpoint documentation
    ├── FRONTEND-GUIDE.md # Frontend development guide
    ├── BACKEND-SETUP.md  # Backend setup and structure
    ├── LOGGING.md        # Logging standards
    ├── IN-MEMORY-DB.md   # In-memory database explanation
    └── TAILWIND-STYLE-GUIDE.md # UI styling guidelines
```

---

## 3. Quick Start

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### Backend Setup

1. **Navigate to backend folder**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):

   ```env
   PORT=3001
   NODE_ENV=development
   ```

4. **Run server in development mode**:

   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:3001`

   **Note**: The server uses `nodemon` for auto-reload during development.

### Frontend Setup

1. **Navigate to frontend folder**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create `.env` file** (optional, for custom API URL):

   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

4. **Run frontend**:

   ```bash
   npm run dev
   ```

   Frontend runs at `http://localhost:5173` (or assigned port by Vite)

### Access the Application

1. Start the backend server (port 3001)
2. Start the frontend dev server (port 5173)
3. Open `http://localhost:5173` in your browser

---

## 4. Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=development
```

### Frontend Environment Variables

Create `frontend/.env` (optional):

```env
VITE_API_BASE_URL=http://localhost:3001
```

**Note**: Vite requires `VITE_` prefix for environment variables to be exposed to the client.

---

## 5. Running Tests

### Backend Tests

Run backend unit tests:

```bash
cd backend
npm test
```

**Test Coverage**:

- Notes service (create, read, update, delete)
- Logger service
- Validation utilities
- Error handling

### Frontend Tests

Run frontend component tests:

```bash
cd frontend
npm test
```

**Test Coverage**:

- Component rendering
- User interactions
- API integration (mocked)
- Error handling
- Loading states

---

## 6. Development Workflow

### Backend Development

```bash
cd backend
npm run dev    # Development mode with auto-reload
npm start      # Production mode
npm test       # Run tests
```

### Frontend Development

```bash
cd frontend
npm run dev    # Development server
npm run build  # Build for production
npm run preview # Preview production build
npm test       # Run tests
```

---

## 7. API Endpoints

The backend provides the following REST API endpoints:

| Method   | Endpoint     | Description       |
| -------- | ------------ | ----------------- |
| `GET`    | `/notes`     | Get all notes     |
| `POST`   | `/notes`     | Create a new note |
| `PUT`    | `/notes/:id` | Update a note     |
| `DELETE` | `/notes/:id` | Delete a note     |
| `GET`    | `/health`    | Health check      |

**Base URL**: `http://localhost:3001`

**See [API.md](./API.md)** for detailed API documentation including request/response formats, error handling, and examples.

---

## 8. Logging & Debugging

### Logging System

- **All user actions are logged** in memory (create, update, delete, view)
- **Logs are accessible** via `loggerService` in backend
- **Log structure** includes:
  - Action type (e.g., `NOTE_CREATED`, `NOTE_UPDATED`)
  - Note ID or payload
  - Timestamp (ISO 8601 format)
  - Optional metadata

### Logging Behavior

- Logs are **stored in memory** (no persistent files)
- Logs **reset when server restarts**
- Logs are **only generated for successful operations**
- Failed operations (validation errors, not found, etc.) are logged as errors but do not generate action logs

**See [LOGGING.md](./LOGGING.md)** for detailed logging standards and conventions.

---

## 9. In-Memory Database

### Database Characteristics

- **Storage**: All notes stored in RAM using JavaScript `Map`
- **Persistence**: Data resets when server restarts (intended behavior)
- **Performance**: O(1) lookup and deletion by ID
- **Use Case**: Perfect for development, testing, and learning

### Why In-Memory?

- **No setup required** - No database installation or configuration
- **Fast operations** - All operations happen in RAM
- **Easy testing** - Database can be reset between tests
- **Simple architecture** - Focus on application logic, not database management

**See [IN-MEMORY-DB.md](./IN-MEMORY-DB.md)** for detailed explanation of the in-memory database implementation.

---

## 10. UI Styling (Tailwind CSS)

### Design Theme

The application uses a **dark theme** with:

- **Background**: Dark gray (`bg-gray-900`)
- **Header**: Gray (`bg-gray-800`)
- **Sidebar**: Custom gray (`bg-gray-850`)
- **Cards**: Medium gray (`bg-gray-700`)
- **Accent**: Indigo (`bg-indigo-500`) for selected items and focus states

### Layout Structure

```
┌─────────────────────────────┐
│         Header              │
└─────────────────────────────┘
┌──────────┬──────────────────┐
│ Sidebar  │  Main Content    │
│ (Notes)  │  (Editor)        │
└──────────┴──────────────────┘
```

**See [TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)** for complete UI styling guidelines, component patterns, and best practices.

---

## 11. Project Architecture

### High-Level Architecture

```
Frontend (React)  ←→  Backend (Express)  ←→  In-Memory DB (Map)
     ↓                      ↓                        ↓
  Components          Routes/Services          Data Storage
  State Management    Business Logic           Logging
```

### Key Principles

- **Separation of Concerns**: Frontend handles UI, backend handles business logic
- **Service Layer Pattern**: Routes delegate to services, services interact with database
- **No Direct DB Access**: Routes never access the database directly
- **Centralized Error Handling**: Consistent error responses across all endpoints
- **Backend as Source of Truth**: Frontend always fetches from API, no local caching

**See [ARCHITECTURE.md](./ARCHITECTURE.md)** for detailed system architecture, data flow, and design decisions.

---

## 12. Development Best Practices

### Code Quality

- **Keep functions short, pure, and predictable**
- **Reuse logic** through helpers and shared utilities
- **Use consistent naming**:
  - Files: `kebab-case`
  - Components: `PascalCase`
  - Functions: `camelCase`
- **Avoid over-engineering** in small projects

### API Design

- **Each route handles one clear responsibility**
- **Validate incoming data** (title and content cannot be empty)
- **Return structured JSON error messages**
- **Use proper HTTP status codes** (200, 201, 400, 404, 500)

### Testing

- **Each public function should have at least one test**
- **Focus on behavior, not implementation details**
- **Mock external dependencies** (DB, loggers)
- **Keep tests fast and isolated**

**See [RULES.md](./RULES.md)** for complete development best practices and coding standards.

---

## 13. Troubleshooting

### Common Issues

#### Backend Issues

1. **"Cannot use import statement outside a module"**

   - **Solution**: Ensure `"type": "module"` is in `backend/package.json`

2. **Port already in use**

   - **Solution**: Change `PORT` in `backend/.env` or kill the process using port 3001

3. **CORS errors from frontend**
   - **Solution**: Ensure `cors()` middleware is enabled in `backend/app.js`

#### Frontend Issues

1. **API connection errors**

   - **Solution**: Check that backend is running on port 3001
   - **Solution**: Verify `VITE_API_BASE_URL` in `frontend/.env`

2. **Tailwind classes not working**

   - **Solution**: Check `tailwind.config.js` content paths
   - **Solution**: Restart dev server after config changes

3. **Module not found errors**
   - **Solution**: Run `npm install` in the frontend directory
   - **Solution**: Check import paths (use relative paths with `.js` extension)

---

## 14. Documentation

This project includes comprehensive documentation:

### Product Documentation

- **[PRD.md](./PRD.md)** - Product Requirements Document with detailed implementation tasks

### Core Documentation

- **[PRD.md](./PRD.md)** - Product Requirements Document with detailed tasks
- **[RULES.md](./RULES.md)** - Development best practices and coding standards
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions
- **[API.md](./API.md)** - Complete API endpoint documentation

### Setup Guides

- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)** - Frontend development guide (React + Tailwind)
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)** - Backend setup and structure guide

### Technical Documentation

- **[LOGGING.md](./LOGGING.md)** - Logging standards and conventions
- **[IN-MEMORY-DB.md](./IN-MEMORY-DB.md)** - In-memory database explanation
- **[TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)** - UI styling guidelines

---

## 15. Contributing

### Development Workflow

1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Follow the coding standards in [RULES.md](./RULES.md)
3. **Write tests**: Ensure all new features have tests
4. **Test locally**: Run both frontend and backend tests
5. **Commit changes**: Use clear commit messages (see [RULES.md](./RULES.md) for format)
6. **Push and create PR**: Push to your branch and create a pull request

### Commit Message Format

- `feat: add note creation route`
- `fix: correct content validation`
- `refactor: simplify validation logic`
- `docs: update API documentation`

---

## 16. License

This project is for educational purposes.

---

## 17. Support

For questions or issues:

1. Check the relevant documentation file
2. Review [Troubleshooting](#13-troubleshooting) section
3. Check existing issues in the repository

---

**Happy coding! 🚀**
