// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const showsRouter = require('./routes/shows');
const userRouter = require('./routes/users');
const watchlistRouter = require('./routes/watchlist');
const ratingsRouter = require('./routes/ratings');
const searchRouter = require('./routes/search')
;const socialRouter = require('./routes/social');
const profileRoutes = require('./routes/profile');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

// Mount the shows router at /api/shows
app.use('/api/shows', showsRouter);
app.use('/api/users', userRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/search', searchRouter);
app.use('/api/social', socialRouter);
app.use('/api/profile', profileRoutes);

// Health-check or other routes...
app.get('/', (req, res) => {
  res.send('TVBoxd backend is up');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});