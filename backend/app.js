/**
 * Express application entry point
 * Sets up middleware, routes, and error handling
 */
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler (must be before error middleware)
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

