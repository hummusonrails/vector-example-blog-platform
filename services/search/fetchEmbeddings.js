import { getModel } from 'ottoman';

/**
     * Fetch all stored embeddings from Couchbase.
     *
     * @returns {Promise<Array>} - An array of objects containing
     * articleId and embeddings.
 */
async function getAllStoredEmbeddings() { 
    try {
        const ArticleModel = getModel('Article');
        const articles = await ArticleModel.find({}, { select: ['_id', 'embedding'] });
    
        return articles.rows.map(article => (
            { 
                articleId: article._id,
                embedding: article.embedding,
            }
        ));
    } catch (error) {
        console.error('Error fetching embeddings:', error.message);
        throw error; 
    }
}

export { getAllStoredEmbeddings };
