/**
 * useNotes Hook
 * 
 * Custom hook for managing notes state and fetching notes from the backend.
 * Handles loading states, error states, and provides refresh functionality.
 */

import { useState, useEffect } from "react";
import { getAllNotes } from "../services/notes-api.js";

/**
 * Custom hook for managing notes
 * 
 * @returns {Object} Object containing notes, isLoading, error, and refreshNotes function
 */
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches notes from the backend
   */
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  /**
   * Refresh notes manually
   * Can be called after create/update/delete operations
   */
  const refreshNotes = () => {
    fetchNotes();
  };

  return {
    notes,
    isLoading,
    error,
    refreshNotes,
  };
}

