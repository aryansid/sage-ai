import React from 'react'
import { Button } from '../@/components/ui/button'
import { Link } from 'react-router-dom'  // Import Link from react-router-dom

export default function NavBar({ currentPage = 'Home' }) {
  const navItems = ['Home', 'Search', 'Pricing', 'Contact Us']

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute left-4 sm:left-6 lg:left-8">
          <a href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 w-auto rounded-lg shadow-md transition-transform hover:scale-105"
            />
          </a>
        </div>
        <div className="flex-1 flex justify-center items-center space-x-4">
          {navItems.map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase().replace(' ', '-')}`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === item
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 text-sm font-medium"
          >
            Refer
          </Button>
          <Link to="/signup" className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-teal-600 transition-colors">
            A
          </Link>
        </div>
      </div>
    </nav>
  )
}