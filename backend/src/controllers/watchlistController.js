const mongoose = require('mongoose');
const WatchlistItem = require('../models/WatchlistItem');
const User = require('../models/User');
const tmdbService = require('../services/tmdbService');
const { asyncHandler, AppError } = require('../middleware/error');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 20, sort = '-addedDate' } = req.query;

  const query = { user: req.user.id };
  
  if (status) {
    if (!['watchlist', 'watching', 'watched', 'dropped'].includes(status)) {
      return next(new AppError('Invalid status filter', 400));
    }
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const items = await WatchlistItem.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName');

  const total = await WatchlistItem.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    },
  });
});

// @desc    Add item to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = asyncHandler(async (req, res, next) => {
  const { tmdbId, mediaType } = req.body;

  // Check if item already exists in user's watchlist
  const existingItem = await WatchlistItem.findOne({
    user: req.user.id,
    tmdbId,
    mediaType,
  });

  if (existingItem) {
    return next(new AppError('Item already exists in your watchlist', 400));
  }

  // Fetch details from TMDB
  let details;
  try {
    if (mediaType === 'movie') {
      details = await tmdbService.getMovieDetails(tmdbId);
    } else {
      details = await tmdbService.getTVDetails(tmdbId);
    }
  } catch (error) {
    console.error('TMDB API error:', error);
    return next(new AppError('Failed to fetch media details', 400));
  }

  // Create watchlist item
  const watchlistItem = await WatchlistItem.create({
    user: req.user.id,
    tmdbId,
    mediaType,
    title: details.title,
    overview: details.overview,
    posterPath: details.posterPath,
    backdropPath: details.backdropPath,
    releaseDate: details.releaseDate || details.firstAirDate,
    genres: details.genres?.map(g => g.id) || [],
    rating: details.rating,
    runtime: details.runtime || details.episodeRunTime,
    progress: mediaType === 'tv' ? {
      totalSeasons: details.numberOfSeasons,
      totalEpisodes: details.numberOfEpisodes,
    } : undefined,
    ...req.body, // Override with any additional fields from request
  });

  res.status(201).json({
    success: true,
    data: {
      item: watchlistItem,
    },
  });
});

// @desc    Update watchlist item
// @route   PUT /api/watchlist/:id
// @access  Private
const updateWatchlistItem = asyncHandler(async (req, res, next) => {
  let item = await WatchlistItem.findById(req.params.id);

  if (!item) {
    return next(new AppError('Watchlist item not found', 404));
  }

  // Make sure user owns the watchlist item
  if (item.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized to update this item', 401));
  }

  // If marking as watched, update user statistics
  if (req.body.status === 'watched' && item.status !== 'watched') {
    req.body.watchedDate = new Date();
    
    // Update user statistics
    const user = await User.findById(req.user.id);
    user.statistics.totalWatched += 1;
    user.statistics.totalWatchTime += item.watchTime || 0;
    
    if (item.mediaType === 'movie') {
      user.statistics.moviesWatched += 1;
    } else {
      user.statistics.tvShowsWatched += 1;
    }
    
    await user.save();
  }

  item = await WatchlistItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      item,
    },
  });
});

// @desc    Delete watchlist item
// @route   DELETE /api/watchlist/:id
// @access  Private
const deleteWatchlistItem = asyncHandler(async (req, res, next) => {
  const item = await WatchlistItem.findById(req.params.id);

  if (!item) {
    return next(new AppError('Watchlist item not found', 404));
  }

  // Make sure user owns the watchlist item
  if (item.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized to delete this item', 401));
  }

  await WatchlistItem.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Watchlist item deleted successfully',
  });
});

// @desc    Get watchlist item by ID
// @route   GET /api/watchlist/:id
// @access  Private
const getWatchlistItem = asyncHandler(async (req, res, next) => {
  const item = await WatchlistItem.findById(req.params.id);

  if (!item) {
    return next(new AppError('Watchlist item not found', 404));
  }

  // Make sure user owns the watchlist item
  if (item.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized to view this item', 401));
  }

  res.status(200).json({
    success: true,
    data: {
      item,
    },
  });
});

// @desc    Get user's watch statistics
// @route   GET /api/watchlist/stats
// @access  Private
const getWatchStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Get basic stats from WatchlistItem model
  const { statusStats, genreStats } = await WatchlistItem.getUserStats(userId);

  // Get recent activity
  const recentActivity = await WatchlistItem.getRecentActivity(userId, 10);

  // Get yearly stats
  const yearlyStats = await WatchlistItem.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        status: 'watched',
        watchedDate: { $exists: true },
      }
    },
    {
      $group: {
        _id: { $year: '$watchedDate' },
        count: { $sum: 1 },
        totalRuntime: { $sum: '$runtime' },
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 5 }
  ]);

  // Get monthly stats for current year
  const currentYear = new Date().getFullYear();
  const monthlyStats = await WatchlistItem.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        status: 'watched',
        watchedDate: {
          $gte: new Date(currentYear, 0, 1),
          $lt: new Date(currentYear + 1, 0, 1),
        },
      }
    },
    {
      $group: {
        _id: { $month: '$watchedDate' },
        count: { $sum: 1 },
        totalRuntime: { $sum: '$runtime' },
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get user's favorite genres (from user preferences and watch history)
  const user = await User.findById(userId);
  
  res.status(200).json({
    success: true,
    data: {
      statusStats,
      genreStats,
      recentActivity,
      yearlyStats,
      monthlyStats,
      userStats: user.statistics,
      favoriteGenres: user.preferences.favoriteGenres,
    },
  });
});

// @desc    Toggle favorite status
// @route   PATCH /api/watchlist/:id/favorite
// @access  Private
const toggleFavorite = asyncHandler(async (req, res, next) => {
  const item = await WatchlistItem.findById(req.params.id);

  if (!item) {
    return next(new AppError('Watchlist item not found', 404));
  }

  // Make sure user owns the watchlist item
  if (item.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized to update this item', 401));
  }

  item.isFavorite = !item.isFavorite;
  await item.save();

  res.status(200).json({
    success: true,
    data: {
      item,
    },
  });
});

module.exports = {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  deleteWatchlistItem,
  getWatchlistItem,
  getWatchStats,
  toggleFavorite,
};
