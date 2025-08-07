'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SearchBar } from './SearchBar';
import { Github, Film, Menu, X, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function Navbar({ onSearch, searchValue = '' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Theme switcher needs to wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleSearchChange = (value: string) => {
    if (onSearch) {
      onSearch(value);
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    }
  };
  
  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-[rgba(12,12,20,0.85)] backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="mr-3 p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CINESCOPE
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Bar */}
            <div className="w-72 lg:w-96">
              <SearchBar 
                value={searchValue} 
                onChange={handleSearchChange}
                placeholder="Search movies & TV shows..."
              />
            </div>
            
            {/* GitHub Link */}
            <a 
              href="https://github.com/yourusername/movieverse" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 backdrop-blur-sm transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            
            {/* Theme Toggle */}
           
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 backdrop-blur-sm transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden absolute top-16 left-0 right-0 bg-[rgba(12,12,20,0.95)] backdrop-blur-lg border-t border-white/5
          transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? 'max-h-96 border-b border-white/5 shadow-xl' : 'max-h-0'}
        `}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <SearchBar 
            value={searchValue} 
            onChange={handleSearchChange}
            placeholder="Search movies & TV shows..."
          />
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* GitHub Link */}
            <a 
              href="https://github.com/mohitsatyarthiii/cinescope.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            
            {/* Theme Toggle */}
            
          </div>
        </div>
      </div>
    </header>
  );
}