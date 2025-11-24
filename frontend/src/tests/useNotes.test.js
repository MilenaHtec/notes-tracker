/**
 * Unit tests for useNotes hook
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useNotes } from "../hooks/useNotes.js";
import * as notesApi from "../services/notes-api.js";

// Mock the API service
vi.mock("../services/notes-api.js");

describe("useNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch notes on mount", async () => {
    const mockNotes = [
      { id: "1", title: "Note 1", content: "Content 1" },
      { id: "2", title: "Note 2", content: "Content 2" },
    ];

    vi.mocked(notesApi.getAllNotes).mockResolvedValue(mockNotes);

    const { result } = renderHook(() => useNotes());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.notes).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notes).toEqual(mockNotes);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors when fetching notes fails", async () => {
    const mockError = new Error("Failed to fetch notes");
    vi.mocked(notesApi.getAllNotes).mockRejectedValue(mockError);

    const { result } = renderHook(() => useNotes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notes).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch notes");
  });

  it("should refresh notes when refreshNotes is called", async () => {
    const mockNotes = [{ id: "1", title: "Note 1", content: "Content 1" }];
    vi.mocked(notesApi.getAllNotes).mockResolvedValue(mockNotes);

    const { result } = renderHook(() => useNotes());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update mock to return different notes
    const updatedNotes = [
      ...mockNotes,
      { id: "2", title: "Note 2", content: "Content 2" },
    ];
    vi.mocked(notesApi.getAllNotes).mockResolvedValue(updatedNotes);

    // Call refreshNotes
    result.current.refreshNotes();

    await waitFor(() => {
      expect(result.current.notes).toEqual(updatedNotes);
    });
  });
});

