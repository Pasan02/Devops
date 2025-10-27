# Movie Tracker Backend API

A comprehensive REST API for managing movie and TV show watchlists with user authentication, TMDB integration, and detailed analytics.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and profile management
- **Watchlist Management**: Add, update, remove movies and TV shows from personal watchlists
- **TMDB Integration**: Real-time movie and TV show data from The Movie Database API
- **Analytics & Statistics**: Comprehensive user viewing statistics, genre preferences, and watch history
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Data Validation**: Input validation and sanitization for all endpoints

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **External API**: TMDB (The Movie Database)
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express Validator

## API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
GET  /api/auth/me          - Get current user profile
PUT  /api/auth/me          - Update user profile
PUT  /api/auth/updatepassword - Update password
POST /api/auth/logout      - Logout user
DELETE /api/auth/me        - Delete user account
```

### Movies & TV Shows
```
GET  /api/movies/search           - Search movies and TV shows
GET  /api/movies/trending         - Get trending content
GET  /api/movies/popular          - Get popular movies
GET  /api/movies/tv/popular       - Get popular TV shows
GET  /api/movies/movie/:id        - Get movie details
GET  /api/movies/tv/:id           - Get TV show details
GET  /api/movies/genres           - Get all genres
GET  /api/movies/discover/movie   - Discover movies with filters
GET  /api/movies/discover/tv      - Discover TV shows with filters
```

### Watchlist
```
GET    /api/watchlist          - Get user's watchlist
POST   /api/watchlist          - Add item to watchlist
GET    /api/watchlist/stats    - Get user's watch statistics
GET    /api/watchlist/:id      - Get specific watchlist item
PUT    /api/watchlist/:id      - Update watchlist item
DELETE /api/watchlist/:id      - Delete watchlist item
PATCH  /api/watchlist/:id/favorite - Toggle favorite status
```

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- MongoDB database
- TMDB API key

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment configuration**:
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

3. **Required environment variables**:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/movietracker
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # TMDB API
   TMDB_API_KEY=your-tmdb-api-key-here
   
   # CORS
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
   ```

4. **Get TMDB API Key**:
   - Visit [TMDB API](https://www.themoviedb.org/settings/api)
   - Register for an account
   - Request an API key
   - Add it to your `.env` file

5. **Start MongoDB**:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Docker container
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

6. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Schema

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  avatar: String,
  preferences: {
    favoriteGenres: [Number],
    preferredLanguage: String,
    notifications: Boolean
  },
  statistics: {
    totalWatched: Number,
    totalWatchTime: Number,
    moviesWatched: Number,
    tvShowsWatched: Number,
    currentStreak: Number,
    longestStreak: Number
  }
}
```

### WatchlistItem Model
```javascript
{
  user: ObjectId (ref: User),
  tmdbId: Number,
  mediaType: 'movie' | 'tv',
  title: String,
  overview: String,
  posterPath: String,
  status: 'watchlist' | 'watching' | 'watched' | 'dropped',
  userRating: Number (1-10),
  userReview: String,
  watchedDate: Date,
  progress: {
    currentEpisode: Number,
    currentSeason: Number,
    totalEpisodes: Number,
    totalSeasons: Number
  }
}
```

## Analytics Features

The API provides comprehensive analytics including:

- **User Statistics**: Total watched items, watch time, current/longest streaks
- **Genre Analysis**: Most watched genres with counts and percentages
- **Viewing Patterns**: Monthly/yearly viewing statistics
- **Recent Activity**: Timeline of recent watch activity
- **Progress Tracking**: TV show episode/season progress
- **Rating History**: User ratings and reviews

## Security Features

- **Rate Limiting**: Different limits for auth, search, and general API calls
- **Data Validation**: All inputs validated and sanitized
- **Password Security**: Bcrypt hashing with configurable salt rounds
- **JWT Security**: Secure token generation with expiration
- **CORS Protection**: Configurable origin restrictions
- **Helmet Integration**: Security headers for production

## Development

### Available Scripts
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm test           # Run test suite
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Project Structure
```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # MongoDB models
├── routes/          # Express routes
├── services/        # Business logic services
└── server.js        # Main server file
```

## API Testing

Test the API using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Search movies
curl "http://localhost:5000/api/movies/search?query=dune"
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use production MongoDB instance
3. Configure proper CORS origins
4. Set secure JWT secret
5. Enable HTTPS
6. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
