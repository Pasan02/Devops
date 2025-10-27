const express = require('express');
const {
  searchMedia,
  getTrending,
  getPopularMovies,
  getPopularTV,
  getMovieDetails,
  getTVDetails,
  getGenres,
  discoverMovies,
  discoverTV,
} = require('../controllers/moviesController');

const { searchLimiter, apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all routes
router.use(apiLimiter);

// Search routes
router.get('/search', searchLimiter, searchMedia);

// Trending and popular
router.get('/trending', getTrending);
router.get('/popular', getPopularMovies);
router.get('/tv/popular', getPopularTV);

// Discovery
router.get('/discover/movie', discoverMovies);
router.get('/discover/tv', discoverTV);

// Details
router.get('/movie/:id', getMovieDetails);
router.get('/tv/:id', getTVDetails);

// Genres
router.get('/genres', getGenres);

module.exports = router;
