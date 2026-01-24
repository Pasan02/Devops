"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { movieApi, getImageUrl } from "@/lib/api";
import { Movie } from "@/types";
import Link from "next/link";
import { useMovieTracker } from "@/hooks/useMovieTracker";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { addToWatchlist, markAsWatched, isInWatchlist, isWatched } = useMovieTracker();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await movieApi.search(searchQuery, 1);
        
        const formattedResults: Movie[] = (response.data.results as any[])
          .slice(0, 5) // Take top 5 for dropdown
          .map((item: any) => ({
            id: item.id,
            title: item.title || item.name, // TMDB returns 'name' for TV
            type: item.mediaType === 'movie' ? "Movie" : "TV Show",
            year: (item.releaseDate || item.firstAirDate) ? new Date(item.releaseDate || item.firstAirDate).getFullYear().toString() : "Unknown",
            rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : 0,
            poster: getImageUrl(item.poster_path, 'w200'),
            overview: item.overview,
          }));

        setResults(formattedResults);
        setTotalResults(response.data.totalResults);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/movies?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={searchRef} className="w-full relative">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            placeholder="Search..."
            className="w-full px-4 py-2 text-base bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-full focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white placeholder-gray-300 transition-all duration-300 pr-24"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-full transition-all duration-200 font-medium text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden z-50">
          <ul>
            {results.map((item) => {
              const inWatchlist = isInWatchlist(item.id);
              const watched = isWatched(item.id);

              return (
              <li key={`${item.type}-${item.id}`} className="flex items-center justify-between border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors group">
                <Link 
                  href={item.type === "Movie" ? `/movie/${item.id}` : `/tv/${item.id}`}
                  onClick={handleItemClick}
                  className="flex items-center gap-4 p-4 flex-1 min-w-0"
                >
                  <img 
                    src={item.poster} 
                    alt={item.title} 
                    className="w-12 h-16 object-cover rounded shadow-sm bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{item.year}</span>
                      <span className="flex items-center gap-1 text-yellow-500 ml-2">
                        ⭐ {item.rating}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2 px-4">
                  {!watched && !inWatchlist && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToWatchlist(item);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-full text-lg shadow-lg font-bold"
                      title="Add to Watchlist"
                    >
                      +
                    </button>
                  )}
                  
                  {!watched && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        markAsWatched(item);
                      }}
                       className="w-8 h-8 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full text-lg shadow-lg"
                      title="Mark as Watched"
                    >
                      ✓
                    </button>
                  )}

                  {watched && (
                    <span className="text-green-500 text-xs font-medium px-2 bg-green-900/30 py-1 rounded">Watched</span>
                  )}
                </div>
              </li>
              );
            })}
            <li className="p-3 bg-purple-500/10 hover:bg-purple-500/20 text-center transition-colors">
              <button
                onClick={handleSearch}
                className="text-purple-300 font-medium hover:text-white w-full h-full"
              >
                View all {totalResults} results
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
