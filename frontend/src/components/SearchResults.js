import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar'; // Import the NavBar component
import SearchResult from './SearchResult'; // Import the SearchResult component

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  return (
    <>
      <NavBar /> {/* Include the NavBar component */}
      <div className="min-h-screen bg-white text-left flex flex-col items-start px-4"> {/* Added px-4 for padding */}
        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 gap-6">
          {results.map((result, index) => (
            <SearchResult key={index} result={result} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;