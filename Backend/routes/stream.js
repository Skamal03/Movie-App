const express = require('express');
const router = express.Router();
const path = require('path');
const Movie = require('../models/streammodel');  
const { authenticate, isAdmin } = require('../middleware/auth');  



router.post('/add', authenticate, isAdmin, async (req, res) => {
  try {
    const { tmdb_id, releaseDate, video_url } = req.body;

    if (!tmdb_id || !video_url) {
      return res.status(400).json({ error: 'tmdb_id and video_url are required' });
    }

    const movie = new Movie({ tmdb_id, releaseDate, video_url });
    await movie.save();

    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    console.error('Add movie error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Movie with this TMDB ID already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:tmdb_id', async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdb_id: req.params.tmdb_id });
    if (!movie) return res.status(404).send('Movie not found');

    const filePath = path.join(__dirname, '..', 'movies', path.basename(movie.video_url));
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Streaming error');
  }
});

module.exports = router;
