# Movie/TV Show Tracker - Full Stack Application

A comprehensive movie and TV show tracking application built with modern technologies and DevOps best practices. This full-stack solution features a robust Node.js/Express backend with MongoDB and a responsive Next.js frontend.

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
- **State Management**: Custom React hooks
- **UI Components**: Clean, sophisticated design with responsive layouts

### Backend (Express.js)
- **Framework**: Express.js with Node.js 18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **External API**: TMDB (The Movie Database)
- **Security**: Helmet, CORS, rate limiting, input validation

### Infrastructure & DevOps
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose for local development
- **CI/CD**: Jenkins pipeline for automated testing and deployment
- **Infrastructure as Code**: Terraform for infrastructure provisioning
- **Web Server**: Nginx as a reverse proxy

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development without Docker)
- TMDB API Key (Get one from [The Movie Database](https://www.themoviedb.org/documentation/api))

### Quick Start (Docker Compose)

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd movie-tracker
    ```

2.  **Environment Setup:**
    Create a `.env` file in the root directory (or separate `.env` files in `backend/` and `frontend/` if running locally).
    
    Example `.env` configuration (see `backend/.env.example` for details):
    ```env
    MONGO_USER=admin
    MONGO_PASSWORD=password
    JWT_SECRET=your_secret_key
    TMDB_API_KEY=your_tmdb_api_key
    ```

3.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    
    The services will enable:
    - **Frontend**: http://localhost:3000
    - **Backend API**: http://localhost:5000
    - **MongoDB**: localhost:27017

### Manual Local Development

If you prefer to run services individually:

#### Backend
1.  Navigate to `backend/`
2.  Install dependencies: `npm install`
3.  Set up `.env` file with MongoDB URI and TMDB Key.
4.  Run server: `npm run dev`

#### Frontend
1.  Navigate to `frontend/`
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`

## 📚 API Documentation

The backend exposes a RESTful API. Key endpoints include:

-   **Auth**: `/api/auth/register`, `/api/auth/login`
-   **Movies**: `/api/movies/search`, `/api/movies/trending`
-   **Watchlist**: `/api/watchlist`, `/api/watchlist/:id`

See [backend/README.md](backend/README.md) for detailed API documentation if needed.

## 📂 Project Structure

```
.
├── backend/            # Express.js API
├── frontend/           # Next.js Frontend
├── docker-compose.yml  # Container orchestration
├── Jenkinsfile         # CI/CD Pipeline pipeline
├── terraform/          # Infrastructure provisioning
└── nginx/              # Nginx configuration
```

## 🔐 Security Features

- **JWT Authentication**: Secure stateless authentication
- **Password Hashing**: Bcrypt for password storage
- **Rate Limiting**: Protection against brute-force attacks
- **Data Validation**: Input sanitization using express-validator

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


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
