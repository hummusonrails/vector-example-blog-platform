// Chapter 3: Generating Vector Embeddings with OpenAI
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main() {
  const input = process.argv.slice(2).join(' ');
  if (!input) {
    console.error('Please provide a string to embed.');
    console.error('Example: node generate_embedding.js "Hello world"');
    process.exit(1);
  }
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input,
    });
    const embedding = response.data.data[0].embedding;
    console.log('Embedding:', embedding);
    console.log('Model used:', response.data.model);
    console.log('Tokens consumed:', response.data.usage.total_tokens);
  } catch (error) {
    console.error('Error generating embedding:', error.response?.data || error.message);
  }
}

main();
