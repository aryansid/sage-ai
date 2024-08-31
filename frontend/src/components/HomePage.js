// frontend/src/components/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidationBanner from './ValidationBanner';
import NavBar from './NavBar';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const sucksRef = useRef(null);

  useEffect(() => {
    const colors = ['#004aad', '#FFD700', '#00874d', '#FF0000']; // New order: blue, yellow, green, red
    let currentIndex = 0;

    const changeColor = () => {
      if (sucksRef.current) {
        sucksRef.current.style.color = colors[currentIndex];
        currentIndex = (currentIndex + 1) % colors.length;
      }
    };

    const intervalId = setInterval(changeColor, 500); // Change color every 1 second

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = () => {
    // You can add any search logic here if needed
    navigate('/search-results');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* <NavBar /> */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 text-center">
          Prior Art Search <span ref={sucksRef} className="transition-colors duration-300">Sucks</span>.
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-8 text-center">
          We Make It Faster And Smarter.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl">
          Type in your natural language patent query and watch as our AI driven solution
          uncovers prior art at lightning speed and unparalleled accuracy.
        </p>
        <form onSubmit={handleSearch} className="w-full max-w-xl mb-12">
          <div className="flex">
            <input
              type="text"
              placeholder="Enter description of invention"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow py-3 px-4 bg-white border border-gray-300 rounded-l-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-custom-blue text-white font-semibold rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <ValidationBanner />
    </div>
  );
};

export default HomePage;