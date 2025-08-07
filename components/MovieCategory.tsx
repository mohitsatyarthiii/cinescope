'use client';

import { useState, useEffect, useRef } from 'react';
import { OMDbSearchResult } from '../types/omdb';
import { MovieCard } from './MovieCard';
import { MovieDetailsModal } from './MovieDetailsModal';
import { fetchMoviesByCategory } from '../lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieCategoryProps {
  title: string;
  category: string;
  type?: 'movie' | 'series';
  year?: string;
  hideTitle?: boolean;
}

export function MovieCategory({ title, category, type = 'movie', year = '', hideTitle = false }: MovieCategoryProps) {
  const [movies, setMovies] = useState<OMDbSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<OMDbSearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const results = await fetchMoviesByCategory(category, type, year);
      setMovies(results);
      setLoading(false);
    };

    loadMovies();
  }, [category, type, year]);

  // Update scroll buttons visibility
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      // Also check after images might have loaded
      setTimeout(checkScroll, 500);
    }
    
    return () => container?.removeEventListener('scroll', checkScroll);
  }, [loading, movies]);

  const handleMovieClick = (movie: OMDbSearchResult) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -container.clientWidth / 2, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: container.clientWidth / 2, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="relative py-2">
        {!hideTitle && (
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            {title}
          </h2>
        )}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="w-40 md:w-56 flex-shrink-0 aspect-[2/3] rounded-xl bg-[rgba(30,30,45,0.4)] animate-pulse shimmer-effect"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return null;
  }

  return (
    <div className="relative py-2 overflow-hidden">
      {!hideTitle && (
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          {title}
        </h2>
      )}
      
      <div className="relative group">
        {/* Scroll controls */}
        {canScrollLeft && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {canScrollRight && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
        
        {/* Movie cards container with horizontal scrolling */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 pt-2 px-1 -mx-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.imdbID} className="w-40 md:w-56 flex-shrink-0">
              <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
            </div>
          ))}
        </div>
        
        {/* Gradient fades on the sides */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0F0F18] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0F0F18] to-transparent pointer-events-none"></div>
      </div>
      
      {/* Movie details modal */}
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