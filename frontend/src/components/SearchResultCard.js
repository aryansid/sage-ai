import React from 'react';

const SearchResultCard = ({ patent }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
      <div className="bg-custom-blue p-6">
        <h2 className="text-white text-sm font-medium">{patent.id}</h2>
        <p className="text-white text-xl font-semibold mt-2">{patent.title}</p>
      </div>
      <div className="p-6 bg-gray-50">
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Inventor:</span>
            <span className="text-gray-600 ml-2">{patent.inventor || 'Unknown Inventor'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Assignee:</span>
            <span className="text-gray-600 ml-2">{patent.assignee || 'Unknown Assignee'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Publication Date:</span>
            <span className="text-gray-600 ml-2">{patent.publicationDate}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-custom-blue text-lg font-semibold mb-3">Summary</h3>
        <p className="text-base text-gray-600 leading-relaxed">{patent.abstract || 'No Abstract'}</p>
      </div>
    </div>
  );
};

export default SearchResultCard;
