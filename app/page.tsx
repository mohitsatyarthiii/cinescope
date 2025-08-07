'use client';

import { useState, useEffect, useRef } from 'react';
import { Filters } from '../components/Filters';
import { Navbar } from '../components/Navbar';
import { useMovies } from '../hooks/useMovies';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { EmptyState } from '../components/EmptyState';
import { MovieCategory } from '../components/MovieCategory';
import { SearchFilters, OMDbSearchResult } from '../types/omdb';
import { ChevronRight, Sparkles, Flame, Clock, Star, Zap, Trophy, Search } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    year: '',
    page: 1,
  });
  
  const [selectedMovie, setSelectedMovie] = useState<OMDbSearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { data, loading, error } = useMovies(filters);
  
  // Handle search from any input (navbar or homepage)
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value, page: 1 }));
  };
  
  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };
  
  const handleMovieClick = (movie: OMDbSearchResult) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  
  // Scroll to results when search is performed
  useEffect(() => {
    if (filters.query && resultsRef.current) {
      // Add a slight delay to ensure content has updated
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [filters.query, data]);
  
  // Calculate years for the filter dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-[#080810] to-[#0F0F18]">
      {/* Navbar with Search */}
      <Navbar 
        onSearch={handleSearchChange}
        searchValue={filters.query}
      />
      
      {/* Compact Hero Section */}
      <div className="relative w-full overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/hero-pattern.png')] bg-cover opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black"></div>
        <div className="absolute top-20 -left-24 w-96 h-96 bg-purple-900/20 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute top-10 -right-24 w-96 h-96 bg-blue-900/20 rounded-full filter blur-[100px] animate-pulse-slow animation-delay-2000"></div>
        
        {/* Hero Content - More Compact */}
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-400 font-medium text-xs tracking-wide uppercase">Discover the cinematic universe</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white tracking-tight">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">Explore</span> Movies & TV Shows
            </h1>
            
            <p className="text-gray-300 text-base max-w-2xl mx-auto mb-6">
              Your personal guide to discover and enjoy the best content from around the world.
            </p>
            
            {/* Home Search Bar (complements the navbar search) */}
            <div className="bg-[rgba(15,15,25,0.65)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-4 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] relative overflow-visible max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20 rounded-xl blur-xl group-hover:opacity-80 transition-opacity opacity-50"></div>
              <div className="absolute inset-px rounded-xl border border-white/10 pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row gap-3 relative" style={{ overflow: 'visible' }}>
                <div className="flex-1">
                  <SearchBar 
                    value={filters.query} 
                    onChange={handleSearchChange}
                    placeholder="Search for movies, TV shows..."
                  />
                </div>
                
                <div className="sm:w-auto" style={{ overflow: 'visible' }}>
                  <Filters 
                    filters={filters} 
                    onFiltersChange={handleFiltersChange}
                    years={years}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div ref={resultsRef} className="container mx-auto px-4 pb-20">
        {/* Display search results or categories based on search state */}
        {filters.query ? (
          <div className="mt-4">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-[rgba(30,30,45,0.4)] rounded-xl h-80 animate-pulse shimmer-effect"></div>
                ))}
              </div>
            ) : error || (data && data.Response === 'False') ? (
              <EmptyState 
                message={error || (data?.Error || 'No results found')} 
                description="Try adjusting your search or filters to find what you're looking for."
              />
            ) : data && data.Search?.length > 0 ? (
              <div>
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-white mr-3">
                    {data.totalResults} Results
                  </h2>
                  <div className="text-sm px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-gray-300">
                    "{filters.query}"
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {data.Search.map(movie => (
                    <MovieCard 
                      key={movie.imdbID}
                      movie={movie}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          // Featured Categories with Beautiful Headers
          <div className="mt-8 space-y-12">
            {/* Featured Category */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-700/20 mr-3">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                <div className="ml-auto">
                  <button className="flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <MovieCategory 
                title="" 
                category="trending" 
                type={filters.type === 'series' ? 'series' : 'movie'} 
                year={filters.year}
                hideTitle
              />
            </div>
            
            {/* Popular TV Shows with custom icon */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-700/20 mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Popular TV Shows</h2>
                <div className="ml-auto">
                  <button className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <MovieCategory 
                title="" 
                category="trending" 
                type="series"
                year={filters.year}
                hideTitle
              />
            </div>
            
            {/* Action Movies with custom icon */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-700/20 mr-3">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Action & Adventure</h2>
                <div className="ml-auto">
                  <button className="flex items-center text-sm text-red-400 hover:text-red-300 transition-colors">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <MovieCategory 
                title="" 
                category="action" 
                type={filters.type === 'series' ? 'series' : 'movie'}
                year={filters.year}
                hideTitle
              />
            </div>
            
            {/* More categories with their icons */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-800 shadow-lg shadow-amber-700/20 mr-3">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Top Rated</h2>
                <div className="ml-auto">
                  <button className="flex items-center text-sm text-amber-400 hover:text-amber-300 transition-colors">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <MovieCategory 
                title="" 
                category="top_rated" 
                type={filters.type === 'series' ? 'series' : 'movie'}
                year={filters.year}
                hideTitle
              />
            </div>
            
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-800 shadow-lg shadow-green-700/20 mr-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">New Releases</h2>
                <div className="ml-auto">
                  <button className="flex items-center text-sm text-green-400 hover:text-green-300 transition-colors">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              
              <MovieCategory 
                title="" 
                category="new_releases" 
                type={filters.type === 'series' ? 'series' : 'movie'}
                year={filters.year}
                hideTitle
              />
            </div>
          </div>
        )}
      </div>
      
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}