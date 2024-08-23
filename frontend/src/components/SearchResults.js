import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <div className="min-h-screen bg-white text-center flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mt-8 grid grid-cols-1 gap-6">
        {results.map((result, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-lg">{result.title}</h3>
            <p className="text-gray-600 text-base mt-2">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
