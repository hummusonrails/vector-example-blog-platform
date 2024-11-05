import { getAllStoredEmbeddings } from './fetchEmbeddings'; 
import { dotProduct } from '../utils/mathUtils';

/**
     * Perform similarity search by comparing query
     * embedding with stored embeddings.
     *
     * @param {Array} queryEmbedding - The embedding vector of the user query.
     * @returns {Promise<Array>} - A ranked list of relevant articles
     * based on similarity.
 */
async function performSearch(queryEmbedding) { 
    try {
        // Fetch all stored embeddings from Couchbase
        const storedEmbeddings = await getAllStoredEmbeddings();
        // Perform dot product for each article embedding
        const searchResults = storedEmbeddings.map(({ articleId, embedding }) => { 
            const similarityScore = dotProduct(queryEmbedding, embedding);
            return { articleId, similarityScore };
        });
        // Rank articles by similarity score in descending order
        searchResults.sort((a, b) => b.similarityScore - a.similarityScore);
            return searchResults; // Return ranked results 
        } catch (error) {
        console.error('Error performing similarity search:', error);
        throw error; 
    }
}

export { performSearch };

