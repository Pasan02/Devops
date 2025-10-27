# Movie & TV Show Tracker - Frontend

A modern, responsive web application built with Next.js and Tailwind CSS for tracking movies and TV shows.

## 🚀 Features

- **Search Functionality**: Search for movies and TV shows
- **Watchlist Management**: Add movies and shows to your personal watchlist
- **Watch History**: Track what you've already watched
- **Real-time Stats**: See your watchlist and viewing statistics
- **Trending Content**: Discover trending movies and TV shows
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks + Local Storage
- **Development**: Turbopack for fast development

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── watchlist/         # Watchlist page
│   ├── watched/           # Watch history page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Layout.tsx         # Shared layout component
│   ├── MovieCard.tsx      # Movie/show card component
│   ├── SearchBar.tsx      # Search functionality
│   ├── StatsCard.tsx      # Statistics display
│   └── TrendingSection.tsx # Trending content
├── hooks/                 # Custom React hooks
│   └── useMovieTracker.ts # Movie tracking logic
├── lib/                   # Utility functions
│   └── constants.ts       # App constants
└── types/                 # TypeScript type definitions
    └── index.ts           # Shared types
```

## 🎯 Key Components

### MovieCard
Reusable component for displaying movie/show information with interactive buttons for adding to watchlist, marking as watched, or removing.

### useMovieTracker Hook
Custom hook that manages:
- Watchlist state
- Watch history state
- Local storage persistence
- CRUD operations for movies/shows

### SearchBar
Interactive search component (ready for API integration).

### TrendingSection
Displays trending movies and shows with interactive cards.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Dark Theme**: Modern dark gradient background
- **Glassmorphism**: Translucent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Color Coding**: Purple for watchlist, green for watched items

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized typography scaling

## 🔮 Future Enhancements

- Integration with TMDB API for real movie data
- User authentication and profiles
- Search functionality with filters
- Movie ratings and reviews
- Social features (sharing lists)
- Offline support with PWA features

## 🐛 Known Issues

- Currently uses mock data (API integration pending)
- Search functionality is placeholder (to be implemented)
- No user authentication yet

## 📄 License

This project is part of a larger DevOps demonstration application showcasing modern web development and deployment practices.
