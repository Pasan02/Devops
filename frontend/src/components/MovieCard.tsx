"use client";

import { getImageUrl } from "@/lib/api";

interface MovieCardProps {
  id: number;
  title: string;
  type: "Movie" | "TV Show";
  year: string;
  rating: number;
  poster: string;
  isWatched?: boolean;
  isInWatchlist?: boolean;
  watchedDate?: string;
  onAddToWatchlist?: (id: number) => void;
  onMarkWatched?: (id: number) => void;
  onRemove?: (id: number) => void;
}

export default function MovieCard({
  id,
  title,
  type,
  year,
  rating,
  poster,
  isWatched = false,
  isInWatchlist = false,
  watchedDate,
  onAddToWatchlist,
  onMarkWatched,
  onRemove
}: Readonly<MovieCardProps>) {
  
  const handleAddToWatchlist = () => {
    onAddToWatchlist?.(id);
  };

  const handleMarkWatched = () => {
    onMarkWatched?.(id);
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  const borderColor = isWatched 
    ? "border-green-500/20 hover:border-green-400/50" 
    : "border-purple-500/20 hover:border-purple-400/50";

  return (
    <div className={`bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden ${borderColor} transition-all duration-300 group`}>
      <div className="relative">
        <img 
          src={poster ? getImageUrl(poster, 'w400') : '/placeholder-movie.jpg'} 
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        {isWatched && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            ✅ Watched
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
          {!isWatched && !isInWatchlist && onAddToWatchlist && (
            <button
              onClick={handleAddToWatchlist}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              + Add to Watchlist
            </button>
          )}
          
          {isInWatchlist && !isWatched && onMarkWatched && (
            <button
              onClick={handleMarkWatched}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              ✅ Mark Watched
            </button>
          )}
          
          {isWatched && !isInWatchlist && onAddToWatchlist && (
            <button
              onClick={handleAddToWatchlist}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              📋 Add to Watchlist
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              🗑️ Remove
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-white font-semibold text-lg mb-1 line-clamp-1">{title}</h4>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className={isWatched ? "text-green-300" : "text-purple-300"}>
            {type} • {year}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        </div>
        {watchedDate && (
          <div className="text-xs text-gray-400">
            Watched: {new Date(watchedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
