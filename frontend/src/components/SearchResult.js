import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendarAlt, faLink } from '@fortawesome/free-solid-svg-icons';

const SearchResult = ({ result }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
      <h3 className="font-semibold text-lg">{result.title}</h3>
      <div className="flex items-center text-gray-600 text-sm mt-2 space-x-4">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faUser} />
          <span>{result.author}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faBuilding} />
          <span>{result.company}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>{result.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faLink} />
          <a href={result.id} className="text-blue-500">{result.id}</a>
        </div>
      </div>
      <p className="text-gray-600 text-base mt-2">{result.description}</p>
    </div>
  );
};

export default SearchResult;