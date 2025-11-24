/**
 * Unit tests for NoteForm component
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteForm from "../components/NoteForm.jsx";
import * as notesApi from "../services/notes-api.js";

// Mock the API service
vi.mock("../services/notes-api.js");

describe("NoteForm", () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form with empty fields when no note provided", () => {
    render(<NoteForm onSave={mockOnSave} />);
    expect(screen.getByPlaceholderText("Note title...")).toHaveValue("");
    expect(screen.getByPlaceholderText("Note content...")).toHaveValue("");
  });

  it("should render form with note data when note provided", () => {
    const mockNote = {
      id: "123",
      title: "Test Note",
      content: "Test Content",
    };
    render(<NoteForm note={mockNote} onSave={mockOnSave} />);
    expect(screen.getByPlaceholderText("Note title...")).toHaveValue(
      "Test Note"
    );
    expect(screen.getByPlaceholderText("Note content...")).toHaveValue(
      "Test Content"
    );
  });

  it("should call createNote when creating new note", async () => {
    const user = userEvent.setup();
    const mockNote = { id: "123", title: "New Note", content: "New Content" };
    vi.mocked(notesApi.createNote).mockResolvedValue(mockNote);

    render(<NoteForm onSave={mockOnSave} />);

    await user.type(screen.getByPlaceholderText("Note title..."), "New Note");
    await user.type(
      screen.getByPlaceholderText("Note content..."),
      "New Content"
    );
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(notesApi.createNote).toHaveBeenCalledWith({
        title: "New Note",
        content: "New Content",
      });
      expect(mockOnSave).toHaveBeenCalledWith(mockNote);
    });
  });

  it("should call updateNote when editing existing note", async () => {
    const user = userEvent.setup();
    const mockNote = {
      id: "123",
      title: "Original",
      content: "Original Content",
    };
    const updatedNote = {
      id: "123",
      title: "Updated",
      content: "Updated Content",
    };
    vi.mocked(notesApi.updateNote).mockResolvedValue(updatedNote);

    render(<NoteForm note={mockNote} onSave={mockOnSave} />);

    const titleInput = screen.getByPlaceholderText("Note title...");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated");

    const contentInput = screen.getByPlaceholderText("Note content...");
    await user.clear(contentInput);
    await user.type(contentInput, "Updated Content");

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(notesApi.updateNote).toHaveBeenCalledWith("123", {
        title: "Updated",
        content: "Updated Content",
      });
      expect(mockOnSave).toHaveBeenCalledWith(updatedNote);
    });
  });

  it("should show error message when title is empty", async () => {
    const user = userEvent.setup();
    const { container } = render(<NoteForm onSave={mockOnSave} />);

    await user.type(screen.getByPlaceholderText("Note content..."), "Content");
    
    // Get form and submit directly to bypass HTML5 validation
    const form = container.querySelector("form");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(
      () => {
        expect(screen.getByText("Title is required")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(notesApi.createNote).not.toHaveBeenCalled();
  });

  it("should show error message when content is empty", async () => {
    const user = userEvent.setup();
    const { container } = render(<NoteForm onSave={mockOnSave} />);

    await user.type(screen.getByPlaceholderText("Note title..."), "Title");
    // Clear content field
    const contentField = screen.getByPlaceholderText("Note content...");
    await user.clear(contentField);
    
    // Get form and submit directly to bypass HTML5 validation
    const form = container.querySelector("form");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    await waitFor(
      () => {
        expect(screen.getByText("Content is required")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(notesApi.createNote).not.toHaveBeenCalled();
  });

  it("should show error message when API call fails", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Failed to create note");
    vi.mocked(notesApi.createNote).mockRejectedValue(mockError);

    render(<NoteForm onSave={mockOnSave} />);

    await user.type(screen.getByPlaceholderText("Note title..."), "Title");
    await user.type(screen.getByPlaceholderText("Note content..."), "Content");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Failed to create note")).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<NoteForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    await user.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should disable form fields when saving", async () => {
    const user = userEvent.setup();
    const mockNote = { id: "123", title: "New Note", content: "New Content" };
    let resolveCreate;
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    vi.mocked(notesApi.createNote).mockReturnValue(createPromise);

    render(<NoteForm onSave={mockOnSave} />);

    await user.type(screen.getByPlaceholderText("Note title..."), "Title");
    await user.type(screen.getByPlaceholderText("Note content..."), "Content");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Note title...")).toBeDisabled();
    expect(screen.getByPlaceholderText("Note content...")).toBeDisabled();

    resolveCreate(mockNote);
  });
});
