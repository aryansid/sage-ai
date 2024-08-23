import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; // Import the NavBar component
import ExampleCard from './ExampleCard'; // Import the MiniCard component

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [publishedAfter, setPublishedAfter] = useState('');
  const [publishedBefore, setPublishedBefore] = useState('');
  const [documentType, setDocumentType] = useState('Patents');
  const [searchType, setSearchType] = useState('Novelty');
  const navigate = useNavigate(); // Corrected variable name

  const handleSearch = () => {
    console.log('Searching for:', query, publishedAfter, publishedBefore, documentType, searchType);
    // Add your search logic here and update the results state
    const searchResults = [
      {
        title: 'System and Method for Adaptive Content Delivery Based on User Behavior',
        description: 'Introduces a sophisticated system designed to optimize content delivery by adapting to user behavior in real-time. Our technology employs machine learning algorithms to analyze user interactions, such as browsing patterns and engagement metrics.'
      },
      {
        title: 'Another Innovative System',
        description: 'This system leverages advanced algorithms to provide unparalleled performance and efficiency in various applications.'
      }
    ];
    navigate('/search-results', { state: { results: searchResults } }); // Corrected navigation
  };

  return (
    <>
      <NavBar /> {/* Include the NavBar component */}
      <div className="min-h-screen bg-white text-center flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="mb-4">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800"
              placeholder="Describe what you want to search for"
            />
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
              <input
                type="date"
                id="publishedAfter"
                value={publishedAfter}
                onChange={(e) => setPublishedAfter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="w-full md:w-1/2 pl-2">
              <input
                type="date"
                id="publishedBefore"
                value={publishedBefore}
                onChange={(e) => setPublishedBefore(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800"
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="flex flex-wrap mb-4">
            <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
              <div className="relative">
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 bg-gray-100 appearance-none"
                >
                  <option value="Patents">Patents</option>
                  <option value="Articles">Articles</option>
                  <option value="Books">Books</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 pl-2">
              <div className="relative">
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 bg-gray-100 appearance-none"
                >
                  <option value="Novelty">Novelty</option>
                  <option value="Validity">Validity</option>
                  <option value="Infringement">Infringement</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-3 bg-gray-800 text-white text-base rounded-md hover:bg-gray-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
        <div className="w-full max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExampleCard 
            title="Automated Prescription Bottle Cap" 
            description="Tracks bottle usage and reminds users to take medication on time via alarm or smartphone." 
          />
          <ExampleCard 
            title="Adaptive Office Lighting System" 
            description="Adjusts lighting based on time, natural light, and user activity to enhance productivity." 
          />
          <ExampleCard 
            title="Smart Refrigerator Shelf" 
            description="Monitors freshness and quantity of items, alerts for low or expired items, and auto-generates shopping lists." 
          />
          <ExampleCard 
            title="Automated Lawn Watering System" 
            description="Uses weather and soil data to optimize watering, conserving water and promoting healthy lawn growth." 
          />
        </div>
      </div>
    </>
  );
};

export default SearchPage;