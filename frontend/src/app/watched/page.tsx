"use client";

import Header from "@/components/Header";
import { useMovieTracker } from "@/hooks/useMovieTracker";

export default function Watched() {
  const { watched, addToWatchlist, removeFromWatched, isLoading } = useMovieTracker();

  const handleAddToWatchlist = (movieId: number) => {
    const movie = watched.find(item => item.id === movieId);
    if (movie) {
      addToWatchlist(movie);
    }
  };

  const handleRemove = (movieId: number) => {
    removeFromWatched(movieId);
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
          <h1 className="text-4xl font-bold text-gray-900">Watch History</h1>
          <div className="text-gray-600">
            {watched.length} {watched.length === 1 ? "item" : "items"} watched
          </div>
        </div>

        {watched.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watched.map((item) => (
              <div key={item.id} className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Watched Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓ Watched
                  </span>
                </div>

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
                      onClick={() => handleAddToWatchlist(item.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                      Add to Watchlist
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
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <span className="bg-yellow-400 text-black px-1 py-0.5 rounded text-xs font-bold">IMDb</span>
                      <span>{(item.rating * 10).toFixed(0)}/100</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Watched: {new Date(item.watchedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No watched items yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start watching movies and TV shows from your watchlist and mark them as watched to see them here.
            </p>
            <a
              href="/watchlist"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-medium transition-colors"
            >
              View Watchlist
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
