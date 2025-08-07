import { OMDbSearchResponse, OMDbMovieDetails, SearchFilters,OMDbSearchResult } from '../types/omdb';

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || '2354b253';
const BASE_URL = 'https://www.omdbapi.com/'; // ❌ Removed hardcoded apikey here

export async function searchMovies(filters: SearchFilters): Promise<OMDbSearchResponse> {
  const params = new URLSearchParams({
    apikey: API_KEY,
    s: filters.query,
    page: filters.page.toString(),
  });

  if (filters.type !== 'all') {
    params.append('type', filters.type);
  }

  if (filters.year) {
    params.append('y', filters.year);
  }

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: data.Error || 'No results found'
      };
    }

    return data;
  } catch (error) {
    console.error('Search error:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to fetch movies'
    };
  }
}

export async function getMovieDetails(imdbID: string): Promise<OMDbMovieDetails | null> {
  const params = new URLSearchParams({
    apikey: API_KEY,
    i: imdbID,
    plot: 'full'
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Movie details error:', error);
    return null;
  }
}

// ... existing code ...

// ... existing code ...

export async function fetchMoviesByCategory(
  category: string, 
  type: 'movie' | 'series' = 'movie',
  year: string = ''
): Promise<OMDbSearchResult[]> {
  // Sample categories and their search terms
  const categoryQueries: {[key: string]: string} = {
    'trending': 'action',
    'top_rated': 'best',
    'new_releases': '2023',
    'comedies': 'comedy',
    'action': 'action',
    'drama': 'drama',
    'sci_fi': 'sci-fi'
  };
  
  const query = categoryQueries[category] || category;
  
  try {
    const result = await searchMovies({
      query,
      type:  type,
      year,
      page: 1
    });
    
    return result.Response === 'True' ? result.Search : [];
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return [];
  }
}

// ... existing code ...

// Add this new function
export async function fetchMovieDetails(imdbID: string): Promise<OMDbMovieDetails> {
  try {
    // Improved API call with error handling
    const params = new URLSearchParams({
      apikey: '2354b253', // Your API key from .env
      i: imdbID,
      plot: 'full'
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to fetch movie details');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error; // Re-throw to handle in the component
  }
}