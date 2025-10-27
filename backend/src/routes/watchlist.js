const express = require('express');
const {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  deleteWatchlistItem,
  getWatchlistItem,
  getWatchStats,
  toggleFavorite,
} = require('../controllers/watchlistController');

const authMiddleware = require('../middleware/auth');
const {
  validateWatchlistItem,
  validateUpdateWatchlistItem,
} = require('../middleware/validation');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Watchlist routes
router.route('/')
  .get(getWatchlist)
  .post(validateWatchlistItem, addToWatchlist);

router.route('/stats')
  .get(getWatchStats);

router.route('/:id')
  .get(getWatchlistItem)
  .put(validateUpdateWatchlistItem, updateWatchlistItem)
  .delete(deleteWatchlistItem);

router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
