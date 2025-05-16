const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const [showsResult, usersResult] = await Promise.all([
      pool.query(
        `SELECT id, title, 'show' AS type FROM tv_shows WHERE LOWER(title) LIKE LOWER($1) LIMIT 10`,
        [`%${query}%`]
      ),
      pool.query(
        `SELECT id, username, 'user' AS type FROM users WHERE LOWER(username) LIKE LOWER($1) LIMIT 10`,
        [`%${query}%`]
      )
    ]);

    const combinedResults = [...showsResult.rows, ...usersResult.rows];
    res.json(combinedResults);
  } catch (err) {
    console.error('Error in combined search:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/search/tv?query=...
router.get('/tv', async (req, res) => {
    const query = req.query.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
      const result = await pool.query(
        `SELECT * FROM tv_shows WHERE LOWER(title) LIKE LOWER($1) LIMIT 20`,
        [`%${query}%`]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error searching shows:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;