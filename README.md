# Chapter 1: Getting Started with Vector Search

This branch contains only the code for Chapter 1 of "Vector Search with JavaScript."  
You’ll find a single script that demonstrates book title similarity using OpenAI embeddings.

## Chapter Branches

| Chapter Branch | Description                                                                                                   |
|:--------------:|:-------------------------------------------------------------------------------------------------------------|
| [chapter-1](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-1) | Getting started with vector search; minimal script for book title similarity using OpenAI embeddings.           |
| [chapter-2](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-2) | Understanding vectors and similarity; fruit vector demo with cosine similarity and dot product.                 |
| [chapter-3](https://github.com/hummusonrails/vector-example-blog-platform/tree/chapter-3) | Foundation of the Express app; introduction of embeddings and the core project structure.                      |
| ...            | ...                                                                                                           |
| [main](https://github.com/hummusonrails/vector-example-blog-platform/tree/main)           | Complete, production-ready codebase with all features covered in the book.                                     |

## About This Chapter

- Introduces vector search with a hands-on script.
- Scrapes book titles from Pragmatic Bookshelf.
- Uses OpenAI to generate embeddings and compare your proposed book title.
- No Express app or backend; this is a standalone script.

## How to Run

1. Install dependencies:
   ```sh
   npm install node-fetch dotenv cheerio
   ```
2. Add your OpenAI API key to a `.env` file.
3. Run the script:
   ```sh
   node getting_started_with_vector_search/name_this_book.js "Your Book Title"
   ```
