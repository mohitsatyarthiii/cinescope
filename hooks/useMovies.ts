import { useState, useEffect } from 'react';
import { OMDbSearchResponse, SearchFilters } from '../types/omdb';
import { searchMovies } from '../lib/api';

export function useMovies(filters: SearchFilters) {
  const [data, setData] = useState<OMDbSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filters.query.trim()) {
      setData(null);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await searchMovies(filters);
        setData(result);
        
        if (result.Response === 'False' && result.Error) {
          setError(result.Error);
        }
      } catch (err) {
        setError('Failed to fetch movies');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters.query, filters.type, filters.year, filters.page]);

  return { data, loading, error };
}