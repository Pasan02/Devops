"use client";

import { useMovieTracker } from "@/hooks/useMovieTracker";

export default function FeaturedSection() {
  const { addToWatchlist } = useMovieTracker();

  const featuredMovie = {
    id: 999,
    title: "John Wick 3: Parabellum",
    type: "Movie" as const,
    year: "2019",
    rating: 8.6,
    runtime: 130,
    description: "John Wick is on the run after killing a member of the international assassins' guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.",
    poster: "https://via.placeholder.com/400x600/1a1a1a/ffffff?text=John+Wick+3"
  };

  const handleAddToWatchlist = () => {
    addToWatchlist(featuredMovie);
  };

  return (
    <section className="relative bg-gray-900 text-white min-h-[500px] flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">{featuredMovie.title}</h1>
          
          {/* Movie Info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">IMDb</span>
              <span>{featuredMovie.rating * 10}/100</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-red-500">🍅</span>
              <span>97%</span>
            </div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {featuredMovie.description}
          </p>

          <button 
            onClick={handleAddToWatchlist}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded flex items-center space-x-2 transition-colors"
          >
            <span>▶</span>
            <span>WATCH TRAILER</span>
          </button>
        </div>

        {/* Featured Movie Image/Poster on the right */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="w-64 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
            <div className="w-48 h-72 bg-gray-800 rounded-lg flex items-center justify-center text-6xl">
              🎬
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
