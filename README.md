# Chapter 4: Building the Foundation for Vector Search

## Chapter Navigation

| Chapter | Branch | Description |
|---------|--------|-------------|
| 1 | `chapter-1` | Getting Started with Vector Search |
| 2 | `chapter-2` | Understanding Vector Search |
| 3 | `chapter-3` | Generating Vector Embeddings |
| 4 | `chapter-4` | Building the Foundation for Vector Search |
| 5 | `chapter-5` | Structuring the Backend for Vector Search |
| 6 | `chapter-6` | Building the Vector Embedding Generation Service |
| 7 | `chapter-7` | Creating a Vector Search Service |
| 8 | `chapter-8` | Creating a Vector Search Index |
| 9 | `chapter-9` | Incorporating Vector Search Functionality |
| 10 | `chapter-10` | Optimizing Search Results |
| 11 | `chapter-11` | Key Takeaways and Practical Applications |
| Main | `main` | Complete App |

---

## About This Chapter

This branch sets up the foundation for the vector search service. In this chapter, you will:
- Scaffold the Node.js project for the RealWorld blogging platform.
- Choose and configure Couchbase as the vector database, using Ottoman.js as the ODM.
- Install and document all required dependencies.
- Prepare the project structure for building out vector search features in later chapters.

---

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure your environment variables:**
   - Copy `.env.example` to `.env` and set the required values (Couchbase connection, OpenAI API key, etc.).
3. **Start the app in development mode:**
   ```sh
   npm run dev
   ```
4. **Start the app in production mode:**
   ```sh
   npm start
   ```

---

## Project Structure
- `api/` - Express app entrypoint and route handlers
- `models/` - Ottoman.js models for users, articles, comments, tags
- `config/` - Configuration files for database, logger, security
- `services/` - Utility services (e.g., embeddings, search)
- `routes/` - Express route definitions
- `public/` and `views/` - Static assets and HTML

For more details, see comments in the codebase and the book text for this chapter.
