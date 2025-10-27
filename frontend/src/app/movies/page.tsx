"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";
import { movieApi } from "@/lib/api";

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">("all");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating">("title");
  const [searchQuery, setSearchQuery] = useState("");

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load trending movies and TV shows
        const [trendingMovies, trendingTV] = await Promise.all([
          movieApi.getTrending('movie'),
          movieApi.getTrending('tv')
        ]);
        
        // Combine and format the data
        const combinedData: Movie[] = [
          ...(trendingMovies.data.results as any[]).slice(0, 10).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            type: "Movie" as const,
            year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : "Unknown",
            rating: Math.round(movie.rating * 10) / 10,
            poster: movie.posterPath || '',
            overview: movie.overview,
            genres: []
          })),
          ...(trendingTV.data.results as any[]).slice(0, 10).map((show: any) => ({
            id: show.id,
            title: show.title,
            type: "TV Show" as const,
            year: show.releaseDate ? new Date(show.releaseDate).getFullYear().toString() : "Unknown",
            rating: Math.round(show.rating * 10) / 10,
            poster: show.posterPath || '',
            overview: show.overview,
            genres: []
          }))
        ];
        
        setAllMovies(combinedData);
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // Reload initial data if search is cleared
      window.location.reload();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await movieApi.search(query);
      
      const formattedResults: Movie[] = (searchResults.data.results as any[])
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.mediaType === 'movie' ? "Movie" as const : "TV Show" as const,
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : "Unknown",
          rating: Math.round(item.rating * 10) / 10,
          poster: item.posterPath || '',
          overview: item.overview,
          genres: []
        }));
      
      setAllMovies(formattedResults);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Available genres
  const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller"];

  // Filter and sort movies based on user selections
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = allMovies;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by active tab
    if (activeTab !== "all") {
      filtered = filtered.filter(movie => {
        if (activeTab === "movies") return movie.type === "Movie";
        if (activeTab === "tv") return movie.type === "TV Show";
        return true;
      });
    }

    // Sort movies
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return parseInt(b.year) - parseInt(a.year);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [allMovies, searchQuery, activeTab, selectedGenres, sortBy]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading movies...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Movies & TV Shows</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore trending movies and TV shows, search for your favorites, and discover new content to add to your watchlist.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    handleSearch(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          {/* Content Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["all", "movies", "tv"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab === "all" ? "All" : tab === "movies" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "title" | "year" | "rating")}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Genres:</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : "All Movies & TV Shows"}
          </h2>
          <span className="text-gray-600">
            {filteredAndSortedMovies.length} {filteredAndSortedMovies.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Movies Grid */}
        {filteredAndSortedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                id={movie.id}
                title={movie.title}
                type={movie.type}
                year={movie.year}
                rating={movie.rating}
                poster={movie.poster}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No movies found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "No movies match your current filters"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
