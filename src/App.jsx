import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';  // Adjust path if needed
import Tool from './pages/Tool';    // Adjust path if needed
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto"></div>
      <Routes>
        <Route path="/" element={<Tool />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  );
}
