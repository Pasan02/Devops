// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Image URLs
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZES = {
  small: 'w154',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

// Local storage keys
export const STORAGE_KEYS = {
  WATCHLIST: 'movie_tracker_watchlist',
  WATCHED: 'movie_tracker_watched',
  USER_PREFERENCES: 'movie_tracker_preferences'
};

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
