const tmdbService = require('../services/tmdbService');
const { asyncHandler, AppError } = require('../middleware/error');

// @desc    Search movies and TV shows
// @route   GET /api/movies/search
// @access  Public
const searchMedia = asyncHandler(async (req, res, next) => {
  const { query, page = 1 } = req.query;

  if (!query) {
    return next(new AppError('Search query is required', 400));
  }

  const results = await tmdbService.search(query, parseInt(page));

  res.status(200).json({
    success: true,
    data: results,
  });
});

// @desc    Get trending movies and TV shows
// @route   GET /api/movies/trending
// @access  Public
const getTrending = asyncHandler(async (req, res, next) => {
  const { media_type = 'all', time_window = 'day' } = req.query;

  const results = await tmdbService.getTrending(media_type, time_window);

  res.status(200).json({
    success: true,
    data: {
      results,
      media_type,
      time_window,
    },
  });
});

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = asyncHandler(async (req, res, next) => {
  const { page = 1 } = req.query;

  const results = await tmdbService.getPopularMovies(parseInt(page));

  res.status(200).json({
    success: true,
    data: results,
  });
});

// @desc    Get popular TV shows
// @route   GET /api/movies/tv/popular
// @access  Public
const getPopularTV = asyncHandler(async (req, res, next) => {
  const { page = 1 } = req.query;

  const results = await tmdbService.getPopularTV(parseInt(page));

  res.status(200).json({
    success: true,
    data: results,
  });
});

// @desc    Get movie details
// @route   GET /api/movies/movie/:id
// @access  Public
const getMovieDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return next(new AppError('Valid movie ID is required', 400));
  }

  const movie = await tmdbService.getMovieDetails(parseInt(id));

  res.status(200).json({
    success: true,
    data: {
      movie,
    },
  });
});

// @desc    Get TV show details
// @route   GET /api/movies/tv/:id
// @access  Public
const getTVDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return next(new AppError('Valid TV show ID is required', 400));
  }

  const tvShow = await tmdbService.getTVDetails(parseInt(id));

  res.status(200).json({
    success: true,
    data: {
      tvShow,
    },
  });
});

// @desc    Get genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = asyncHandler(async (req, res, next) => {
  const genres = await tmdbService.getGenres();

  res.status(200).json({
    success: true,
    data: {
      genres,
    },
  });
});

// @desc    Discover movies with filters
// @route   GET /api/movies/discover/movie
// @access  Public
const discoverMovies = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    sort_by = 'popularity.desc',
    with_genres,
    primary_release_year,
    'vote_average.gte': voteAverageGte,
    'vote_average.lte': voteAverageLte,
  } = req.query;

  try {
    const params = {
      page: parseInt(page),
      sort_by,
    };

    if (with_genres) params.with_genres = with_genres;
    if (primary_release_year) params.primary_release_year = primary_release_year;
    if (voteAverageGte) params['vote_average.gte'] = voteAverageGte;
    if (voteAverageLte) params['vote_average.lte'] = voteAverageLte;

    const response = await tmdbService.client.get('/discover/movie', { params });
    
    const results = {
      results: tmdbService.formatResults(response.data.results, 'movie'),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Discover movies error:', error);
    return next(new AppError('Failed to discover movies', 500));
  }
});

// @desc    Discover TV shows with filters
// @route   GET /api/movies/discover/tv
// @access  Public
const discoverTV = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    sort_by = 'popularity.desc',
    with_genres,
    first_air_date_year,
    'vote_average.gte': voteAverageGte,
    'vote_average.lte': voteAverageLte,
  } = req.query;

  try {
    const params = {
      page: parseInt(page),
      sort_by,
    };

    if (with_genres) params.with_genres = with_genres;
    if (first_air_date_year) params.first_air_date_year = first_air_date_year;
    if (voteAverageGte) params['vote_average.gte'] = voteAverageGte;
    if (voteAverageLte) params['vote_average.lte'] = voteAverageLte;

    const response = await tmdbService.client.get('/discover/tv', { params });
    
    const results = {
      results: tmdbService.formatResults(response.data.results, 'tv'),
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Discover TV shows error:', error);
    return next(new AppError('Failed to discover TV shows', 500));
  }
});

module.exports = {
  searchMedia,
  getTrending,
  getPopularMovies,
  getPopularTV,
  getMovieDetails,
  getTVDetails,
  getGenres,
  discoverMovies,
  discoverTV,
};
