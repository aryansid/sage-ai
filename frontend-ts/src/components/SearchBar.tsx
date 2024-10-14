import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload } from 'lucide-react';
import { Input } from '../@/components/ui/input';
import { Button } from '../@/components/ui/button';

interface PatentData {
  title: string;
  id: string;
  abstract: string;
  claims: string;
  specification: string;
}

interface SearchBarProps {
  onSearch: (results: PatentData[]) => void;
  onLog: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLog }) => {
  const [query, setQuery] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:8000/search';

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        onLog(query);
      }
    }, 500); // Log after 500ms of inactivity

    return () => clearTimeout(timeoutId);
  }, [query, onLog]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData();
    formData.append('text', query);
    if (image) {
      formData.append('image', image);
    }
    formData.append('k', '10');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Don't set 'Content-Type' header when sending FormData
        },
        mode: 'cors', // Explicitly set CORS mode
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: PatentData[] = await response.json();
      onSearch(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setImage(file);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" style={{'--input-height': '54px', '--font-size': '1.125rem'} as React.CSSProperties}>
      <div 
        className={`flex items-center space-x-2 ${isDragging ? 'bg-blue-100 rounded-md' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Input
            ref={inputRef}
            className="w-full pl-10 pr-4 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            style={{height: 'var(--input-height)', fontSize: 'var(--font-size)'}}
            placeholder="Enter description or drop a file..."
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-100 bg-opacity-50 rounded-md">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
          )}
        </div>
        <Button 
          className="rounded-md bg-black text-white hover:bg-gray-800 transition-colors duration-200"
          style={{height: 'var(--input-height)', fontSize: 'var(--font-size)', paddingLeft: '1.75rem', paddingRight: '1.75rem'}}
          type="submit"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
