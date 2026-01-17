"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import SearchBar from "./SearchBar";

export default function Header() {
  const { isAuthenticated, userEmail, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">📺</span>
            </div>
            <span className="text-xl font-bold">MovieBox</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link href="/movies" className="hover:text-gray-300 transition-colors">
              Movies
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/watchlist" className="hover:text-gray-300 transition-colors">
                  Watchlist
                </Link>
                <Link href="/watched" className="hover:text-gray-300 transition-colors">
                  Watched
                </Link>
                <Link href="/profile" className="hover:text-gray-300 transition-colors">
                  Profile
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Welcome, {userEmail?.split('@')[0] || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
              >
                Sign in
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
