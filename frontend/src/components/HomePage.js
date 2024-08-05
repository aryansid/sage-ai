// frontend/src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ValidationBanner from './ValidationBanner';

const HomePage = () => {
  const navigate = useNavigate();

  const handleBeginSearch = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-white text-center flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Prior Art Search <span className="text-green-600">Sucks</span>.
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-8">
          We Make It Faster And Smarter.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Type in your natural language patent query and watch as our AI driven solution 
          <br />
          uncovers prior art at lightning speed and unparalleled accuracy.
        </p>
        <button
          onClick={handleBeginSearch}
          className="px-6 py-3 bg-gray-900 text-white text-lg rounded-md hover:bg-gray-700 mb-4"
        >
          Begin Search
        </button>
      </div>
      <ValidationBanner />
    </div>
  );
};

export default HomePage;