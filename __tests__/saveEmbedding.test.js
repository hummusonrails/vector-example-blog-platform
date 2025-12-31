jest.mock('../models/Article', () => ({
  Article: {
    findById: jest.fn(),
  },
}));

const { Article } = require('../models/Article');
const saveEmbedding = require('../services/embeddings/saveEmbedding');

describe('saveEmbedding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when article is not found', async () => {
    Article.findById.mockResolvedValue(null);

    await expect(saveEmbedding('missing-id', [0.1, 0.2])).rejects.toThrow(
      'Article not found for embedding update'
    );
  });

  it('updates the embedding for an existing article', async () => {
    const save = jest.fn().mockResolvedValue(true);
    const article = { embedding: [], save };
    Article.findById.mockResolvedValue(article);

    await expect(saveEmbedding('article-1', [0.5, 0.6])).resolves.toBeUndefined();

    expect(article.embedding).toEqual([0.5, 0.6]);
    expect(save).toHaveBeenCalled();
  });
});
