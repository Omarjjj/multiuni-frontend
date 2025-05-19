import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
// Import index.css to ensure its styles are loaded globally,
// especially the body styles and background animations.
import './index.css';
import ChatPage from './pages/ChatPage';
import UniversitySelectionPage from './pages/UniversitySelectionPage';

function App() {
  return (
    // Add the animated background wrapper around the routes
    <div className="app-container">
      {/* These elements provide the animated background defined in index.css */}
      {/* <div className="animated-background"></div> */}
      {/* <div className="noise-overlay"></div> */}

      {/* Root element for content, ensuring it's above the background */}
      <div id="root">
        <Routes>
          <Route path="/" element={<UniversitySelectionPage />} />
          <Route path="/chat/:universityId" element={<ChatPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
