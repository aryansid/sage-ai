import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ transparent = false }) => {
  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white'} w-full`}>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8"> {/* Adjusted max-width and padding */}
        <div className="flex justify-between h-24">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-light tracking-tight text-black">sage</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/signin" className="p-2 rounded-full text-gray-400 hover:text-gray-500">
              <span className="sr-only">Sign in</span>
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
