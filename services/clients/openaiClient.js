const OpenAI = require('openai');
const { APIError, ValidationError } = require('../utils/errorHandlers');
const validateText = require('../utils/validateText');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let client;

function getClient() {
    if (!client) {
        if (!OPENAI_API_KEY) {
            throw new APIError(
                'The OPENAI_API_KEY environment variable is missing or empty'
            );
        }
        client = new OpenAI({ apiKey: OPENAI_API_KEY });
    }
    return client;
}

// Function to generate embedding from the OpenAI API
async function generateEmbedding(text) {
    try {
        validateText(text);

        // Making a request to OpenAI Embeddings API
        const response = await getClient().embeddings.create({
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
