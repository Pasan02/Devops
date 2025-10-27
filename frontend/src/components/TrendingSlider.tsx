"use client";

import { useState, useEffect } from "react";
import { useMovieTracker } from "@/hooks/useMovieTracker";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

export default function TrendingSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const response = await movieApi.getTrending('all');
        const formattedMovies: Movie[] = (response.data.results as any[]).slice(0, 5).map((item: any) => ({
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
  const { addToWatchlist, markAsWatched, isInWatchlist, isWatched } = useMovieTracker();

  const itemsPerView = 4;
  const maxIndex = Math.max(0, trendingMovies.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

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

  if (loading || trendingMovies.length === 0) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Movie</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-3xl font-bold text-gray-900">Featured Movie</h2>
          <button className="text-red-600 hover:text-red-700 transition-colors">
            See more →
          </button>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {trendingMovies.map((movie) => (
                <div key={movie.id} className="w-1/4 flex-shrink-0 px-3">
                  <TrendingMovieCard
                    movie={movie}
                    isInWatchlist={isInWatchlist(movie.id)}
                    isWatched={isWatched(movie.id)}
                    onAddToWatchlist={handleAddToWatchlist}
                    onMarkWatched={handleMarkWatched}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface TrendingMovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  isWatched: boolean;
  onAddToWatchlist: (id: number) => void;
  onMarkWatched: (id: number) => void;
}

function TrendingMovieCard({ movie, isInWatchlist, isWatched, onAddToWatchlist, onMarkWatched }: Readonly<TrendingMovieCardProps>) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Heart Icon */}
      <div className="absolute top-3 right-3 z-10">
        <button className="w-8 h-8 bg-gray-800/70 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
          ♡
        </button>
      </div>

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
          {movie.type} • {movie.year}
        </p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span className="bg-yellow-400 text-black px-1 py-0.5 rounded text-xs font-bold">IMDb</span>
            <span>{movie.rating * 10}/100</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-red-500">🍅</span>
            <span>{Math.floor(movie.rating * 10 + 10)}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 space-y-2">
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
