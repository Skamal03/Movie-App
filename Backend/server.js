const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const logger = require('./middleware/logger');
app.use(logger);

// Routes
const movieRoutes = require('./routes/movies');
app.use('/movies', movieRoutes);

const streamRoutes = require('./routes/stream');
app.use('/stream', streamRoutes);

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const watchlist = require ('./routes/watchlist');
app.use('/api/watchlist', watchlist);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
