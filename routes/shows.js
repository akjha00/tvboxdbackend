const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// GET /api/shows?page=1&limit=20
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      'SELECT * FROM tv_shows ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching shows:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/shows/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tv_shows WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching show:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/shows
router.post('/', async (req, res) => {
  const { title, description, release_year } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tv_shows (title, description, release_year, watched) VALUES ($1, $2, $3, false) RETURNING *',
      [title, description || '', release_year || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding show:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/shows/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tv_shows WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json({ message: 'Show deleted', show: result.rows[0] });
  } catch (err) {
    console.error('Error deleting show:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;