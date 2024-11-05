import { createEmbedding } from '../services/embeddings/createEmbedding'; import { generateEmbedding } from '../services/clients/openaiClient';
import { saveEmbedding } from '../services/embeddings/saveEmbedding'; import validateText from '../services/utils/validateText';

jest.mock('../services/clients/couchbaseClient'); jest.mock('../services/clients/openaiClient'); jest.mock('../services/embeddings/saveEmbedding'); jest.mock('../services/utils/validateText');

describe('Vector Generation Service', () => {
    it('should successfully validate, generate, and save an embedding', async () => {
        const mockArticleId = 'article123';
        const mockContent = 'This is a test article for embedding generation.';
        const mockEmbedding = [0.123, 0.456, 0.789]

        // Mocking function behaviors
        validateText.mockImplementation(() => true);
        generateEmbedding.mockResolvedValue(mockEmbedding);
        saveEmbedding.mockResolvedValue(true);

        await expect(createEmbedding(mockArticleId, mockContent, 'article')).resolves.not.toThrow();

        expect(validateText).toHaveBeenCalledWith(mockContent); expect(generateEmbedding).toHaveBeenCalledWith(mockContent); expect(saveEmbedding).toHaveBeenCalledWith(mockArticleId, mockEmbedding, 'article');
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
        generateEmbedding.mockImplementation(() => { 
            throw new Error('OpenAI API Error');
        });

        await expect(createEmbedding(mockArticleId, mockContent, 'article')).rejects.toThrow('OpenAI API Error'); expect(validateText).toHaveBeenCalledWith(mockContent); expect(generateEmbedding).toHaveBeenCalledWith(mockContent);
    });
})