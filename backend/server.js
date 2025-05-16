const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(require('cors')());

// API constants
const API_KEY = process.env.API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Helper function to call TMDb API
const fetchFromTMDB = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

// Genre ID map
const genreMap = {
    action: 28,
    adventure: 12,
    comedy: 35,
    drama: 18,
    horror: 27,
    war: 10752,
};

// Discover movies by genre
app.get('/movies/discover/:genre', async (req, res) => {
    const genreId = genreMap[req.params.genre.toLowerCase()];
    if (!genreId) return res.status(400).json({ error: 'Invalid genre' });

    try {
        const page = req.query.page || 1;
        const url = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
        const data = await fetchFromTMDB(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies by genre' });
    }
});

// Top-rated movies
app.get('/movies/top-rated', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const url = `${TMDB_BASE}/movie/top_rated?api_key=${API_KEY}&page=${page}`;
        const data = await fetchFromTMDB(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top-rated movies' });
    }
});

// Movies Released This Year
app.get('/movies/this-year', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const currentYear = new Date().getFullYear();

        const url = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&primary_release_year=${currentYear}&sort_by=popularity.desc&page=${page}`;
        const data = await fetchFromTMDB(url);

        res.json(data);
    } catch (error) {
        console.error('Error fetching this year\'s movies:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies released this year' });
    }
});


// Trending movies (day/week)
app.get('/movies/trending/:timeframe', async (req, res) => {
    const { timeframe } = req.params;
    if (!['day', 'week'].includes(timeframe))
        return res.status(400).json({ error: 'Invalid timeframe' });

    try {
        const page = req.query.page || 1;
        const url = `${TMDB_BASE}/trending/movie/${timeframe}?api_key=${API_KEY}&page=${page}`;
        const data = await fetchFromTMDB(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
});

// Top-rated TV shows
app.get('/tv/top-rated', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const url = `${TMDB_BASE}/tv/top_rated?api_key=${API_KEY}&page=${page}`;
        const data = await fetchFromTMDB(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top-rated TV shows' });
    }
});

// Search movies (and TV) by query
app.get('/movies/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const url = `${TMDB_BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        const data = await fetchFromTMDB(url);
        res.json(data);
    } catch (error) {
        console.error('TMDB Search Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// Get movie details by ID
app.get('/movies/details/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const url = `${TMDB_BASE}/movie/${movieId}?api_key=${API_KEY}`;
        const data = await fetchFromTMDB(url);
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
