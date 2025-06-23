const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdb_id: { type: Number, required: true, unique: true },
  releaseDate: String,
  video_url: { type: String, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);