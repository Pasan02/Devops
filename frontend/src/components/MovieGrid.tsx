"use client";

import { useState, useEffect } from "react";
import { useMovieTracker } from "@/hooks/useMovieTracker";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

export default function MovieGrid() {
  const { addToWatchlist, markAsWatched, isInWatchlist, isWatched } = useMovieTracker();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const [popularMovies, popularTV] = await Promise.all([
          movieApi.getPopularMovies(),
          movieApi.getPopularTV()
        ]);
        
        const combined: Movie[] = [
          ...(popularMovies.data.results as any[]).slice(0, 4).map((item: any) => ({
            id: item.id,
            title: item.title,
            type: "Movie" as const,
            year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : "Unknown",
            rating: Math.round(item.rating * 10) / 10,
            poster: item.posterPath || '',
            overview: item.overview,
            genres: []
          })),
          ...(popularTV.data.results as any[]).slice(0, 4).map((item: any) => ({
            id: item.id,
            title: item.title,
            type: "TV Show" as const,
            year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : "Unknown",
            rating: Math.round(item.rating * 10) / 10,
            poster: item.posterPath || '',
            overview: item.overview,
            genres: []
          }))
        ];
        
        setFeaturedMovies(combined);
      } catch (error) {
        console.error('Error loading featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);

  const handleAddToWatchlist = (movieId: number) => {
    const movie = featuredMovies.find(m => m.id === movieId);
    if (movie) {
      addToWatchlist(movie);
    }
  };

  const handleMarkWatched = (movieId: number) => {
    const movie = featuredMovies.find(m => m.id === movieId);
    if (movie) {
      markAsWatched(movie);
    }
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Content</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">New Arrival</h2>
          <button className="text-red-600 hover:text-red-700 transition-colors">
            See more →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredMovies.map((movie) => (
            <MovieGridCard
              key={movie.id}
              movie={movie}
              isInWatchlist={isInWatchlist(movie.id)}
              isWatched={isWatched(movie.id)}
              onAddToWatchlist={handleAddToWatchlist}
              onMarkWatched={handleMarkWatched}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface MovieGridCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  isWatched: boolean;
  onAddToWatchlist: (id: number) => void;
  onMarkWatched: (id: number) => void;
}

function MovieGridCard({ movie, isInWatchlist, isWatched, onAddToWatchlist, onMarkWatched }: Readonly<MovieGridCardProps>) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Heart Icon */}
      <div className="absolute top-3 right-3 z-10">
        <button className="w-8 h-8 bg-gray-800/70 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
          ♡
        </button>
      </div>

      {/* Status Badge */}
      {isWatched && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Watched
          </span>
        </div>
      )}
      {isInWatchlist && !isWatched && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Watchlist
          </span>
        </div>
      )}

      {/* Movie Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-1">
          USA, {movie.year} - Current
        </p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <span className="bg-yellow-400 text-black px-1 py-0.5 rounded text-xs font-bold">IMDb</span>
            <span>{movie.rating * 10}/100</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-red-500">🍅</span>
            <span>{Math.floor(movie.rating * 10 + 10)}%</span>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres?.slice(0, 2).map((genre) => (
            <span key={genre} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {genre}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isWatched && !isInWatchlist && (
            <button
              onClick={() => onAddToWatchlist(movie.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors"
            >
              Add to Watchlist
            </button>
          )}
          {isInWatchlist && !isWatched && (
            <button
              onClick={() => onMarkWatched(movie.id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm transition-colors"
            >
              Mark Watched
            </button>
          )}
          {isWatched && (
            <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded text-sm text-center">
              ✓ Watched
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
