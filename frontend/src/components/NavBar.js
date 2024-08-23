import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <NavLink to="/">
            {/* <span className="italic font-serif">Sage AI</span> */}
          </NavLink>
        </div>
        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-green-500 underline'
                : 'text-gray-300 hover:text-white'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? 'text-green-500 underline'
                : 'text-gray-300 hover:text-white'
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive
                ? 'text-green-500 underline'
                : 'text-gray-300 hover:text-white'
            }
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'text-green-500 underline'
                : 'text-gray-300 hover:text-white'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? 'text-green-500 underline'
                : 'text-gray-300 hover:text-white'
            }
          >
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;