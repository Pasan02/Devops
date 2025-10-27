const mongoose = require('mongoose');

const WatchlistItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  tmdbId: {
    type: Number,
    required: true,
  },
  
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: true,
  },
  
  title: {
    type: String,
    required: true,
  },
  
  overview: String,
  
  posterPath: String,
  
  backdropPath: String,
  
  releaseDate: String,
  
  genres: [Number], // TMDB genre IDs
  
  rating: Number, // TMDB rating
  
  runtime: Number, // in minutes
  
  status: {
    type: String,
    enum: ['watchlist', 'watching', 'watched', 'dropped'],
    default: 'watchlist',
  },
  
  userRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  
  userReview: String,
  
  watchedDate: Date,
  
  addedDate: {
    type: Date,
    default: Date.now,
  },
  
  progress: {
    currentEpisode: {
      type: Number,
      default: 1,
    },
    currentSeason: {
      type: Number,
      default: 1,
    },
    totalEpisodes: Number,
    totalSeasons: Number,
  },
  
  tags: [String],
  
  isFavorite: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
WatchlistItemSchema.index({ user: 1, status: 1 });
WatchlistItemSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });
WatchlistItemSchema.index({ user: 1, genres: 1 });
WatchlistItemSchema.index({ user: 1, addedDate: -1 });
WatchlistItemSchema.index({ user: 1, watchedDate: -1 });

// Virtual for watch time calculation
WatchlistItemSchema.virtual('watchTime').get(function() {
  if (this.mediaType === 'movie') {
    return this.runtime || 0;
  } else if (this.mediaType === 'tv' && this.status === 'watched') {
    const episodesWatched = this.progress.currentEpisode || 0;
    const avgEpisodeRuntime = this.runtime || 45; // Default TV episode runtime
    return episodesWatched * avgEpisodeRuntime;
  }
  return 0;
});

// Method to mark as watched
WatchlistItemSchema.methods.markAsWatched = function(userRating, review) {
  this.status = 'watched';
  this.watchedDate = new Date();
  if (userRating) this.userRating = userRating;
  if (review) this.userReview = review;
  return this.save();
};

// Static method to get user's watch statistics
WatchlistItemSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRuntime: { $sum: '$runtime' },
      }
    }
  ]);

  const genreStats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'watched' } },
    { $unwind: '$genres' },
    {
      $group: {
        _id: '$genres',
        count: { $sum: 1 },
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return { statusStats: stats, genreStats };
};

// Static method to get user's recent activity
WatchlistItemSchema.statics.getRecentActivity = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('title mediaType status watchedDate addedDate userRating');
};

module.exports = mongoose.model('WatchlistItem', WatchlistItemSchema);
