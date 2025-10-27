"use client";

import Header from "@/components/Header";
import TrendingSlider from "@/components/TrendingSlider";
import FeaturedSection from "@/components/FeaturedSection";
import MovieGrid from "@/components/MovieGrid";
import { useMovieTracker } from "@/hooks/useMovieTracker";

export default function Home() {
  const { isLoading } = useMovieTracker();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Main Hero/Featured Section */}
      <FeaturedSection />
      
      {/* Trending Slider */}
      <TrendingSlider />
      
      {/* Featured Movies Grid */}
      <MovieGrid />
    </div>
  );
}
