import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../@/components/ui/input';
import { Button } from '../@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[type="search"]') as HTMLInputElement;
    onSearch(input.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" style={{'--input-height': '54px', '--font-size': '1.125rem'} as React.CSSProperties}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <Input
            className="w-full pl-10 pr-4 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            style={{height: 'var(--input-height)', fontSize: 'var(--font-size)'}}
            placeholder="Enter description of patent..."
            type="search"
          />
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