const asyncHandler = require('express-async-handler');
const { Query } = require('ottoman');
const { Logger } = require('../config/logger');
const log = Logger.child({ namespace: 'searchController' });

const performSearch = asyncHandler(async (req, res) => {
    const { query } = req.body;

    // Validate the presence of query input
    if (!query || typeof query !== 'string') {
        log.debug('Invalid or missing search query');
        return res.status(400).json({ message: 'Search query is required and must be a string' });
    }

    log.debug(`Received search query: ${query}`);

    try {
        // Build the vector search query for Couchbase
        const couchbaseQuery = new Query(
            {
                where: {
                    embedding: {
                        $similarity: {
                            query: query,
                            metric: 'dot_product',
                        },
                    },
                },
                limit: 10,
            },
            'articles'
        ).build();

        log.debug(`Generated Couchbase query: ${couchbaseQuery}`);

        // Execute the query using Ottoman.js
        const ottoman = require('ottoman').getDefaultInstance();
        const { rows } = await ottoman.query(couchbaseQuery);

        // Structure and return results
        const results = rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
        }));

        return res.status(200).json({ results, count: results.length });
    } catch (error) {
        log.error(error, 'Error performing vector search');
        return res.status(500).json({ message: 'An error occurred while processing the search' });
    }
});

module.exports = { performSearch };