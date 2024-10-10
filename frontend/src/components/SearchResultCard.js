import React from 'react';

const SearchResultCard = ({ patent }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Patent: {patent.doc_path}</h2>
      <p className="text-gray-600 mb-4">Similarity: {patent.similarity.toFixed(4)}</p>
      <h3 className="text-lg font-medium mb-2">Claims:</h3>
      <ul className="list-disc pl-5 mb-4">
        {patent.claims.map((claim, index) => (
          <li key={index} className="text-gray-700">{claim}</li>
        ))}
      </ul>
      <h3 className="text-lg font-medium mb-2">TIF Files:</h3>
      <ul className="list-disc pl-5">
        {patent.tif_files.map((file, index) => (
          <li key={index} className="text-gray-700">{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultCard;