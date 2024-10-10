import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchResultCard from './SearchResultCard';
import NavBar from './NavBar';

const SearchResultPage = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <div className="min-h-screen bg-white relative">
      <NavBar transparent={true} />
      <div className="absolute inset-x-0 bottom-0 h-[87%] bg-custom-bg-gray rounded-t-[40px] overflow-hidden shadow-[0_-8px_12px_-3px_rgba(0,0,0,0.07)] border-t border-l border-r ">
        <div className="absolute inset-0 shadow-[0_-15px_15px_-15px_rgba(0,0,0,0.3)]"></div>
        <div className="relative h-full overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-[1500px] mx-auto pt-8 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {results.map((result, index) => (
                <SearchResultCard key={index} patent={result} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;