const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  
  next();
};

// User registration validation
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  handleValidationErrors,
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors,
];

// Watchlist item validation
const validateWatchlistItem = [
  body('tmdbId')
    .isInt({ min: 1 })
    .withMessage('TMDB ID must be a positive integer'),
  
  body('mediaType')
    .isIn(['movie', 'tv'])
    .withMessage('Media type must be either "movie" or "tv"'),
  
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('userRating')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('User rating must be between 1 and 10'),
  
  body('userReview')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review cannot be more than 1000 characters'),
  
  handleValidationErrors,
];

// Update watchlist item validation
const validateUpdateWatchlistItem = [
  body('status')
    .optional()
    .isIn(['watchlist', 'watching', 'watched', 'dropped'])
    .withMessage('Status must be one of: watchlist, watching, watched, dropped'),
  
  body('userRating')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('User rating must be between 1 and 10'),
  
  body('userReview')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review cannot be more than 1000 characters'),
  
  body('progress.currentEpisode')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Current episode must be a positive integer'),
  
  body('progress.currentSeason')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Current season must be a positive integer'),
  
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean'),
  
  handleValidationErrors,
];

// Search validation
const validateSearch = [
  body('query')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  body('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be between 1 and 1000'),
  
  handleValidationErrors,
];

// User profile update validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  body('preferences.favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array')
    .custom((genres) => {
      if (genres.some(id => !Number.isInteger(id) || id < 1)) {
        throw new Error('All genre IDs must be positive integers');
      }
      return true;
    }),
  
  body('preferences.preferredLanguage')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Preferred language must be 2-5 characters'),
  
  body('preferences.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications setting must be a boolean'),
  
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateWatchlistItem,
  validateUpdateWatchlistItem,
  validateSearch,
  validateProfileUpdate,
  handleValidationErrors,
};
