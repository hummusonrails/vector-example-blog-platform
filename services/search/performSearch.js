const couchbase = require('couchbase'); 
require('dotenv').config();

let cluster;
async function init() {
    if (!cluster) {
        cluster = await couchbase.connect(process.env.COUCHBASE_URL, {
            username: process.env.COUCHBASE_USERNAME, 
            password: process.env.COUCHBASE_PASSWORD, 
            configProfile: "wanDevelopment",
        }); 
    }
    return cluster; 
}

/**
     * Perform similarity search by comparing query embedding with
     * stored embeddings.
     *
     * @param {Array} queryEmbedding - The embedding vector of the user query.
     * @returns {Promise<Array>} - A ranked list of relevant articles based
     * on similarity.
 */
async function performSearch(queryEmbedding) {
    try {
      // Ensure the cluster connection is initialized
      const cluster = await init();
      // Replace 'NAME_OF_YOUR_BUCKET' with the name of your bucket
      const scope = cluster.bucket('NAME_OF_YOUR_BUCKET').scope('_default');
      // Replace 'vector-search-index' with the name of your search index
      const searchIndex = 'vector-search-index';
  
      // Construct the vector search request
      const searchReq = couchbase.SearchRequest.create(
        couchbase.VectorSearch.fromVectorQuery(
          // Replace 'NAME_OF_YOUR_BUCKET.embeddings' with the name of 
          // your bucket and field containing the embeddings
          couchbase.VectorQuery.create("NAME_OF_YOUR_BUCKET.embeddings", queryEmbedding)
            // Specify the number of top candidates to retrieve
            .numCandidates(5)
        )
      );
  
      // Execute the search request
      const result = await scope.search(searchIndex, searchReq);
  
      // Map and rank the search results
      const searchResults = result.rows.map((row) => {
        const articleId = row.id.replace('embedding::', '');
        const similarityScore = row.score;
        return { articleId, similarityScore };
      });
  
      // Sort by similarity score in descending order
      searchResults.sort((a, b) => b.similarityScore - a.similarityScore);
  
      return searchResults;  // Return ranked results
    } catch (error) {
      console.error('Error performing similarity search:', error);
      throw error;
    }
  }
  
  module.exports = { performSearch };

