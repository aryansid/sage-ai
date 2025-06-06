import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RetroGrid from "./@/components/magicui/retro-grid";
import SearchBar from "./components/SearchBar";
import NavBar from "./components/NavBar";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results: any[]) => {
    setSearchResults(results);
    // Navigate to results page with the search results
    navigate('/results', { state: { results } });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <RetroGrid className="fixed inset-0" />
      
      <NavBar currentPage="Search" />
      
      <main className="flex-grow flex flex-col items-center justify-start pt-16">
        <div className="z-10 text-center w-full px-4 max-w-4xl mx-auto -mt-4">
          <h1 className="text-6xl font-semibold mb-5 leading-tight text-black">
            Search Prior Art<br />Today With Our AI Tool
          </h1>
          <p className="text-xl mb-9 text-gray-600 max-w-3xl mx-auto">
            Our AI will scan millions of documents to help you find conflicting prior art<br />
            Save time, reduce risks, and get your patent to market faster.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </main>
    </div>
  );
}