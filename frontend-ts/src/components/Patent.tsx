import React from 'react';
import { Card } from "../@/components/ui/card"

interface PatentCardProps {
  title: string;
  id: string;
  abstract: string;
  specification: string;
  claims: string;
}

const PatentCard: React.FC<PatentCardProps> = ({ title, id, abstract, specification, claims }) => {
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
    </Card>
  );
};

export default PatentCard;