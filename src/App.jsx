import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Tool from './pages/Tool';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Tool />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}
