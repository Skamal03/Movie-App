const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cors());

// mongo connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
const movieRoutes = require('./routes/movies');
app.use('/movies', movieRoutes);

const streamRoutes = require('./routes/stream');
app.use('/stream', streamRoutes);

const authRoutes = require('./routes/auth');
const logger = require('./middleware/logger');
app.use('/api', authRoutes);
app.use(logger);


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
