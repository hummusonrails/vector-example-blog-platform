# Chapter 3: Foundation of the Express App

This branch contains the foundational code for Chapter 3 of "Vector Search with JavaScript." Here, you’ll find the initial Express app structure, setup for embeddings, and the base project layout that subsequent chapters will build upon.

## Chapter Branches

| Chapter Branch | Description                                                                                                   |
|:--------------:|:-------------------------------------------------------------------------------------------------------------|
| [chapter-1](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-1) | Getting started with vector search; minimal script for book title similarity using OpenAI embeddings.           |
| [chapter-2](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-2) | Understanding vectors and similarity; fruit vector demo with cosine similarity and dot product.                 |
| [chapter-3](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-3) | Foundation of the Express app; introduction of embeddings and the core project structure.                      |
| [chapter-4](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-4) | Setting up the development environment and project dependencies.                                                |
| [chapter-5](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-5) | Implementing vector storage and retrieval logic.                                                                |
| [chapter-6](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-6) | Building the API endpoints for vector search.                                                                  |
| [chapter-7](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-7) | Creating a vector search service and integrating with the backend.                                             |
| [chapter-8](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-8) | Adding advanced search features and optimizations.                                                             |
| [chapter-9](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-9) | Incorporating vector search functionality into the application.                                                 |
| [chapter-10](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-10) | Security, rate limiting, and production best practices.                                                        |
| [chapter-11](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-11) | Key takeaways, practical applications, and final project review.                                               |
| [main](https://github.com/hummusonrails/vector-example-blog-platform/tree/main)           | Complete, production-ready codebase with all features covered in the book.                                     |

## About This Chapter

- Introduces the foundational Express app for the vector search platform.
- Sets up the core project structure and dependencies.
- Lays the groundwork for using embeddings in future chapters.

## How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your environment variables in `.env` (see `.env.example` for required keys).
3. Start the app in development mode:
   ```sh
   npm run dev
   ```
4. Or start the app in production mode:
   ```sh
   npm start
   ```

### Generating an Embedding (Chapter 3 Example)

To generate a vector embedding for any string using the OpenAI API, run:

```sh
node generate_embedding.js "Your text string goes here"
```

This will output the embedding vector, the model used, and the number of tokens consumed. You must have your OpenAI API key set in your `.env` file for this to work.

For more details, see comments in the codebase and the book text for this chapter.
