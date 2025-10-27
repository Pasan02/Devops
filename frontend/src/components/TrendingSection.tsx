"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { useMovieTracker } from "@/hooks/useMovieTracker";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

export default function TrendingSection() {
  const { addToWatchlist, markAsWatched, isInWatchlist, isWatched } = useMovieTracker();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const response = await movieApi.getTrending('all');
        const formattedMovies: Movie[] = (response.data.results as any[]).slice(0, 8).map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.mediaType === 'movie' ? "Movie" as const : "TV Show" as const,
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : "Unknown",
          rating: Math.round(item.rating * 10) / 10,
          poster: item.posterPath || '',
          overview: item.overview,
          genres: []
        }));
        setTrendingMovies(formattedMovies);
      } catch (error) {
        console.error('Error loading trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingMovies();
  }, []);

  const handleAddToWatchlist = (movieId: number) => {
    const movie = trendingMovies.find(m => m.id === movieId);
    if (movie) {
      addToWatchlist(movie);
    }
  };

  const handleMarkWatched = (movieId: number) => {
    const movie = trendingMovies.find(m => m.id === movieId);
    if (movie) {
      markAsWatched(movie);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {trendingMovies.map((item) => (
        <MovieCard
          key={item.id}
          id={item.id}
          title={item.title}
          type={item.type}
          year={item.year}
          rating={item.rating}
          poster={item.poster}
          isInWatchlist={isInWatchlist(item.id)}
          isWatched={isWatched(item.id)}
          onAddToWatchlist={handleAddToWatchlist}
          onMarkWatched={handleMarkWatched}
        />
      ))}
    </div>
  );
}
