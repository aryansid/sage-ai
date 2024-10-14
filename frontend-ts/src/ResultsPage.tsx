import React, { useState } from 'react';
import { Avatar, AvatarFallback } from "./@/components/ui/avatar"
import { Badge } from "./@/components/ui/badge"
import { Button } from "./@/components/ui/button"
import { Card } from "./@/components/ui/card"
import { Input } from "./@/components/ui/input"
import { ScrollArea } from "./@/components/ui/scroll-area"
import { SearchIcon } from "lucide-react"
import { useLocation } from 'react-router-dom';
import NavBar from './components/NavBar'; // Import the NavBar component
import PatentCard from './components/Patent'; // Add this import

interface SearchResult {
  title: string;
  id: string;
  abstract: string;
  specification: string;
  claims: string;
  images: string[];  // Add this line
}

export default function ResultsPage() {
  const location = useLocation();
  const searchResults: SearchResult[] = location.state?.results || [];
  const [selectedPatent, setSelectedPatent] = useState<SearchResult | null>(searchResults[0] || null);

  const handlePatentSelect = (patent: SearchResult) => {
    setSelectedPatent(patent);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="z-10 relative">
        <NavBar currentPage="Search" /> {/* Add the NavBar component here */}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 border-r border-gray-200 overflow-y-auto">
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input placeholder="Search" className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-md" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            {searchResults.map((result, index) => (
              <EmailItem
                key={result.id}
                title={result.title}
                id={result.id}
                abstract={result.abstract}
                labels={[]} // You might want to add labels based on the search result
                isActive={selectedPatent?.id === result.id}
                onClick={() => handlePatentSelect(result)}
              />
            ))}
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedPatent && (
              <PatentCard
                title={selectedPatent.title}
                id={selectedPatent.id}
                abstract={selectedPatent.abstract}
                specification={selectedPatent.specification}
                claims={selectedPatent.claims}
                images={selectedPatent.images}  // Add this line
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmailItemProps {
  title: string;
  id: string;
  abstract: string;
  labels: string[];
  isActive?: boolean;
  onClick: () => void;
}

function EmailItem({ title, id, abstract, labels, isActive = false, onClick }: EmailItemProps) {
  return (
    <div 
      className={`mb-4 p-4 rounded-lg border ${isActive ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'} hover:bg-gray-100 cursor-pointer transition-colors duration-200`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs text-gray-500">ID: {id}</span>
      </div>
      <p className="text-xs text-gray-600 mb-3 text-left">{abstract}</p>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <Badge 
            key={label} 
            variant="secondary" 
            className={`text-xs px-2 py-1 ${label === 'work' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
