"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useMovieTracker } from "@/hooks/useMovieTracker";
import { Movie } from "@/types";

// Mock movie data - in real app, this would come from API
const mockMovieData: { [key: string]: Movie & { 
  overview: string; 
  genres: string[];
  runtime: number;
  releaseDate: string;
  director: string;
  cast: string[];
  budget: string;
  revenue: string;
  trailerUrl: string;
}} = {
  "1": {
    id: 1,
    title: "The Bear",
    type: "TV Show",
    year: "2024",
    rating: 9.1,
    poster: "https://via.placeholder.com/400x600/4f46e5/ffffff?text=The+Bear",
    overview: "Carmen 'Carmy' Berzatto, a young chef from the fine dining world, comes home to Chicago to run his deceased brother's Italian beef sandwich shop. A world away from what he's used to, Carmy must balance the soul-crushing reality of trading in small bills, balancing a dysfunctional staff and managing to stay afloat.",
    genres: ["Comedy", "Drama"],
    runtime: 30,
    releaseDate: "2022-06-23",
    director: "Christopher Storer",
    cast: ["Jeremy Allen White", "Ebon Moss-Bachrach", "Ayo Edebiri", "Lionel Boyce"],
    budget: "$15 million",
    revenue: "N/A",
    trailerUrl: "#"
  },
  "2": {
    id: 2,
    title: "Dune: Part Two",
    type: "Movie",
    year: "2024",
    rating: 8.8,
    poster: "https://via.placeholder.com/400x600/7c3aed/ffffff?text=Dune+2",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
    runtime: 166,
    releaseDate: "2024-03-01",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
    budget: "$190 million",
    revenue: "$714.4 million",
    trailerUrl: "#"
  }
};

export default function MovieDetails() {
  const params = useParams();
  const movieId = params.id as string;
  const [movie, setMovie] = useState<typeof mockMovieData[string] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToWatchlist, markAsWatched, removeFromWatchlist, removeFromWatched, isInWatchlist, isWatched } = useMovieTracker();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const movieData = mockMovieData[movieId];
      setMovie(movieData || null);
      setIsLoading(false);
    }, 500);
  }, [movieId]);

  const handleAddToWatchlist = () => {
    if (movie) {
      addToWatchlist(movie);
    }
  };

  const handleMarkWatched = () => {
    if (movie) {
      markAsWatched(movie);
    }
  };

  const handleRemoveFromWatchlist = () => {
    if (movie) {
      removeFromWatchlist(movie.id);
    }
  };

  const handleRemoveFromWatched = () => {
    if (movie) {
      removeFromWatched(movie.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-600 text-xl">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie not found</h1>
            <p className="text-gray-600">The movie you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const watched = isWatched(movie.id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/60"></div>
          
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <div className="aspect-[2/3] max-w-sm mx-auto lg:mx-0">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>

              {/* Movie Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title and Basic Info */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-lg">
                    <span className="bg-gray-700 px-3 py-1 rounded">{movie.year}</span>
                    <span>{movie.runtime} min</span>
                    <div className="flex items-center space-x-1">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">IMDb</span>
                      <span>{movie.rating}/10</span>
                    </div>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span key={genre} className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button 
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded flex items-center space-x-2 transition-colors"
                  >
                    <span>▶</span>
                    <span>Watch Trailer</span>
                  </button>

                  {!watched && !inWatchlist && (
                    <button
                      onClick={handleAddToWatchlist}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded flex items-center space-x-2 transition-colors"
                    >
                      <span>+</span>
                      <span>Add to Watchlist</span>
                    </button>
                  )}

                  {inWatchlist && !watched && (
                    <>
                      <button
                        onClick={handleMarkWatched}
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded flex items-center space-x-2 transition-colors"
                      >
                        <span>✓</span>
                        <span>Mark as Watched</span>
                      </button>
                      <button
                        onClick={handleRemoveFromWatchlist}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded transition-colors"
                      >
                        Remove from Watchlist
                      </button>
                    </>
                  )}

                  {watched && (
                    <>
                      <div className="bg-green-600 px-6 py-3 rounded flex items-center space-x-2">
                        <span>✓</span>
                        <span>Watched</span>
                      </div>
                      <button
                        onClick={handleAddToWatchlist}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded transition-colors"
                      >
                        Add to Watchlist Again
                      </button>
                      <button
                        onClick={handleRemoveFromWatched}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded transition-colors"
                      >
                        Remove from Watched
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Details */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cast */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cast</h2>
              <div className="space-y-2">
                {movie.cast.map((actor, index) => (
                  <div key={index} className="text-gray-700">{actor}</div>
                ))}
              </div>
            </div>

            {/* Production Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">Director:</span>
                  <span className="ml-2 text-gray-700">{movie.director}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Release Date:</span>
                  <span className="ml-2 text-gray-700">{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Runtime:</span>
                  <span className="ml-2 text-gray-700">{movie.runtime} minutes</span>
                </div>
                {movie.budget && (
                  <div>
                    <span className="font-medium text-gray-900">Budget:</span>
                    <span className="ml-2 text-gray-700">{movie.budget}</span>
                  </div>
                )}
                {movie.revenue && movie.revenue !== "N/A" && (
                  <div>
                    <span className="font-medium text-gray-900">Box Office:</span>
                    <span className="ml-2 text-gray-700">{movie.revenue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
