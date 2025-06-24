const Article = require('../models/Article');
const { ValidationError } = require('../utils/errorHandlers');

// Function to save embedding and article data
async function saveEmbedding(articleId, articleContent, embedding) {
    if (!articleId || !embedding || !articleContent) {
        throw new ValidationError(
            'Article ID, content, and embeddings are required to save'
        );
    }

    try {
        // Find the existing article or create a new Article instance
        let article = await Article.findById(articleId);

        if (!article) {
            article = new Article({
                slug: articleContent.slug,
                title: articleContent.title,
                description: articleContent.description,
                body: articleContent.body,
                author: articleContent.author,
                tagList: articleContent.tagList,
                favoritesCount: 0,
                comments: [],
                embedding
            });
        } else {
            article.embedding = embedding;
        }

        // Save the article with its embedding
        await article.save();
        console.log('Article and embedding saved successfully');
    } catch (error) {
        console.error('Error saving article and embedding:', error);
        throw error;
    }
}

module.exports = saveEmbedding;