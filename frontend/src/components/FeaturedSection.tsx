"use client";

import { useMovieTracker } from "@/hooks/useMovieTracker";
import { useEffect, useState } from "react";
import { movieApi } from "@/lib/api";
import { TMDBMovie } from "@/types";

export default function FeaturedSection() {
  const { addToWatchlist } = useMovieTracker();
  const [featuredMovie, setFeaturedMovie] = useState<TMDBMovie | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await movieApi.getTrending('movie', 'day');
        if (response.results && response.results.length > 0) {
          // Get the first item or a random one from the top 5
          setFeaturedMovie(response.results[0]);
        } else {
          throw new Error("No trending movies found");
        }
      } catch (error) {
        console.error("Failed to fetch featured movie, using fallback:", error);
        // Fallback to Zootopia 2
        setFeaturedMovie({
          id: 1022789,
          title: "Zootopia 2",
          overview: "After cracking the biggest case in Zootopia's history, rookie cops Judy Hopps and Nick Wilde find themselves on the twisting trail of a great mystery when Gary De'Snake arrives and turns the animal metropolis upside down. To crack the case, Judy and Nick must go undercover to unexpected new parts of town, where their growing partnership is tested like never before.",
          releaseDate: "2025-11-26",
          posterPath: "https://media.themoviedb.org/t/p/w600_and_h900_face/oJ7g2CifqpStmoYQyaLQgEU32qO.jpg",
          backdropPath: "https://media.themoviedb.org/t/p/w1066_and_h600_face/7nfpkR9XsQ1lBNCXSSHxGV7Dkxe.jpg",
          rating: 7.9,
          voteCount: 1500,
          popularity: 2500,
          genreIds: [16, 35, 12, 10751, 9648],
          mediaType: "movie",
          adult: false
        });
      }
    };

    fetchFeatured();
  }, []);

  const handleAddToWatchlist = () => {
    if (!featuredMovie) return;
    
    addToWatchlist({
      id: featuredMovie.id,
      title: featuredMovie.title,
      type: "Movie",
      year: featuredMovie.releaseDate ? new Date(featuredMovie.releaseDate).getFullYear().toString() : "",
      rating: featuredMovie.rating,
      poster: featuredMovie.posterPath || "", 
      overview: featuredMovie.overview,
      releaseDate: featuredMovie.releaseDate
    });
  };

  if (!featuredMovie) {
    // Loading skeleton or fallback
    return (
      <section className="relative bg-gray-900 text-white min-h-[500px] flex items-center animate-pulse">
        <div className="container mx-auto px-4">
           <div className="h-8 bg-gray-800 w-1/3 mb-4 rounded"></div>
           <div className="h-4 bg-gray-800 w-1/4 mb-4 rounded"></div>
           <div className="h-32 bg-gray-800 w-1/2 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-900 text-white min-h-[500px] flex items-center overflow-hidden">
      {/* Background Image */}
      {featuredMovie.backdropPath && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredMovie.backdropPath})` }}
        ></div>
      )}

      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10"></div>
      
      {/* Background Pattern - Optional on top of image */}
      <div className="absolute inset-0 opacity-20 z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">{featuredMovie.title}</h1>
          
          {/* Movie Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">IMDb</span>
              <span>{(featuredMovie.rating * 10).toFixed(0)}/100</span>
            </div>
            <div className="flex items-center space-x-1">
              {featuredMovie.releaseDate && (
                <span className="text-gray-300">{new Date(featuredMovie.releaseDate).getFullYear()}</span>
              )}
            </div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
            {featuredMovie.overview}
          </p>

          <button 
            onClick={handleAddToWatchlist}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded flex items-center space-x-2 transition-colors"
          >
            <span>+</span>
            <span>ADD TO WATCHLIST</span>
          </button>
        </div>

        {/* Featured Movie Image/Poster on the right */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
          {featuredMovie.posterPath ? (
            <img 
              src={featuredMovie.posterPath} 
              alt={featuredMovie.title}
              className="w-64 h-auto rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          ) : (
            <div className="w-64 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
              <div className="w-48 h-72 bg-gray-800 rounded-lg flex items-center justify-center text-6xl">
                🎬
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
