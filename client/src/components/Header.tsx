import { useState, useEffect } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import pengyLogo from '../assets/pengy-logo.png';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously enabled dark mode
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', String(newDarkMode));
    
    // Toggle dark class on html element
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setIsSearchOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center">
            <img src={pengyLogo} alt="Pengy" className="h-10" />
            <span className="ml-3 text-blue-600 dark:text-blue-400 font-bold text-xl" style={{
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
              textShadow: "1px 1px 0px #ffffff, -1px -1px 0px #a0c6ff",
              letterSpacing: "0.5px",
              transform: "rotate(-2deg)",
              display: "inline-block"
            }}>Pengy Art</span>
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {isSearchOpen ? (
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Search artwork..."
                className="border rounded-full py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
