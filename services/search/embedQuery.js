import { createEmbedding } from '../embeddings/createEmbedding'; import { performSearch } from './performSearch';
import { ValidationError } from '../utils/errorHandlers';

/**
     * Embeds a user query and performs a search.
     *
     * @param {string} queryId - The unique ID for the query.
     * @param {string} query - The search query entered by the user.
     * @returns {Promise<object>} - The search results.
 */
async function embedAndSearch(queryId, query) { 
    try {
        if (!query) {
            throw new ValidationError('Query content is missing', 'query');
        }
    
    const queryEmbedding = await createEmbedding(queryId, query, 'query');    
    const searchResults = await performSearch(queryEmbedding);
        
    return searchResults; } catch (error) {
        if (error instanceof ValidationError) {
            console.error(`Validation Error: ${error.message}, Field: ${error.field}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
        throw error; 
    }
}

export { embedAndSearch };