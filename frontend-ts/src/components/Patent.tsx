import React, { useState } from 'react';
import { Card } from "../@/components/ui/card"

interface PatentCardProps {
  title: string;
  id: string;
  abstract: string;
  specification: string;
  claims: string;
  images: string[];
}

const PatentCard: React.FC<PatentCardProps> = ({ title, id, abstract, specification, claims, images }) => {
  const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(images.length).fill(false));
  const [errorImages, setErrorImages] = useState<boolean[]>(new Array(images.length).fill(false));

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    setErrorImages(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <Card className="p-6 border border-gray-200 rounded-lg shadow-sm h-full overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-sm text-gray-600">ID: {id}</span>
        </div>
      </div>
      
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-left">Abstract</h3>
        <p className="text-sm text-gray-700 text-left">{abstract}</p>
      </div>

      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-left">Specification</h3>
        <p className="text-sm text-gray-700 text-left">{specification}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-left">Claims</h3>
        <p className="text-sm text-gray-700 text-left">{claims}</p>
      </div>

      {images && images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-left">Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square">
                {!loadedImages[index] && !errorImages[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    Loading...
                  </div>
                )}
                {errorImages[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500">
                    Error loading image
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={`Patent image ${index + 1}`}
                  className={`w-full h-full object-contain border border-gray-200 rounded ${loadedImages[index] ? '' : 'hidden'}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default PatentCard;
