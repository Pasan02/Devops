import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage = "home" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
              🎬 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MovieTracker
              </span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className={`transition-colors ${
                  currentPage === "home" 
                    ? "text-purple-300 font-semibold" 
                    : "text-white hover:text-purple-300"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/watchlist" 
                className={`transition-colors ${
                  currentPage === "watchlist" 
                    ? "text-purple-300 font-semibold" 
                    : "text-white hover:text-purple-300"
                }`}
              >
                Watchlist
              </Link>
              <Link 
                href="/watched" 
                className={`transition-colors ${
                  currentPage === "watched" 
                    ? "text-green-300 font-semibold" 
                    : "text-white hover:text-purple-300"
                }`}
              >
                Watched
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-purple-500/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Built with Next.js & Tailwind CSS | Powered by TMDB API
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-purple-300 transition-colors">
                About
              </Link>
              <Link href="/privacy" className="hover:text-purple-300 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-purple-300 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
