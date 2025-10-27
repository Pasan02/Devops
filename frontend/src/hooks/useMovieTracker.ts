"use client";

import { useState, useEffect } from 'react';
import { Movie, WatchlistItem, WatchedItem } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

export function useMovieTracker() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watched, setWatched] = useState<WatchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      const savedWatched = localStorage.getItem(STORAGE_KEYS.WATCHED);

      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
      if (savedWatched) {
        setWatched(JSON.parse(savedWatched));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
      } catch (error) {
        console.error('Error saving watchlist to localStorage:', error);
      }
    }
  }, [watchlist, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(watched));
      } catch (error) {
        console.error('Error saving watched to localStorage:', error);
      }
    }
  }, [watched, isLoading]);

  const addToWatchlist = (movie: Movie) => {
    const watchlistItem: WatchlistItem = {
      ...movie,
      addedDate: new Date().toISOString()
    };
    
    setWatchlist(prev => {
      // Check if already in watchlist
      if (prev.some(item => item.id === movie.id)) {
        return prev;
      }
      return [...prev, watchlistItem];
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== movieId));
  };

  const markAsWatched = (movie: Movie | WatchlistItem, userRating?: number, review?: string) => {
    const watchedItem: WatchedItem = {
      id: movie.id,
      title: movie.title,
      type: movie.type,
      year: movie.year,
      rating: movie.rating,
      poster: movie.poster,
      overview: movie.overview,
      genres: movie.genres,
      runtime: movie.runtime,
      releaseDate: movie.releaseDate,
      watchedDate: new Date().toISOString(),
      userRating,
      review
    };

    setWatched(prev => {
      // Check if already watched
      if (prev.some(item => item.id === movie.id)) {
        return prev;
      }
      return [...prev, watchedItem];
    });

    // Remove from watchlist if it was there
    removeFromWatchlist(movie.id);
  };

  const removeFromWatched = (movieId: number) => {
    setWatched(prev => prev.filter(item => item.id !== movieId));
  };

  const isInWatchlist = (movieId: number): boolean => {
    return watchlist.some(item => item.id === movieId);
  };

  const isWatched = (movieId: number): boolean => {
    return watched.some(item => item.id === movieId);
  };

  const getStats = () => {
    const movieCount = watchlist.filter(item => item.type === 'Movie').length;
    const showCount = watchlist.filter(item => item.type === 'TV Show').length;
    const totalWatched = watched.length;

    return {
      movieCount,
      showCount,
      totalWatched,
      totalInWatchlist: watchlist.length
    };
  };

  return {
    watchlist,
    watched,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    removeFromWatched,
    isInWatchlist,
    isWatched,
    getStats
  };
}
