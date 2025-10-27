export interface Movie {
  id: number;
  title: string;
  type: "Movie" | "TV Show";
  year: string;
  rating: number;
  poster: string;
  overview?: string;
  genres?: string[];
  runtime?: number;
  releaseDate?: string;
}

// TMDB API response format
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  mediaType: string;
  adult: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string;
  rating: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  mediaType: string;
}

export interface WatchlistItem extends Movie {
  addedDate: string;
}

export interface WatchedItem extends Movie {
  watchedDate: string;
  userRating?: number;
  review?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  watchlist: WatchlistItem[];
  watched: WatchedItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchResult {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}
