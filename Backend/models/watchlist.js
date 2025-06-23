const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true }, // Added
  title: String,
  posterPath: String,
  overview: String
});

watchlistSchema.index({ user: 1, itemId: 1, mediaType: 1 }, { unique: true }); // Prevent duplicates

module.exports = mongoose.model('Watchlist', watchlistSchema);
