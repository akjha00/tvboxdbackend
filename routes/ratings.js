const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const authenticate = require('../middleware/authMiddleware'); // your JWT middleware

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Required for Render's managed Postgres
  },
});

// GET ratings for a show
router.get('/show/:showId', async (req, res) => {
  const { showId } = req.params;
  try {
    const result = await pool.query(`
        SELECT ratings.*, users.username
        FROM ratings
        JOIN users ON ratings.user_id = users.id
        WHERE ratings.show_id = $1
        ORDER BY ratings.created_at DESC
    `, [showId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching ratings:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/ratings/user/:userId
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT r.*, s.title, s.id
         FROM ratings r
         JOIN tv_shows s ON r.show_id = s.id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching ratings:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// POST a new rating
router.post('/', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const { showId, rating, content } = req.body;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Rating must be between 1 and 10' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ratings (user_id, show_id, rating, review)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, show_id)
       DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review
       RETURNING *`,
      [userId, showId, rating, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error posting rating:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a rating
router.delete('/:id', authenticate, async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM ratings WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found or unauthorized' });
    }
    res.json({ message: 'Rating deleted', rating: result.rows[0] });
  } catch (err) {
    console.error('Error deleting rating:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;