/**
 * Main App Component
 * Root component that sets up the layout structure
 */
import { useState, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const sidebarRefreshRef = useRef(null);

  const handleNoteSaved = (note) => {
    // After saving, refresh sidebar to show the new note
    if (sidebarRefreshRef.current) {
      sidebarRefreshRef.current();
    }
    // Don't auto-select the note - return to empty state so user can create more notes
    // User can click on the note in sidebar if they want to edit it
    setSelectedNoteId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <Sidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onRefreshReady={(refreshFn) => {
            sidebarRefreshRef.current = refreshFn;
          }}
        />
        <main
          className="flex-1 bg-gray-900 p-4 md:p-6 overflow-y-auto transition-all duration-200"
          role="main"
        >
          <HomePage
            selectedNoteId={selectedNoteId}
            onNoteSaved={handleNoteSaved}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
