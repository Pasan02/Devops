"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useMovieTracker } from "@/hooks/useMovieTracker";
import { Movie } from "@/types";

// Mock TV show data
const mockTVData: { [key: string]: Movie & { 
  overview: string; 
  genres: string[];
  runtime: number;
  releaseDate: string;
  creator: string;
  cast: string[];
  seasons: number;
  episodes: number;
  status: string;
  network: string;
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
    creator: "Christopher Storer",
    cast: ["Jeremy Allen White", "Ebon Moss-Bachrach", "Ayo Edebiri", "Lionel Boyce"],
    seasons: 3,
    episodes: 28,
    status: "Ongoing",
    network: "FX on Hulu",
    trailerUrl: "#"
  },
  "4": {
    id: 4,
    title: "The Last of Us",
    type: "TV Show",
    year: "2023",
    rating: 8.7,
    poster: "https://via.placeholder.com/400x600/059669/ffffff?text=TLOU",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both must traverse the U.S. and depend on each other for survival.",
    genres: ["Action", "Adventure", "Drama", "Horror"],
    runtime: 60,
    releaseDate: "2023-01-15",
    creator: "Craig Mazin, Neil Druckmann",
    cast: ["Pedro Pascal", "Bella Ramsey", "Anna Torv", "Nick Offerman"],
    seasons: 1,
    episodes: 9,
    status: "Renewed",
    network: "HBO",
    trailerUrl: "#"
  }
};

export default function TVShowDetails() {
  const params = useParams();
  const showId = params.id as string;
  const [show, setShow] = useState<typeof mockTVData[string] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToWatchlist, markAsWatched, removeFromWatchlist, removeFromWatched, isInWatchlist, isWatched } = useMovieTracker();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const showData = mockTVData[showId];
      setShow(showData || null);
      setIsLoading(false);
    }, 500);
  }, [showId]);

  const handleAddToWatchlist = () => {
    if (show) {
      addToWatchlist(show);
    }
  };

  const handleMarkWatched = () => {
    if (show) {
      markAsWatched(show);
    }
  };

  const handleRemoveFromWatchlist = () => {
    if (show) {
      removeFromWatchlist(show.id);
    }
  };

  const handleRemoveFromWatched = () => {
    if (show) {
      removeFromWatched(show.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-600 text-xl">Loading TV show details...</div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">TV Show not found</h1>
            <p className="text-gray-600">The TV show you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(show.id);
  const watched = isWatched(show.id);

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
              {/* Show Poster */}
              <div className="lg:col-span-1">
                <div className="aspect-[2/3] max-w-sm mx-auto lg:mx-0">
                  <img 
                    src={show.poster} 
                    alt={show.title}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>

              {/* Show Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title and Basic Info */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{show.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-lg">
                    <span className="bg-blue-600 px-3 py-1 rounded">TV Show</span>
                    <span className="bg-gray-700 px-3 py-1 rounded">{show.year}</span>
                    <span>{show.seasons} Season{show.seasons > 1 ? 's' : ''}</span>
                    <span>{show.episodes} Episodes</span>
                    <div className="flex items-center space-x-1">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">IMDb</span>
                      <span>{show.rating}/10</span>
                    </div>
                  </div>
                </div>

                {/* Status and Network */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`px-3 py-1 rounded ${
                    show.status === 'Ongoing' ? 'bg-green-600' : 
                    show.status === 'Renewed' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {show.status}
                  </span>
                  <span className="text-gray-300">{show.network}</span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
                    <span key={genre} className="bg-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-gray-300 leading-relaxed">{show.overview}</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Main Cast</h2>
              <div className="space-y-2">
                {show.cast.map((actor, index) => (
                  <div key={index} className="text-gray-700">{actor}</div>
                ))}
              </div>
            </div>

            {/* Production Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Show Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">Creator:</span>
                  <span className="ml-2 text-gray-700">{show.creator}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">First Aired:</span>
                  <span className="ml-2 text-gray-700">{new Date(show.releaseDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Episode Runtime:</span>
                  <span className="ml-2 text-gray-700">{show.runtime} minutes</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Network:</span>
                  <span className="ml-2 text-gray-700">{show.network}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Status:</span>
                  <span className="ml-2 text-gray-700">{show.status}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Seasons:</span>
                  <span className="ml-2 text-gray-700">{show.seasons}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Total Episodes:</span>
                  <span className="ml-2 text-gray-700">{show.episodes}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
