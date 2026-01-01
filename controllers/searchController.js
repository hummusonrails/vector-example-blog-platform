const asyncHandler = require('express-async-handler');
const { generateEmbedding } = require('../services/clients/openaiClient');
const { performSearch } = require('../services/search/performSearch');

const { Logger } = require('../config/logger');
const log = Logger.child({ namespace: 'searchController' });

exports.performSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    log.debug('Invalid or missing search query');
    return res.status(400).json({ message: 'Search query is required and must be a string' });
  }

  try {
    // 1) Embed the incoming text
    const queryEmbedding = await generateEmbedding(query);
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      return res.status(500).json({ message: 'Failed to generate embedding for query' });
    }

    // 2) Run vector search using your service (scoped index in Capella)
    const rows = await performSearch(queryEmbedding);

    // 3) Normalize a simple response
    const results = rows.map(row => ({
      id: row.id,
      score: row.similarityScore ?? row.score,
      title: row.title,
      description: row.description,
    }));

    return res.status(200).json({ results, count: results.length });
  } catch (error) {
    log.error(error, 'Error performing vector search');
    console.error('Error performing vector search:', error);
    return res.status(500).json({
      message: 'An error occurred while processing the search',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
});
