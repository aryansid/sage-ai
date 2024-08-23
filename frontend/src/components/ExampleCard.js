import React from 'react';

const ExampleCard = ({ title, description }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
      <h3 className="font-normal text-sm">{title}</h3>
      <p className="text-gray-600 text-xs">{description}</p>
    </div>
  );
};

export default ExampleCard;
