'use client';

import { useState } from 'react';
import { OMDbSearchResult } from '../types/omdb';
import { Badge } from './ui/badge';
import { Star, Play, Info, Plus, Film } from 'lucide-react';

interface MovieCardProps {
  movie: OMDbSearchResult;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className="group relative h-full cursor-pointer transition-all duration-300 rounded-xl overflow-hidden"
      onClick={onClick}
    >
      {/* Card Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-70 blur-sm transition-opacity duration-300 -z-10"></div>
      
      {/* Card Container with Shadow */}
      <div className="bg-[rgba(15,15,25,0.6)] rounded-xl overflow-hidden h-full transform transition-transform duration-500 group-hover:scale-[1.01] shadow-lg">
        {/* Poster Container with Aspect Ratio */}
        <div className="aspect-[2/3] w-full relative overflow-hidden">
          {/* Loading state */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-[rgba(30,30,45,0.4)] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-[rgba(30,30,45,0.8)] flex items-center justify-center flex-col p-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(30,30,45,0.8)] flex items-center justify-center mb-2">
                <Film className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs text-center text-gray-400">{movie.Title}</p>
            </div>
          )}
          
          {/* Poster Image */}
          <img 
            src={posterUrl} 
            alt={movie.Title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              !imageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageLoaded(true);
              setImageError(true);
            }}
            loading="lazy"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          
          {/* Hover Overlay with Actions */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-4">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
              <button className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-3 text-white shadow-lg transform hover:scale-110 transition-transform">
                <Play size={20} className="ml-1" />
              </button>
              
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transform hover:scale-110 transition-transform">
                  <Plus size={14} />
                </button>
                <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transform hover:scale-110 transition-transform">
                  <Info size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
            {movie.Title}
          </h3>
          
          <div className="flex items-center justify-between mt-1.5 text-xs">
            <div className="flex items-center">
              <Badge variant="outline" className="bg-black/20 border-purple-500/20 text-purple-300 px-2 py-0 text-[10px] h-auto">
                {movie.Type === 'movie' ? 'Movie' : 'TV'}
              </Badge>
              <span className="text-gray-400 ml-2">{movie.Year}</span>
            </div>
            
            <div className="flex items-center">
              <Star size={10} className="text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-gray-300">8.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}