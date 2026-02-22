# Movie & TV Show Tracker - Frontend

This directory contains the Next.js frontend for the Movie/TV Show Tracker application.

**For full project setup and running instructions, please refer to the [Root README](../README.md).**

## 🛠️ Local Development

To run the frontend independently:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  Navigate to `http://localhost:3000`.

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

## 🔮 Roadmap

- Comprehensive unit and E2E testing
- PWA support for offline access
- Enhanced social features

## 📄 License

This project is licensed under the MIT License.
