const axios = require('axios');
require('dotenv').config();

let cachedGenres = null;

async function fetchGenres() {
  if (cachedGenres) return cachedGenres;

  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/genre/tv/list',
      {
        params: {
            api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    const genreMap = {};
    response.data.genres.forEach(genre => {
      genreMap[genre.id] = genre.name;
    });

    cachedGenres = genreMap;
    return genreMap;
  } catch (err) {
    console.error('Failed to fetch genres from TMDb:', err.message);
    return {};
  }
}

/**
 * Maps a comma-separated string of genre IDs to a string of genre names.
 * Example: "18,10765" → "Drama, Sci-Fi & Fantasy"
 */
async function mapGenreIdsToNames(genreIdsInput) {
    const genreIds = Array.isArray(genreIdsInput)
    ? genreIdsInput
    : genreIdsInput.split(',').map(id => parseInt(id.trim()));

  const genreMap = await fetchGenres();
  const names = genreIds.map(id => genreMap[id]).filter(Boolean);
  return names.join(', ');
}

module.exports = { mapGenreIdsToNames };