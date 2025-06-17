import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';  // Adjust path if needed
import Tool from './pages/Tool';    // Adjust path if needed

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">About</Link>
        <Link to="/tool">Tool</Link>
      </nav>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/tool" element={<Tool />} />
      </Routes>
    </Router>
  );
}
