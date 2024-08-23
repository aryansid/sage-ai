import React from 'react';

const ExampleCard = ({ title, description, isHovered, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 text-left ${isHovered ? 'bg-gray-100' : 'bg-white'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="font-normal text-sm">{title}</h3>
      <p className="text-gray-600 text-xs">{description}</p>
    </div>
  );
};

export default ExampleCard;