'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchFilters } from '../types/omdb';
import { Toggle } from './ui/toggle';
import { Badge } from './ui/badge';
import { ChevronDown, Film, Tv, Calendar, X } from 'lucide-react';

interface FiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  years: number[];
}

export function Filters({ filters, onFiltersChange, years }: FiltersProps) {
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  
  const handleTypeChange = (type: 'all' | 'movie' | 'series') => {
    onFiltersChange({ type });
  };
  
  const handleYearChange = (year: string) => {
    onFiltersChange({ year });
    setYearDropdownOpen(false);
  };
  
  // Check if any filters are active
  const hasActiveFilters = filters.type !== 'all' || filters.year !== '';
  
  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({ type: 'all', year: '' });
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
    };
    
    if (yearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [yearDropdownOpen]);
  
  // Decade grouping of years for the dropdown
  const groupedYears = years.reduce((acc, year) => {
    const decade = Math.floor(year / 10) * 10;
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(year);
    return acc;
  }, {} as Record<number, number[]>);
  
  const decades = Object.keys(groupedYears).map(Number).sort((a, b) => b - a);
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Content type filters */}
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-xl bg-[rgba(30,30,45,0.6)] backdrop-blur-sm">
            <Toggle
              variant="outline"
              size="sm"
              pressed={filters.type === 'all'}
              onClick={() => handleTypeChange('all')}
              className={`
                rounded-l-lg px-3 text-sm h-9 border-0
                ${filters.type === 'all' 
                  ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.08)]'}
              `}
            >
              All
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              pressed={filters.type === 'movie'}
              onClick={() => handleTypeChange('movie')}
              className={`
                px-3 text-sm h-9 border-0 flex items-center
                ${filters.type === 'movie' 
                  ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.08)]'}
              `}
            >
              <Film className="w-3.5 h-3.5 mr-1.5" />
              Movies
            </Toggle>
            <Toggle
              variant="outline"
              size="sm"
              pressed={filters.type === 'series'}
              onClick={() => handleTypeChange('series')}
              className={`
                rounded-r-lg px-3 text-sm h-9 border-0 flex items-center
                ${filters.type === 'series' 
                  ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.08)]'}
              `}
            >
              <Tv className="w-3.5 h-3.5 mr-1.5" />
              TV Shows
            </Toggle>
          </div>
        </div>
        
        {/* Year dropdown */}
        <div className="relative" ref={yearDropdownRef}>
          <button
            onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            className={`
              flex items-center gap-2 h-9 px-3 rounded-xl text-sm transition-all duration-200
              ${filters.year 
                ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white' 
                : 'bg-[rgba(30,30,45,0.6)] text-gray-300 hover:text-white'}
            `}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="min-w-[50px]">
              {filters.year || 'Year'}
            </span>
            <ChevronDown 
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                yearDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {yearDropdownOpen && (
            <div className="absolute left-0 mt-2 w-[280px] bg-[rgba(15,15,25,0.95)] backdrop-blur-xl border border-gray-800 rounded-xl shadow-xl z-[100] overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">Select Year</h3>
                <button 
                  onClick={() => {
                    handleYearChange('');
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear
                </button>
              </div>
              
              <div className="p-2 max-h-[320px] overflow-y-auto">
                {decades.map(decade => (
                  <div key={decade} className="mb-4 last:mb-0">
                    <div className="text-xs font-semibold text-gray-400 mb-2 px-2">
                      {decade}s
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {groupedYears[decade].map(year => (
                        <button
                          key={year}
                          onClick={() => handleYearChange(year.toString())}
                          className={`
                            p-1.5 rounded text-xs transition-colors
                            ${filters.year === year.toString()
                              ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                          `}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex items-center ml-auto">
            <Badge className="bg-[rgba(30,30,45,0.6)] hover:bg-[rgba(30,30,45,0.8)] text-gray-300 border-0 flex items-center gap-1">
              {filters.type !== 'all' && filters.type === 'movie' && (
                <span>Movies</span>
              )}
              {filters.type !== 'all' && filters.type === 'series' && (
                <span>TV Shows</span>
              )}
              {filters.year && (
                <span>{filters.type !== 'all' ? ' • ' : ''}{filters.year}</span>
              )}
              <button 
                onClick={clearFilters}
                className="ml-1 p-0.5 rounded-full hover:bg-white/10"
                aria-label="Clear filters"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}