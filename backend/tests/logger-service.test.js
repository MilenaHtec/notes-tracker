/**
 * Unit tests for Logger Service
 */
import { describe, it, expect, beforeEach } from "@jest/globals";
import { loggerService, LogAction } from "../services/logger-service.js";

describe("Logger Service", () => {
  beforeEach(() => {
    loggerService.clear();
  });

  describe("add", () => {
    it("should create a log entry with required fields", () => {
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
      expect(logs[0].details.noteId).toBe("123");
    });

    it("should generate unique IDs for each log entry", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      // Small delay to ensure different timestamp-based IDs
      return new Promise((resolve) => {
        setTimeout(() => {
          loggerService.add({ action: LogAction.NOTE_UPDATED });

          const logs = loggerService.getAll();
          expect(logs).toHaveLength(2);
          expect(logs[0].id).not.toBe(logs[1].id);
          resolve();
        }, 10);
      });
    });

    it("should generate ISO 8601 timestamps", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });

      const logs = loggerService.getAll();
      const timestamp = logs[0].timestamp;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it("should ignore invalid actions", () => {
      loggerService.add({ action: "INVALID_ACTION" });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(0);
    });

    it("should ignore null entries", () => {
      loggerService.add(null);

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(0);
    });

    it("should ignore entries without action", () => {
      loggerService.add({ details: { test: true } });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(0);
    });

    it("should not throw on errors", () => {
      expect(() => {
        loggerService.add(null);
        loggerService.add(undefined);
        loggerService.add({});
      }).not.toThrow();
    });

    it("should handle entries without details", () => {
      loggerService.add({ action: LogAction.NOTES_LIST_VIEWED });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(1);
      expect(logs[0].details).toBeUndefined();
    });
  });

  describe("getAll", () => {
    it("should return all log entries", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      loggerService.add({ action: LogAction.NOTE_UPDATED });

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(2);
    });

    it("should return empty array when no logs exist", () => {
      const logs = loggerService.getAll();
      expect(logs).toEqual([]);
    });

    it("should return a copy to prevent external mutation", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      const logs1 = loggerService.getAll();
      const logs2 = loggerService.getAll();

      expect(logs1).not.toBe(logs2); // Different array instances
      logs1.push({ test: "mutated" });
      expect(loggerService.getAll().length).toBe(1); // Original unchanged
    });
  });

  describe("clear", () => {
    it("should remove all log entries", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      loggerService.add({ action: LogAction.NOTE_UPDATED });

      loggerService.clear();

      const logs = loggerService.getAll();
      expect(logs).toHaveLength(0);
    });
  });

  describe("getByAction", () => {
    it("should filter logs by action", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });
      loggerService.add({ action: LogAction.NOTE_UPDATED });
      loggerService.add({ action: LogAction.NOTE_CREATED });

      const createLogs = loggerService.getByAction(LogAction.NOTE_CREATED);
      expect(createLogs).toHaveLength(2);
      expect(createLogs.every((log) => log.action === LogAction.NOTE_CREATED)).toBe(true);
    });

    it("should return empty array when no logs match action", () => {
      loggerService.add({ action: LogAction.NOTE_CREATED });

      const updateLogs = loggerService.getByAction(LogAction.NOTE_UPDATED);
      expect(updateLogs).toHaveLength(0);
    });
  });
});

