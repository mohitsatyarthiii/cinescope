'use client';

import { useState, useEffect, useRef } from 'react';
import { OMDbSearchResult, OMDbMovieDetails } from '../types/omdb';
import { 
  X, Star, Calendar, Clock, Award, Film, 
  User, Globe, Info, ExternalLink, Heart, Check
} from 'lucide-react';
import { Badge } from './ui/badge';
import { fetchMovieDetails } from '../lib/api';

interface MovieDetailsModalProps {
  movie: OMDbSearchResult;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const [details, setDetails] = useState<OMDbMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [watched, setWatched] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && movie?.imdbID) {
      const getMovieDetails = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const detailsData = await fetchMovieDetails(movie.imdbID);
          console.log("Movie details fetched:", detailsData);
          setDetails(detailsData);
        } catch (err) {
          console.error("Error in movie details modal:", err);
          setError(err instanceof Error ? err.message : 'Failed to load details');
        } finally {
          setLoading(false);
        }
      };

      getMovieDetails();
    }
    
    // Add event listener to prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [movie?.imdbID, isOpen]);

  // Close modal when clicking Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Format runtime to hours and minutes
  const formatRuntime = (runtime: string) => {
    if (!runtime || runtime === 'N/A') return 'Unknown';
    const minutes = parseInt(runtime.split(' ')[0]);
    if (isNaN(minutes)) return runtime;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate IMDb rating as a percentage for the circular progress
  const imdbRatingPercent = details?.imdbRating && details.imdbRating !== 'N/A' 
    ? (parseFloat(details.imdbRating) / 10) * 100 
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative z-10 w-full max-w-5xl bg-[rgba(12,12,18,0.98)] rounded-2xl premium-card-glow overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-white/10 rounded-2xl z-10 pointer-events-none premium-card-inner-border"></div>
        
        {/* Close button - always visible */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
        
        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] p-8 w-full">
            <div className="premium-loading-spinner"></div>
            <p className="mt-6 text-gray-400 font-medium">Loading cinematic details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[70vh] p-8 w-full">
            <div className="p-4 rounded-full bg-red-500/20 mb-4">
              <X size={40} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Unable to Load Details</h3>
            <p className="text-gray-400 text-center max-w-md">{error}</p>
            <button 
              onClick={onClose}
              className="mt-8 px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-full hover:from-gray-700 hover:to-gray-600 transition-all duration-300 font-medium"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row max-h-[90vh]">
            {/* Left side - Poster and key info */}
            <div className="md:w-2/5 relative bg-black">
              {/* Poster */}
              <div className="relative h-[250px] md:h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,12,18,1)] via-[rgba(12,12,18,0.8)] to-transparent z-10"></div>
                <img 
                  src={details?.Poster !== 'N/A' ? details?.Poster : '/placeholder.jpg'} 
                  alt={details?.Title || movie.Title}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Bottom overlay with basic info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
                  <div className="flex gap-2 mb-2">
                    {details?.Type && (
                      <Badge className="bg-purple-900/60 text-purple-200 border-none">
                        {details.Type.toUpperCase()}
                      </Badge>
                    )}
                    {details?.Rated && details.Rated !== 'N/A' && (
                      <Badge variant="outline" className="border-gray-700 bg-black/30 text-gray-300">
                        {details.Rated}
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md line-clamp-2">
                    {details?.Title || movie.Title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
                    {details?.Year && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-purple-400" />
                        <span>{details.Year}</span>
                      </div>
                    )}
                    
                    {details?.Runtime && details.Runtime !== 'N/A' && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-purple-400" />
                        <span>{formatRuntime(details.Runtime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Details */}
            <div className="md:w-3/5 p-4 md:p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: '90vh' }}>
              {/* Top section with rating and actions */}
              <div className="flex justify-between items-start mb-6">
                {/* IMDb rating circle */}
                {details?.imdbRating && details.imdbRating !== 'N/A' && (
                  <div className="flex items-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        {/* Background circle */}
                        <circle 
                          cx="18" cy="18" r="16" 
                          fill="none" 
                          className="stroke-current text-gray-800" 
                          strokeWidth="2"
                        />
                        {/* Rating circle */}
                        <circle 
                          cx="18" cy="18" r="16" 
                          fill="none" 
                          className="stroke-current text-yellow-500" 
                          strokeWidth="2"
                          strokeDasharray="100"
                          strokeDashoffset={100 - imdbRatingPercent}
                          transform="rotate(-90 18 18)"
                        />
                        <text 
                          x="18" y="18" 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          className="fill-current text-white font-bold text-lg"
                        >
                          {details.imdbRating}
                        </text>
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-yellow-500 font-medium text-sm">IMDb Rating</div>
                      <div className="text-xs text-gray-400">
                        {details.imdbVotes !== 'N/A' && `${details.imdbVotes} votes`}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFavorited(!favorited)}
                    className={`
                      p-2 rounded-full backdrop-blur-md flex items-center justify-center
                      transition-all duration-300
                      ${favorited 
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'}
                    `}
                  >
                    <Heart className={`w-4 h-4 ${favorited ? 'fill-pink-400' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => setWatched(!watched)}
                    className={`
                      p-2 rounded-full backdrop-blur-md flex items-center justify-center
                      transition-all duration-300
                      ${watched 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'}
                    `}
                  >
                    <Check className={`w-4 h-4 ${watched ? 'text-green-400' : ''}`} />
                  </button>
                  
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 backdrop-blur-md flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              {/* Plot section */}
              {details?.Plot && details.Plot !== 'N/A' && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="inline-block w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-2"></span>
                    Synopsis
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-sm">{details.Plot}</p>
                </div>
              )}
              
              {/* Genre tags */}
              {details?.Genre && details.Genre !== 'N/A' && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {details.Genre.split(', ').map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs border border-purple-500/20 hover:bg-purple-900/40 transition-colors"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Details grid */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Cast and crew */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="inline-block w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-2"></span>
                    Cast & Crew
                  </h2>
                  
                  <div className="space-y-3">
                    {details?.Actors && details.Actors !== 'N/A' && (
                      <div className="premium-detail-card group">
                        <h3 className="text-gray-200 font-medium mb-1 flex items-center group-hover:text-purple-300 transition-colors text-sm">
                          <User size={14} className="text-purple-400 mr-2" />
                          Cast
                        </h3>
                        <p className="text-gray-400 text-xs">{details.Actors}</p>
                      </div>
                    )}
                    
                    {details?.Director && details.Director !== 'N/A' && (
                      <div className="premium-detail-card group">
                        <h3 className="text-gray-200 font-medium mb-1 flex items-center group-hover:text-purple-300 transition-colors text-sm">
                          <Film size={14} className="text-purple-400 mr-2" />
                          Director
                        </h3>
                        <p className="text-gray-400 text-xs">{details.Director}</p>
                      </div>
                    )}
                    
                    {details?.Writer && details.Writer !== 'N/A' && (
                      <div className="premium-detail-card group">
                        <h3 className="text-gray-200 font-medium mb-1 flex items-center group-hover:text-purple-300 transition-colors text-sm">
                          <Film size={14} className="text-purple-400 mr-2" />
                          Writers
                        </h3>
                        <p className="text-gray-400 text-xs">{details.Writer}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Additional details */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="inline-block w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-2"></span>
                    Details
                  </h2>
                  
                  <div className="premium-detail-card">
                    <div className="grid grid-cols-2 gap-y-3 text-xs">
                      {details?.Language && details.Language !== 'N/A' && (
                        <div className="flex items-start">
                          <Globe size={12} className="text-gray-500 mt-0.5 mr-1.5" />
                          <div>
                            <div className="text-gray-400">Language</div>
                            <div className="text-gray-200">{details.Language}</div>
                          </div>
                        </div>
                      )}
                      
                      {details?.Country && details.Country !== 'N/A' && (
                        <div className="flex items-start">
                          <Globe size={12} className="text-gray-500 mt-0.5 mr-1.5" />
                          <div>
                            <div className="text-gray-400">Country</div>
                            <div className="text-gray-200">{details.Country}</div>
                          </div>
                        </div>
                      )}
                      
                      {details?.Released && details.Released !== 'N/A' && (
                        <div className="flex items-start">
                          <Calendar size={12} className="text-gray-500 mt-0.5 mr-1.5" />
                          <div>
                            <div className="text-gray-400">Released</div>
                            <div className="text-gray-200">{details.Released}</div>
                          </div>
                        </div>
                      )}
                      
                      {details?.BoxOffice && details.BoxOffice !== 'N/A' && (
                        <div className="flex items-start">
                          <Info size={12} className="text-gray-500 mt-0.5 mr-1.5" />
                          <div>
                            <div className="text-gray-400">Box Office</div>
                            <div className="text-gray-200">{details.BoxOffice}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Awards */}
                  {details?.Awards && details.Awards !== 'N/A' && (
                    <div className="premium-detail-card group mt-3">
                      <h3 className="text-gray-200 font-medium mb-1 flex items-center group-hover:text-yellow-300 transition-colors text-sm">
                        <Award size={14} className="text-yellow-500 mr-2" />
                        Awards
                      </h3>
                      <p className="text-gray-400 text-xs">{details.Awards}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Ratings section */}
              {details?.Ratings && details.Ratings.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="inline-block w-1 h-5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-2"></span>
                    Ratings
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {details.Ratings.map((rating, idx) => (
                      <div key={idx} className="premium-detail-card group">
                        <div className="text-center">
                          <div className="text-gray-400 text-xs mb-1">{rating.Source}</div>
                          <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {rating.Value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Footer */}
              <div className="pt-3 border-t border-gray-800/50 mt-4 flex justify-between items-center text-xs text-gray-500">
                <div>IMDb ID: {movie.imdbID}</div>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}