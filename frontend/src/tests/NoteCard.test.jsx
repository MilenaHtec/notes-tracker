/**
 * Unit tests for NoteCard component
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NoteCard from "../components/NoteCard.jsx";

describe("NoteCard", () => {
  const mockNote = {
    id: "123",
    title: "Test Note",
    content: "This is test content",
    lastModified: "2025-11-24T10:00:00.000Z",
  };

  it("should render note title and content", () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<NoteCard note={mockNote} onClick={handleClick} />);
    screen.getByText("Test Note").closest("div").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should apply selected styling when isSelected is true", () => {
    const { container } = render(
      <NoteCard note={mockNote} isSelected={true} />
    );
    const card = container.firstChild;
    expect(card.className).toContain("bg-indigo-500");
  });

  it("should apply default styling when isSelected is false", () => {
    const { container } = render(
      <NoteCard note={mockNote} isSelected={false} />
    );
    const card = container.firstChild;
    expect(card.className).toContain("bg-gray-700");
  });

  it("should call onDelete when delete button is clicked", () => {
    const handleDelete = vi.fn();
    render(<NoteCard note={mockNote} onDelete={handleDelete} />);
    const deleteButton = screen.getByLabelText("Delete note");
    deleteButton.click();
    expect(handleDelete).toHaveBeenCalledWith(mockNote.id);
  });

  it("should not show delete button when onDelete is not provided", () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.queryByLabelText("Delete note")).not.toBeInTheDocument();
  });
});

