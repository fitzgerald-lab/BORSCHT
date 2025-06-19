import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-indigo-500 text-white py-4 px-4 z-50">
      <div className="max-w-7xl mx-auto flex gap-4">
        <Link to="/About" className="hover:underline">
          About
        </Link>
        <Link to="/" className="hover:underline">
          Calculator
        </Link>
      </div>
    </nav>
  );
}
