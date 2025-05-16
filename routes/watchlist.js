const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const authenticate = require('../middleware/authMiddleware');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
  });

router.use(authenticate);

// GET /api/watchlist
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tv_shows.*
       FROM tv_shows
       JOIN watchlist ON tv_shows.id = watchlist.show_id
       WHERE watchlist.user_id = $1 AND watchlist.status = true`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Could not fetch watchlist' });
  }
});

// POST /api/watchlist/:showId
router.post('/:showId', authenticate, async (req, res) => {
    const { showId } = req.params;
    const { current_season = 1, current_episode = 1, status = "watching"} = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO watchlist (user_id, show_id, status, current_season, current_episode)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, show_id)
         DO UPDATE SET 
           current_season = EXCLUDED.current_season,
           current_episode = EXCLUDED.current_episode
         RETURNING *`,
        [req.user.userId, showId, status, current_season, current_episode]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Could not update watchlist' });
    }
});

// DELETE /api/watchlist/:showId
router.delete('/:showId', authenticate, async (req, res) => {
  const { showId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM watchlist WHERE user_id = $1 AND show_id = $2 RETURNING *`,
      [req.user.userId, showId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Show not in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Could not remove from watchlist' });
  }
});

// PATCH /api/watchlist/:showId
router.patch('/:showId', authenticate, async (req, res) => {
    const { showId } = req.params;
    const { current_season, current_episode } = req.body;
  
    if (current_season == null && current_episode == null) {
      return res.status(400).json({ error: 'No updates provided' });
    }
  
    const fields = [];
    const values = [req.user.userId, showId];
    let index = 3;
  
    if (current_season != null) {
      fields.push(`current_season = $${index++}`);
      values.push(current_season);
    }
  
    if (current_episode != null) {
      fields.push(`current_episode = $${index}`);
      values.push(current_episode);
    }
  
    const query = `
      UPDATE watchlist
      SET ${fields.join(', ')}
      WHERE user_id = $1 AND show_id = $2
      RETURNING *;
    `;
  
    try {
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Watchlist entry not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating progress:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;