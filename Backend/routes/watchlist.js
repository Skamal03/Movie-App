// // Temporary in-memory store
// let watchlist = [];

// // Add movie to watchlist
// app.post('/watchlist', (req, res) => {
//     const movie = req.body;
//     if (!movie || !movie.id) {
//         return res.status(400).json({ error: 'Invalid movie data' });
//     }

//     // Prevent duplicates
//     if (!watchlist.find(item => item.id === movie.id)) {
//         watchlist.push(movie);
//     }

//     res.status(201).json({ message: 'Movie added to watchlist' });
// });

// // Get watchlist
// app.get('/watchlist', (req, res) => {
//     res.json(watchlist);
// });

// // Remove movie from watchlist (optional)
// app.delete('/watchlist/:id', (req, res) => {
//     const movieId = parseInt(req.params.id);
//     watchlist = watchlist.filter(item => item.id !== movieId);
//     res.json({ message: 'Movie removed from watchlist' });
// });