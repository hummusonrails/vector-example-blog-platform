const { generateEmbedding } = require('../clients/openaiClient');
const validateText = require('../utils/validateText');
const saveEmbedding = require('./saveEmbedding');
/**
     * Create an embedding for the given content and
     * either save it or return it based on the type.
     *
     * @param {string} identifier - A unique identifier for the
     * entity (e.g., article ID, query ID).
     * @param {string} content - The content for which the embedding
     * is to be created (e.g., article body, user query).
     * @param {string} type - The type of content (e.g., 'article', 'query').
     * @returns {Promise<object | void>} - Returns the embedding if
     * the type is 'query', otherwise saves it.
 */
async function createEmbedding(identifier, content, type) {
    try {
        validateText(content);
        // Generate the embedding for the content
        const embedding = await generateEmbedding(content);
        
        if (type === 'article') {
            await saveEmbedding(identifier, embedding);
            console.log(
                `Embedding for article with ID ${identifier} saved successfully`
            );
        } else if (type === 'query') {
            console.log(`Generated embedding for query with ID ${identifier}`);
            return embedding;
        }
    } catch (error) {
        console.error('Error creating embedding:', error);
        throw error;
    }
}

module.exports = { createEmbedding };
