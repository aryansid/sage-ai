// frontend/src/components/ValidationBanner.js
import React from 'react';

const ValidationBanner = () => {
  return (
    <div className="flex justify-center items-center space-x-12 mt-12">
      <img src="/images/Harvard.png" alt="Harvard" className="h-16" />
      <img src="/images/Stanford.png" alt="Stanford" className="h-16" />
      <img src="/images/Yale.png" alt="Yale" className="h-16" />
      <img src="/images/NYU.jpeg" alt="NYU" className="h-16" />
    </div>
  );
};

export default ValidationBanner;