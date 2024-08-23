import React from 'react';

const SearchResult = ({ results }) => {
  return (
    <div className="w-full max-w-4xl mt-8 grid grid-cols-1 gap-6">
      {results.map((result, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-lg">{result.title}</h3>
          <p className="text-gray-600 text-base mt-2">{result.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;