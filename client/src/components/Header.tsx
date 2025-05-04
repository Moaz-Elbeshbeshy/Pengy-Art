import { useState } from 'react';
import { Search } from 'lucide-react';
import pengyLogo from '../assets/pengy-logo.png';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setIsSearchOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center">
            <img src={pengyLogo} alt="Pengy" className="h-10" />
            <span className="text-blue-600 font-semibold text-lg ml-3">Pengy Art</span>
          </a>
        </div>
        
        <div className="flex items-center">
          {isSearchOpen ? (
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Search artwork..."
                className="border rounded-full py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
