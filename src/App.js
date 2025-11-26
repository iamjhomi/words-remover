import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';

function App() {
  // Use PUBLIC_URL as basename so the app works when hosted under a subpath
  // (for example GitHub Pages `homepage`), and fall back to root when absent.
  const basename = process.env.PUBLIC_URL || '/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:toolId" element={<ToolPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
