import OpenAI from 'openai';
// Importing custom error class for API errors
import { APIError } from '../utils/errorHandlers';
// Importing validateText utility for input validation
import validateText from '../utils/validateText';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create an instance of OpenAIApi with the provided configuration
const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// Function to generate embedding from the OpenAI API
async function generateEmbedding(text) {
    try {
        validateText(text);

        // Making a request to OpenAI Embeddings API
        const response = await client.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text,
        });

        // Extract the embedding from the response
        const embedding = response.data[0]?.embedding;
        if (!embedding) {
            throw new APIError(
                'Failed to retrieve embedding from response'
            );
        }
        return embedding;
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(`OpenAI API Error [${error.status}]: ${error.message}`);
        } else if (error instanceof APIError || error instanceof ValidationError) {
            console.error(`Validation Error: ${error.message}`);
        } else {
            console.error(`Unexpected Error: ${error.message}`);
        }
        throw error;
    }
}

module.exports = { generateEmbedding };