# Movie/TV Show Tracker - Full Stack Application

A comprehensive movie and TV show tracking application built with modern technologies and DevOps best practices.

## 🎯 Project Overview

This full-stack application allows users to:
- Search and discover movies/TV shows using TMDB API
- Track personal watchlists and viewing history
- Get detailed analytics on viewing habits
- Manage user profiles with personalized recommendations
- View comprehensive statistics and insights

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: Custom React hooks with localStorage
- **UI Components**: Clean, sophisticated design with responsive layouts

### Backend (Express.js)
- **Framework**: Express.js with Node.js 18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **External API**: TMDB (The Movie Database)
- **Security**: Helmet, CORS, rate limiting, input validation

### Key Features Implemented

#### 🎬 **Movie & TV Show Management**
- Search functionality with TMDB integration
- Trending and popular content discovery
- Detailed movie/TV show information pages
- Genre-based filtering and discovery

#### 👤 **User Management**
- User registration and authentication
- Profile management with preferences
- Secure password handling with bcrypt
- JWT token-based sessions

#### 📊 **Comprehensive Analytics Dashboard**
- **Watch Statistics**: Total watched items, watch time, current/longest streaks
- **Genre Analysis**: Most watched genres with counts and percentages
- **Viewing Patterns**: Monthly/yearly viewing statistics with visual charts
- **Recent Activity**: Timeline of recent watch activity
- **Progress Tracking**: TV show episode/season progress
- **Rating History**: User ratings and reviews

#### 🎯 **Watchlist Features**
- Add movies/TV shows to personal watchlist
- Mark items as watching, watched, or dropped
- Rate and review watched content
- Track viewing progress for TV shows
- Favorite items management

## 📁 Project Structure

```
/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── movie/       # Movie detail pages
│   │   │   ├── movies/      # All movies page with filters
│   │   │   ├── profile/     # User profile & analytics
│   │   │   └── tv/          # TV show detail pages
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript definitions
│   └── package.json
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic services
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Main server file
│   └── package.json
│
├── docker-compose.yml        # Production Docker setup
├── docker-compose.dev.yml    # Development Docker setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or cloud)
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))

### Development Setup

1. **Clone and setup**:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

2. **Configure backend environment**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your TMDB API key
   ```

3. **Start MongoDB**:
   ```bash
   # Local MongoDB
   mongod
   
   # Or Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1: Backend (http://localhost:5000)
   cd backend
   npm run dev
   
   # Terminal 2: Frontend (http://localhost:3001)
   cd frontend
   npm run dev
   ```

### Docker Setup

1. **Development with Docker**:
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up
   
   # Access:
   # Frontend: http://localhost:3001
   # Backend: http://localhost:5000
   # MongoDB: localhost:27017
   ```

2. **Production with Docker**:
   ```bash
   # Build and start
   docker-compose up -d
   
   # Access:
   # Frontend: http://localhost:3000
   # Backend: http://localhost:5000
   ```

## 🌟 Key Features Showcase

### 1. **Sophisticated User Profile Dashboard**
- **Overview Tab**: Watch status overview, time statistics, monthly activity charts
- **Analytics Tab**: Yearly comparisons, genre distribution with visual charts
- **Activity Tab**: Recent viewing activity timeline
- **Preferences Tab**: Favorite genres, notification settings

### 2. **Advanced Movie/TV Show Discovery**
- **Search**: Real-time search across TMDB database
- **Filters**: By type, year, rating, genre
- **Sorting**: By popularity, rating, release date
- **Details**: Comprehensive movie/TV show information pages

### 3. **Comprehensive Watchlist Management**
- **Multiple Status**: Watchlist, watching, watched, dropped
- **Progress Tracking**: Episode/season tracking for TV shows
- **Ratings & Reviews**: Personal rating system with reviews
- **Favorites**: Mark items as favorites

### 4. **Data Analytics & Insights**
- **Watch Time Statistics**: Total time watched, average per item
- **Genre Preferences**: Visual breakdown of favorite genres
- **Viewing Patterns**: Monthly/yearly viewing trends
- **Streak Tracking**: Current and longest viewing streaks

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
GET  /api/auth/me           # Get user profile
PUT  /api/auth/me           # Update profile
PUT  /api/auth/updatepassword # Change password
```

### Movies & TV Shows
```
GET  /api/movies/search      # Search content
GET  /api/movies/trending    # Trending content
GET  /api/movies/popular     # Popular movies
GET  /api/movies/tv/popular  # Popular TV shows
GET  /api/movies/movie/:id   # Movie details
GET  /api/movies/tv/:id      # TV show details
GET  /api/movies/genres      # All genres
```

### Watchlist & Analytics
```
GET    /api/watchlist        # Get user watchlist
POST   /api/watchlist        # Add to watchlist
PUT    /api/watchlist/:id    # Update item
DELETE /api/watchlist/:id    # Remove item
GET    /api/watchlist/stats  # User analytics
```

## 🎨 Design Philosophy

The application follows a **"simple and sophisticated"** design approach:

- **Clean White UI**: Professional appearance with minimal visual clutter
- **Consistent Color Scheme**: Red accents (#dc2626) for branding consistency
- **Responsive Design**: Optimized for all screen sizes
- **Intuitive Navigation**: Clear information hierarchy and easy-to-use interfaces
- **Accessibility**: Proper labels, semantic HTML, keyboard navigation

## 📊 Analytics Features

### User Statistics Dashboard
- **Total Items Watched**: Movies + TV shows combined
- **Watch Time**: Total hours/minutes spent watching
- **Current Streak**: Consecutive days of watching activity
- **Genre Breakdown**: Visual representation of favorite genres
- **Monthly Activity**: Charts showing viewing patterns over time
- **Yearly Comparisons**: Year-over-year viewing statistics

### Insights Provided
- **Viewing Habits**: Peak viewing times and patterns
- **Genre Preferences**: Most and least watched genres
- **Content Type Balance**: Movies vs TV shows ratio
- **Rating Patterns**: Average ratings and rating distribution
- **Progress Tracking**: TV show completion rates

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive validation for all endpoints
- **CORS Protection**: Configurable origin restrictions
- **Security Headers**: Helmet.js integration

## 🛠️ Technology Stack

### Frontend
- Next.js 15 (React 18)
- TypeScript
- Tailwind CSS 4
- Custom React Hooks

### Backend
- Node.js 18+
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- TMDB API Integration

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Volume persistence
- Network isolation

## 📈 Performance Optimizations

- **Frontend**: Next.js optimizations, image optimization, lazy loading
- **Backend**: Connection pooling, query optimization, caching headers
- **Database**: Proper indexing, aggregation pipelines
- **Docker**: Multi-stage builds, optimized images

## 🔮 Future Enhancements

- **Real-time Features**: WebSocket integration for live updates
- **Advanced Analytics**: ML-based recommendations
- **Social Features**: Friend connections, shared watchlists
- **Mobile App**: React Native implementation
- **CI/CD Pipeline**: GitHub Actions integration
- **Monitoring**: Prometheus + Grafana setup
- **Caching**: Redis implementation
- **Search**: Elasticsearch integration

## 📝 Getting TMDB API Key

1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings > API
4. Request an API key
5. Add it to your `.env` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using modern web technologies and DevOps best practices**



**Docker Command for database

docker exec -it movietracker-mongodb mongosh mongodb://admin:password123@localhost:27017/movietracker?authSource=admin

db.users.find().pretty()