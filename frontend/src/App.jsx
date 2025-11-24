/**
 * Main App Component
 * Root component that sets up the layout structure
 */
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
        />
        <main className="flex-1 bg-gray-900 p-6 overflow-y-auto">
          <HomePage selectedNoteId={selectedNoteId} />
        </main>
      </div>
    </div>
  );
}

export default App;
