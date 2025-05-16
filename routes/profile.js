const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const authenticate = require('../middleware/authMiddleware');

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// Get current user's profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update current user's profile
router.patch('/', authenticate, async (req, res) => {
  const { username, bio, avatar_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE profiles 
       SET username = COALESCE($1, username),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url)
       WHERE user_id = $4
       RETURNING *`,
      [username, bio, avatar_url, req.user.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/profile (only if profile doesn't already exist)
router.post('/', authenticate, async (req, res) => {
    const { username, bio, avatar_url } = req.body;
  
    try {
      const exists = await pool.query(
        'SELECT * FROM profiles WHERE user_id = $1',
        [req.user.userId]
      );
  
      if (exists.rows.length > 0) {
        return res.status(400).json({ error: 'Profile already exists' });
      }
  
      const result = await pool.query(
        `INSERT INTO profiles (user_id, username, bio, avatar_url)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.user.userId, username, bio || '', avatar_url || '']
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creating profile:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a public profile by username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;