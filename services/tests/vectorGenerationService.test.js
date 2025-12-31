jest.mock('../clients/couchbaseClient', () => ({}));
jest.mock('../clients/openaiClient', () => ({
    generateEmbedding: jest.fn(),
}));
jest.mock('../embeddings/saveEmbedding', () => jest.fn());
jest.mock('../utils/validateText', () => jest.fn());

const { createEmbedding } = require('../embeddings/createEmbedding');
const { generateEmbedding } = require('../clients/openaiClient');
const saveEmbedding = require('../embeddings/saveEmbedding');
const validateText = require('../utils/validateText');

describe('Vector Generation Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('should successfully validate, generate, and save an embedding', async () => {
        const mockArticleId = 'article123';
        const mockContent = 'This is a test article for embedding generation.';
        const mockEmbedding = [0.123, 0.456, 0.789]

        // Mocking function behaviors
        validateText.mockImplementation(() => true);
        generateEmbedding.mockResolvedValue(mockEmbedding);
        saveEmbedding.mockResolvedValue(true);

        await expect(createEmbedding(mockArticleId, mockContent, 'article')).resolves.not.toThrow();

        expect(validateText).toHaveBeenCalledWith(mockContent);
        expect(generateEmbedding).toHaveBeenCalledWith(mockContent);
        expect(saveEmbedding).toHaveBeenCalledWith(mockArticleId, mockEmbedding);
    });

    it('should throw a validation error for invalid input', async () => {
        const mockArticleId = 'article123';
        const invalidContent = '';

        validateText.mockImplementation(() => {
            throw new Error('Invalid content');
    });

        await expect(createEmbedding(mockArticleId, invalidContent, 'article')).rejects.toThrow('Invalid content');
        expect(validateText).toHaveBeenCalledWith(invalidContent);
    });

    it('should handle errors from the OpenAI API', async () => {
        const mockArticleId = 'article123';
        const mockContent = 'This is a test article for embedding generation.';
        // Mocking an error from the OpenAI API
        validateText.mockImplementation(() => true);
        generateEmbedding.mockImplementation(() => { 
            throw new Error('OpenAI API Error');
        });

        await expect(createEmbedding(mockArticleId, mockContent, 'article')).rejects.toThrow('OpenAI API Error');
        expect(validateText).toHaveBeenCalledWith(mockContent);
        expect(generateEmbedding).toHaveBeenCalledWith(mockContent);
    });

    it('should return embedding for query type', async () => {
        const mockQueryId = 'query123';
        const mockContent = 'Search query text.';
        const mockEmbedding = [0.11, 0.22];

        validateText.mockImplementation(() => true);
        generateEmbedding.mockResolvedValue(mockEmbedding);

        await expect(createEmbedding(mockQueryId, mockContent, 'query')).resolves.toEqual(mockEmbedding);

        expect(validateText).toHaveBeenCalledWith(mockContent);
        expect(generateEmbedding).toHaveBeenCalledWith(mockContent);
    });
})
