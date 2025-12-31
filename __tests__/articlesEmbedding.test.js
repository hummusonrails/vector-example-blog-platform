const ottoman = require('ottoman');

jest.mock('ottoman', () => ({
  getModel: jest.fn(),
}));

jest.mock('../services/embeddings/createEmbedding', () => ({
  createEmbedding: jest.fn(),
}));

jest.mock('../config/logger', () => ({
  Logger: {
    child: () => ({
      debug: jest.fn(),
      error: jest.fn(),
    }),
  },
}));

const { createEmbedding } = require('../services/embeddings/createEmbedding');

const userModel = {
  findById: jest.fn(),
};

const articleModel = {
  create: jest.fn(),
  findOne: jest.fn(),
};

ottoman.getModel.mockImplementation((name) => {
  if (name === 'User') {
    return userModel;
  }
  if (name === 'Article') {
    return articleModel;
  }
  return {};
});

const { createArticle } = require('../controllers/articlesController');
const { updateArticle } = require('../controllers/articlesController');

describe('Article embedding generation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('generates an embedding when an article is created', async () => {
    userModel.findById.mockResolvedValue({ id: 'user-1' });

    const articleInstance = {
      id: 'article-1',
      save: jest.fn().mockResolvedValue(true),
      toArticleResponse: jest.fn().mockResolvedValue({ id: 'article-1' }),
      tagList: [],
    };

    articleModel.create.mockResolvedValue(articleInstance);
    createEmbedding.mockResolvedValue([0.1, 0.2]);

    const req = {
      userId: 'user-1',
      body: {
        article: {
          title: 'Hello',
          description: 'Desc',
          body: 'Body',
          tagList: ['b', 'a'],
        },
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createArticle(req, res);

    expect(createEmbedding).toHaveBeenCalledWith(
      'article-1',
      'Hello\n\nDesc\n\nBody',
      'article'
    );
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns success even if embedding generation fails on create', async () => {
        userModel.findById.mockResolvedValue({ id: 'user-1' });

        const articleInstance = {
            id: 'article-2',
            save: jest.fn().mockResolvedValue(true),
            toArticleResponse: jest.fn().mockResolvedValue({ id: 'article-2' }),
            tagList: [],
        };

        articleModel.create.mockResolvedValue(articleInstance);
        createEmbedding.mockRejectedValue(new Error('Embedding failure'));

        const req = {
            userId: 'user-1',
            body: {
                article: {
                    title: 'Hello',
                    description: 'Desc',
                    body: 'Body',
                },
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(articleModel.create).toHaveBeenCalledWith(
            expect.objectContaining({ slug: 'hello' })
        );
    });

    it('returns 404 when updating a missing article', async () => {
        userModel.findById.mockResolvedValue({ id: 'user-1' });
        articleModel.findOne.mockResolvedValue(null);

        const req = {
            userId: 'user-1',
            params: { slug: 'missing-article' },
            body: {
                article: { title: 'New title' },
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await updateArticle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Article Not Found' });
    });

    it('regenerates embedding when article content changes', async () => {
        const save = jest.fn().mockResolvedValue(true);
        const toArticleResponse = jest.fn().mockResolvedValue({ id: 'article-3' });
        const article = {
            id: 'article-3',
            title: 'Old',
            description: 'Old desc',
            body: 'Old body',
            tagList: [],
            save,
            toArticleResponse,
        };

        userModel.findById.mockResolvedValue({ id: 'user-1' });
        articleModel.findOne.mockResolvedValue(article);
        createEmbedding.mockResolvedValue([0.1, 0.2]);

        const req = {
            userId: 'user-1',
            params: { slug: 'old' },
            body: {
                article: { title: 'New', body: 'New body' },
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await updateArticle(req, res);

        expect(createEmbedding).toHaveBeenCalledWith(
            'article-3',
            'New\n\nOld desc\n\nNew body',
            'article'
        );
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
