'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search for movies, series..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing delay for better UX
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (value) {
      setIsTyping(true);
      timer = setTimeout(() => setIsTyping(false), 600);
    }
    return () => clearTimeout(timer);
  }, [value]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`relative group transition-all duration-300 ${
        isFocused ? 'scale-[1.01]' : ''
      }`}
    >
      {/* Animated focus ring with glow effect */}
      <div 
        className={`absolute -inset-0.5 rounded-xl blur-sm bg-gradient-to-r from-purple-600/50 via-blue-600/50 to-pink-600/50 opacity-0 transition-opacity duration-300 ${
          isFocused ? 'opacity-100' : 'group-hover:opacity-70'
        }`}
      ></div>
      
      <div className="relative flex items-center">
        <div 
          className={`
            absolute inset-0 rounded-xl border transition-colors duration-300
            ${isFocused 
              ? 'border-purple-500/50 bg-[rgba(20,20,30,0.8)]' 
              : 'border-white/10 bg-[rgba(20,20,30,0.5)] group-hover:border-white/20'
            }
          `}
        ></div>
        
        <div className="relative flex items-center w-full h-14 px-4">
          <Search 
            className={`w-5 h-5 mr-3 transition-colors duration-300 ${
              isFocused ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
            }`} 
          />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none font-medium"
            autoComplete="off"
          />
          
          {isTyping && (
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin mr-2" />
          )}
          
          {value && !isTyping && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Subtle shadow */}
      <div className="absolute inset-0 rounded-xl shadow-lg shadow-purple-900/5 pointer-events-none"></div>
    </div>
  );
}