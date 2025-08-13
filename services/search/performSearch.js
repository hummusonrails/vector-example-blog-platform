'use strict';

const couchbase = require('couchbase'); 
require('dotenv').config();

const {
  DB_ENDPOINT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_BUCKET,
  DB_SCOPE = '_default',
  DB_VECTOR_INDEX,
  DB_VECTOR_FIELD = 'embedding',
} = process.env;

let cluster;

async function init() {
  if (!cluster) {
    cluster = await couchbase.connect(DB_ENDPOINT, {
      username: DB_USERNAME, 
      password: DB_PASSWORD, 
      configProfile: 'wanDevelopment',
    });
  }
  return cluster; 
}

/**
 * Perform similarity search using a Capella Vector Search index.
 * @param {number[]|Float32Array} queryEmbedding
 * @returns {Promise<Array<{id: string, score: number, title?: string, description?: string}>>}
 */
async function performSearch(queryEmbedding) {
  const cl = await init();

  if (!DB_BUCKET) throw new Error('DB_BUCKET not set');
  if (!DB_VECTOR_INDEX) throw new Error('DB_VECTOR_INDEX not set');

  const scope = cl.bucket(DB_BUCKET).scope(DB_SCOPE);

  // Build the vector search request
  const searchReq = couchbase.SearchRequest.create(
    couchbase.VectorSearch.fromVectorQuery(
      couchbase.VectorQuery.create(DB_VECTOR_FIELD, queryEmbedding)
        // tune if needed:
        // .numCandidates(100)
    )
  );

  const result = await scope.search(DB_VECTOR_INDEX, searchReq);

  // Normalize to what your controller expects: id + score
  const rows = result.rows.map(row => {
    // row.id is your document key. If your keys are prefixed like "embedding::",
    // strip it here. Otherwise, return as-is.
    const id = row.id.startsWith('embedding::') ? row.id.slice('embedding::'.length) : row.id;

    return {
      id,
      score: row.score,
      // include fields if you projected them in the index
      title: row.fields?.title,
      description: row.fields?.description,
    };
  });

  // Already ranked, but sort again just in case
  rows.sort((a, b) => b.score - a.score);

  return rows;
}

module.exports = { performSearch };
