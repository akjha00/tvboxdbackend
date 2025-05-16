const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authMiddleware');

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /api/users/signup
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hash]
      );
      const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token: token, username: result.rows[0].username });
    } catch (err) {
      console.error('Register error:', err.message);
      res.status(400).json({ error: 'Username or email may already exist' });
    }
  });

// POST /api/users/login
router.post('/login', async (req, res) => {
const { identifier, password } = req.body; // identifier = email or username
try {
    const result = await pool.query(
    'SELECT * FROM users WHERE username = $1 OR email = $1',
    [identifier]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
} catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
}
});

// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error getting current user:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
