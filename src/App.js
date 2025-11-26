import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:toolId" element={<ToolPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
