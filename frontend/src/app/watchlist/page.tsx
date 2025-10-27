"use client";

import Header from "@/components/Header";
import { useMovieTracker } from "@/hooks/useMovieTracker";

export default function Watchlist() {
  const { watchlist, markAsWatched, removeFromWatchlist, isLoading } = useMovieTracker();

  const handleMarkWatched = (movieId: number) => {
    const movie = watchlist.find(item => item.id === movieId);
    if (movie) {
      markAsWatched(movie);
    }
  };

  const handleRemove = (movieId: number) => {
    removeFromWatchlist(movieId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Watchlist</h1>
          <div className="text-gray-600">
            {watchlist.length} {watchlist.length === 1 ? "item" : "items"}
          </div>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map((item) => (
              <div key={item.id} className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Movie Poster */}
                <div className="aspect-[2/3] overflow-hidden">
                  <img 
                    src={item.poster} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleMarkWatched(item.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                      ✓ Mark Watched
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {item.type} • {item.year}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span className="bg-yellow-400 text-black px-1 py-0.5 rounded text-xs font-bold">IMDb</span>
                      <span>{(item.rating * 10).toFixed(0)}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your watchlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding movies and TV shows to your watchlist to keep track of what you want to watch.
            </p>
            <a
              href="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-medium transition-colors"
            >
              Discover Movies & Shows
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
