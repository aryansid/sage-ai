import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-black rounded-full px-4 py-2 flex items-center justify-between text-sm text-white border border-gray-800">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-semibold">Linear</Link>
          <Link to="/features">Features</Link>
          <Link to="/method">Method</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/changelog">Changelog</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/company">Company</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/docs">Docs</Link>
        </div>
        <div>
          <button className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">Open app</button>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
