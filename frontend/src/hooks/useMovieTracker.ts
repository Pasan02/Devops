"use client";

import { useState, useEffect, useCallback } from 'react';
import { Movie, WatchlistItem, WatchedItem } from '@/types';
import { watchlistApi, getImageUrl } from '@/lib/api';
import { useAuth } from './useAuth';

export function useMovieTracker() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watched, setWatched] = useState<WatchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchLists = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      setWatched([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [watchlistRes, watchedRes] = await Promise.all([
        watchlistApi.getWatchlist('watchlist'),
        watchlistApi.getWatchlist('watched')
      ]);

      const mapItem = (item: any) => ({
        id: item.tmdbId,
        title: item.title,
        type: item.mediaType === 'movie' ? 'Movie' : 'TV Show',
        year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : 'Unknown',
        rating: item.rating || 0,
        poster: item.posterPath ? getImageUrl(item.posterPath, 'w500') : '/placeholder-movie.jpg',
        overview: item.overview,
        _id: item._id,
        addedDate: item.addedDate,
        watchedDate: item.watchedDate,
        userRating: item.userRating,
        review: item.userReview
      } as any);

      setWatchlist(watchlistRes.data.items.map(mapItem));
      setWatched(watchedRes.data.items.map(mapItem));
    } catch (error) {
      console.error('Error fetching movie lists:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const addToWatchlist = async (movie: Movie) => {
    if (!isAuthenticated) {
      alert("Please sign in to add to watchlist");
      return;
    }

    // Optimistic update
    const tempId = Date.now().toString();
    const newItem: WatchlistItem = { ...movie, addedDate: new Date().toISOString(), _id: tempId };
    setWatchlist(prev => [...prev, newItem]);

    try {
      let posterPath = movie.poster;
      if (movie.poster && movie.poster.includes('image.tmdb.org')) {
          const matches = movie.poster.match(/\/t\/p\/w\d+(\/.*)$/);
          if (matches && matches[1]) posterPath = matches[1];
      }

      await watchlistApi.addToWatchlist({
        tmdbId: movie.id,
        mediaType: movie.type === 'Movie' ? 'movie' : 'tv',
        title: movie.title,
        posterPath: posterPath,
        releaseDate: movie.releaseDate || (movie.year && !isNaN(parseInt(movie.year)) ? `${movie.year}-01-01` : undefined),
        voteAverage: movie.rating,
        overview: movie.overview
      });
      
      // Refresh to get real ID
      fetchLists();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      // Revert optimistic update
      setWatchlist(prev => prev.filter(item => item._id !== tempId));
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    if (!isAuthenticated) return;

    const itemToRemove = watchlist.find(item => item.id === movieId);
    if (!itemToRemove || !itemToRemove._id) return;

    // Optimistic
    setWatchlist(prev => prev.filter(item => item.id !== movieId));

    try {
      await watchlistApi.removeFromWatchlist(itemToRemove._id);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      fetchLists(); // Revert/Refresh
    }
  };

  const markAsWatched = async (movie: Movie | WatchlistItem, userRating?: number, review?: string) => {
    if (!isAuthenticated) return;

    // Search for existing item in either list to get DB ID
    let dbId: string | undefined;
    const existingInWatchlist = watchlist.find(i => i.id === movie.id);
    const existingInWatched = watched.find(i => i.id === movie.id);

    if (existingInWatchlist) dbId = existingInWatchlist._id;
    else if (existingInWatched) dbId = existingInWatched._id;
    else if ((movie as any)._id) dbId = (movie as any)._id;

    if (dbId) {
        // Item exists, update it
        try {
            await watchlistApi.markAsWatched(dbId, { rating: userRating, review });
            // Refresh lists
            fetchLists();
        } catch (error) {
            console.error('Error marking as watched:', error);
        }
    } else {
        // Item does not exist, create it as watched
        try {
            let posterPath = movie.poster;
            if (movie.poster && movie.poster.includes('image.tmdb.org')) {
                const matches = movie.poster.match(/\/t\/p\/w\d+(\/.*)$/);
                if (matches && matches[1]) posterPath = matches[1];
            }

            await watchlistApi.addToWatchlist({
                tmdbId: movie.id,
                mediaType: movie.type === 'Movie' ? 'movie' : 'tv',
                title: movie.title,
                posterPath: posterPath,
                releaseDate: movie.releaseDate || (movie.year && !isNaN(parseInt(movie.year)) ? `${movie.year}-01-01` : undefined),
                voteAverage: movie.rating,
                overview: movie.overview,
                status: 'watched'
            });
            fetchLists();
        } catch (error) {
            console.error('Error adding as watched:', error);
        }
    }
  };

  const removeFromWatched = async (movieId: number) => {
     if (!isAuthenticated) return;
     const itemToRemove = watched.find(item => item.id === movieId);
     if (!itemToRemove || !itemToRemove._id) return;

     setWatched(prev => prev.filter(item => item.id !== movieId));

     try {
       await watchlistApi.removeFromWatchlist(itemToRemove._id);
     } catch (error) {
       console.error('Error removing from watched:', error);
       fetchLists();
     }
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
