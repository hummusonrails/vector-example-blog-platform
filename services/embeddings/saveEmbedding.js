const { getModel } = require('ottoman');
const { ValidationError } = require('../utils/errorHandlers');

// Function to save embedding and article data
async function saveEmbedding(articleId, embedding) {
    if (!articleId || !embedding) {
        throw new ValidationError(
            'Article ID and embeddings are required to save'
        );
    }

    try {
        const Article = getModel('Article');
        const article = await Article.findById(articleId);

        if (!article) {
            throw new ValidationError('Article not found for embedding update');
        }

        article.embedding = embedding;

        // Save the article with its embedding
        await article.save();
        console.log('Article and embedding saved successfully');
    } catch (error) {
        console.error('Error saving article and embedding:', error);
        throw error;
    }
}

module.exports = saveEmbedding;
