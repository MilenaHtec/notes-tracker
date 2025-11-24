## 1. Project Structure

- Keep frontend and backend separated into different root folders.
- Follow a clean modular structure (e.g., `routes/`, `services/`, `db/`, `utils/`).
- Use consistent naming:
  - `kebab-case` for files
  - `PascalCase` for components
  - `camelCase` for functions
- Avoid placing unrelated logic in the same folder.

## 2. Code Quality

- Keep functions short, pure, and predictable.
- Reuse logic through helpers and shared utilities.
- Prefer TypeScript when possible.
- Use JSDoc or inline comments only where logic is non-obvious.
- Avoid over-engineering in small projects.

## 3. API Design Rules

- Each API route should handle one clear responsibility.
- Validate incoming data (e.g., title and content cannot be empty).
- Return structured JSON error messages.
- Use proper HTTP status codes:
  - `200 OK` – Successful read/update
  - `201 Created` – New resource created
  - `400 Bad Request` – Invalid input
  - `404 Not Found` – Missing resource
  - `500 Internal Server Error` – Unexpected issue

## 4. In-Memory Database Rules

- Export one shared instance of the in-memory DB.
- Do not manipulate the DB directly in routes—always go through a service layer.
- Data resets only when the backend restarts (intended behavior).
- Use `Map` instead of arrays when IDs are involved.

## 5. Tailwind CSS Best Practices

- Use utility-first styling; avoid external CSS files unless needed.
- Keep JSX clean by extracting large groups of classes into `className` helpers or small components.
- Prefer semantic HTML with Tailwind classes.
- Use responsive utilities (`md:`, `lg:`, etc.) from day one.
- Avoid mixing custom CSS with Tailwind unless necessary.
- Use Tailwind config for:
  - custom colors
  - spacing scales
  - reusable design tokens
- Keep UI consistent by using shared UI patterns across components.

## 6. Logging Rules

- Log every CRUD action.
- Logs should include:
  - action type
  - payload or resource ID
  - timestamp
- Logs must be short but meaningful.
- Keep logging within the backend (not the frontend).

## 7. Unit Testing Rules

- Each public function should have at least one test.
- Focus on behavior, not implementation details.
- Mock external dependencies (DB, loggers).
- Use descriptive test names like:
  - `"should create a note successfully"`
- Keep tests fast and isolated.

## 8. Git Workflow Rules

- Use feature branches (`feature/notes-crud`, `fix/logging-issue`).
- Commit frequently but meaningfully.
- Write clear commit messages:
  - `feat: add note creation route`
  - `fix: correct content validation`
  - `refactor: simplify validation logic`
  - `docs: update API documentation`

## 9. Documentation Rules

- Every major folder should include a small `README.md` describing its purpose.
- API documentation must include:
  - endpoints
  - request examples
  - response examples
- Keep documentation short, accurate, and updated.

## 10. Environment Variables

- Store all configuration in environment variables (`.env` files).
- Never commit `.env` files to git (add to `.gitignore`).
- Provide `.env.example` with required variables and dummy values.
- Use different `.env` files for development, testing, and production.
- Access environment variables through a config module, not directly.

## 11. Error Handling

- Create a centralized error handler middleware.
- Always catch errors in async routes (use try-catch or error middleware).
- Return consistent error response format:
  ```json
  {
    "error": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
  ```
- Log errors before sending response to client.
- Never expose internal error details in production.

## 12. Code Formatting & Linting

- Use ESLint for code quality checks.
- Use Prettier for consistent code formatting.
- Configure both tools to work together.
- Run linting before commits (consider pre-commit hooks).
- Keep configuration files at project root (`.eslintrc`, `.prettierrc`).

## 13. Dependencies Management

- Keep dependencies up to date, but test before upgrading.
- Use exact versions (`1.2.3`) for critical dependencies in production.
- Use caret ranges (`^1.2.3`) for minor updates in development.
- Regularly audit dependencies for security vulnerabilities.
- Document why each major dependency is needed.
- Avoid adding dependencies for simple tasks that can be done with native code.

---

## Related Documentation

- **[README.md](./README.md)**: Project overview and setup instructions
- **[PRD.md](./PRD.md)**: Product Requirements Document with detailed tasks
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System architecture and design decisions
- **[API.md](./API.md)**: API endpoint documentation
- **[FRONTEND-GUIDE.md](./FRONTEND-GUIDE.md)**: Frontend development guide
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**: Backend setup and structure guide
- **[LOGGING.md](./LOGGING.md)**: Logging standards and conventions
- **[IN-MEMORY-DB.md](./IN-MEMORY-DB.md)**: In-memory database explanation
- **[TAILWIND-STYLE-GUIDE.md](./TAILWIND-STYLE-GUIDE.md)**: UI styling guidelines
