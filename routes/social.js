const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const authenticate = require('../middleware/authMiddleware'); // your auth middleware

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// Follow a user
router.post('/follow/:userId', authenticate, async (req, res) => {
  const followerId = req.user.userId;
  const followingId = parseInt(req.params.userId);

  if (followerId === followingId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  try {
    await pool.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [followerId, followingId]
    );
    res.json({ message: 'Followed user' });
  } catch (err) {
    console.error('Follow error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Unfollow
router.delete('/unfollow/:userId', authenticate, async (req, res) => {
  const followerId = req.user.userId;
  const followingId = parseInt(req.params.userId);

  try {
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [followerId, followingId]
    );
    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    console.error('Unfollow error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get following list
router.get('/following/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const result = await pool.query(
      `SELECT u.id, u.username FROM follows f JOIN users u ON f.following_id = u.id WHERE f.follower_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching following:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get followers
router.get('/followers/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const result = await pool.query(
      `SELECT u.id, u.username FROM follows f JOIN users u ON f.follower_id = u.id WHERE f.following_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching followers:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Activity feed: recent ratings + watchlist updates from followed users
router.get('/feed', authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `
      SELECT u.username, r.rating, r.review, s.title, r.created_at, s.id, p.avatar_url
      FROM follows f
      JOIN ratings r ON f.following_id = r.user_id
      JOIN users u ON u.id = r.user_id
      JOIN profiles p on p.user_id = r.user_id
      JOIN tv_shows s ON s.id = r.show_id
      WHERE f.follower_id = $1
      ORDER BY r.created_at DESC
      LIMIT 20
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Feed error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;