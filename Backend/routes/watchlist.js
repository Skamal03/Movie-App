const express = require('express');
const Watchlist = require('../models/watchlist');
const { authenticate } = require('../middleware/auth');
const router = express.Router();


router.post('/', authenticate, async (req, res) => {
  const { itemId, mediaType, title, posterPath, overview } = req.body;
  if (!itemId || !mediaType) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const existing = await Watchlist.findOne({ user: req.user.id, itemId, mediaType });
    if (existing) return res.status(409).json({ error: 'Already in watchlist' });

    const item = new Watchlist({ user: req.user.id, itemId, mediaType, title, posterPath, overview });
    await item.save();
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.user.id });
    const grouped = {
      movies: items.filter(i => i.mediaType === 'movie'),
      tvshows: items.filter(i => i.mediaType === 'tv')
    };
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});


router.delete('/:type/:id', authenticate, async (req, res) => {
  const { id, type } = req.params;

  try {
    const result = await Watchlist.deleteOne({
      user: req.user.id,
      itemId: Number(id),
      mediaType: type
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to remove' });
  }
});

module.exports = router;
