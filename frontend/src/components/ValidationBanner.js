// frontend/src/components/ValidationBanner.js
import React from 'react';

const ValidationBanner = () => {
  const logos = [
    { src: "/images/MIT.png", alt: "MIT" },
    { src: "/images/Harvard.png", alt: "Harvard" },
    { src: "/images/Stanford.png", alt: "Stanford" },
    { src: "/images/USC.png", alt: "USC" },
  ];

  return (
    <div className="absolute left-0 right-0 bottom-32 overflow-hidden bg-white">
      <div className="inline-flex animate-scroll">
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div key={index} className="flex-shrink-0 w-64 mx-8">
            <img src={logo.src} alt={logo.alt} className="h-14 object-contain" />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
          width: 300%;
        }
      `}</style>
    </div>
  );
};

export default ValidationBanner;