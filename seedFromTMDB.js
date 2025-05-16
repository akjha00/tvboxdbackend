require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');
const { mapGenreIdsToNames } = require('./utils/mapGenres');

// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database:process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// Function to fetch and insert shows
const fetchAndStoreShows = async () => {
  try {
    for (let page = 3; page <= 500; page++) { // Fetch 5 pages (100 shows)
      console.log(`📄 Fetching page ${page}...`);
      const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
          page: page,
        },
      });

      const shows = response.data.results;

      for (const show of shows) {
        const { name, overview, id, first_air_date, poster_path, genre_ids } = show;
        const date = new Date(first_air_date);
        const year = date.getFullYear();
        const genres = await mapGenreIdsToNames(genre_ids);

        // Skip if title or description is missing
        if (!name || !overview || !id || !first_air_date || !poster_path || !genre_ids) continue;

        // Check for duplicates
        const existing = await pool.query(
          'SELECT * FROM tv_shows WHERE title = $1',
          [name]
        );
        if (existing.rows.length > 0) continue;

        // Insert into database
        await pool.query(
          'INSERT INTO tv_shows (title, description, tmdb_id, release_year, poster_url, genre) VALUES ($1, $2, $3, $4, $5, $6)',
          [name, overview, id, year, poster_path, genres]
        );

        console.log(`✅ Inserted: ${name}`);
      }
    }

    console.log('🎉 Done seeding shows from TMDB');
  } catch (err) {
    console.error('❌ Error fetching or inserting shows:', err.message);
  } finally {
    await pool.end();
  }
};

// Run it
fetchAndStoreShows();