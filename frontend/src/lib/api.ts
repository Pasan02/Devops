// API utility functions for movie tracker
import { Movie, TMDBMovie, TVShow } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

// Get authentication token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token');
  }
  return null;
};

// Create headers with auth token if available
const createHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API fetch function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: createHeaders(),
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Movie API functions
export const movieApi = {
  // Get trending movies and TV shows
  getTrending: (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day') =>
    apiRequest<{ results: TMDBMovie[]; media_type: string; time_window: string }>
      (`/movies/trending?media_type=${mediaType}&time_window=${timeWindow}`),

  // Search for movies and TV shows
  search: (query: string, page: number = 1) =>
    apiRequest<PaginatedResponse<TMDBMovie>>(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),

  // Get popular movies
  getPopularMovies: (page: number = 1) =>
    apiRequest<PaginatedResponse<Movie>>(`/movies/popular?page=${page}`),

  // Get popular TV shows
  getPopularTV: (page: number = 1) =>
    apiRequest<PaginatedResponse<TVShow>>(`/movies/tv/popular?page=${page}`),

  // Get movie details
  getMovieDetails: (movieId: number) =>
    apiRequest<Movie>(`/movies/movie/${movieId}`),

  // Get TV show details
  getTVDetails: (tvId: number) =>
    apiRequest<TVShow>(`/movies/tv/${tvId}`),

  // Get genres
  getGenres: () =>
    apiRequest<{ id: number; name: string }[]>(`/movies/genres`),
};

// Auth API functions
export const authApi = {
  // Register new user
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Login user
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  // Get current user profile
  getProfile: () =>
    apiRequest<{ user: any }>('/auth/me'),

  // Update user profile
  updateProfile: (userData: { firstName?: string; lastName?: string; preferences?: any }) =>
    apiRequest<{ user: any }>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Update password
  updatePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    }),
};

// Watchlist API functions
export const watchlistApi = {
  // Get user's watchlist
  getWatchlist: () =>
    apiRequest<{ items: any[] }>('/watchlist'),

  // Add item to watchlist
  addToWatchlist: (item: {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    poster?: string;
    releaseDate?: string;
  }) =>
    apiRequest<{ message: string }>('/watchlist', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  // Remove item from watchlist
  removeFromWatchlist: (itemId: string) =>
    apiRequest<{ message: string }>(`/watchlist/${itemId}`, {
      method: 'DELETE',
    }),

  // Mark as watched
  markAsWatched: (itemId: string, watchedData?: { rating?: number; review?: string }) =>
    apiRequest<{ message: string }>(`/watchlist/${itemId}/watched`, {
      method: 'PUT',
      body: JSON.stringify(watchedData || {}),
    }),
};

// Helper function to get full image URL from TMDB
export const getImageUrl = (path: string, size: 'w200' | 'w300' | 'w400' | 'w500' | 'original' = 'w500') => {
  if (!path) return '/placeholder-movie.jpg'; // Add a placeholder image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to format rating
export const formatRating = (rating: number) => {
  return Math.round(rating * 10) / 10;
};
