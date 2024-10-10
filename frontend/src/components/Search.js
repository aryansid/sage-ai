import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

function Search() {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'https://your-render-app-name.onrender.com/api/retrieve';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (query) formData.append('query', query);
    if (image) formData.append('image', image);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      navigate('/search-results', { state: { results: data.results } });
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
        <div className="w-full max-w-[720px] space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-normal mb-3">Patent Search</h1>
            <p className="text-xl text-gray-400">
              Search for patents and prior art with our advanced search tool.
            </p>
          </div>
          <div className="bg-[#111111] rounded-xl p-5 space-y-5 border border-[#1f1f1f]">
            <h2 className="text-lg mb-4">Enter your search criteria</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="searchQuery" className="block text-sm text-gray-400 mb-1">
                  Search query
                </label>
                <textarea
                  id="searchQuery"
                  placeholder="Enter your patent search query here..."
                  className="bg-[#1f1f1f] border border-[#2e2e2e] rounded-md h-24 placeholder-gray-500 text-white w-full p-3 text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="imageUpload" className="block text-sm text-gray-400 mb-1">
                  Upload Image (optional)
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="bg-[#1f1f1f] border border-[#2e2e2e] rounded-md text-white w-full p-2 text-sm"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="flex items-center justify-between pt-3">
                <p className="text-xs text-gray-400">
                  Advanced search options available
                </p>
                <button 
                  type="submit" 
                  className="bg-white text-black hover:bg-gray-200 rounded-md px-3 py-2 text-sm"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Patents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;