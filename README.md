# Chapter 8: Creating a Vector Search Index

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

This branch focuses on creating a vector search index in Couchbase. In this chapter, you will:
- Define and configure a vector search index for your articles bucket.
- Prepare the backend to use this index for efficient vector similarity search.
- Learn best practices for index design and maintenance.

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
- `services/embeddings/` - Embedding generation and storage logic
- `services/search/` - Vector search logic
- `routes/` - Express route definitions
- `public/` and `views/` - Static assets and HTML

For more details, see comments in the codebase and the book text for this chapter.

---

## Creating the Vector Search Index in Couchbase

To enable vector search, you need to create a vector index on the `embedding` field of your articles bucket in Couchbase. You can do this via the Couchbase Web Console or using the Couchbase CLI/REST API.

**Example (via Couchbase Web Console):**
1. Log in to the Couchbase Web Console.
2. Go to **Search** > **Indexes**.
3. Click **Add Index**.
4. Set the index name (e.g., `vector-search-index`).
5. Select your articles bucket.
6. In the **Type Mappings**, map the `embedding` field as a vector field (choose the correct dimension, e.g., 1536 for OpenAI embeddings).
7. Save and build the index.

**Example (via REST API):**
```sh
curl -X PUT -u <username>:<password> \
  http://localhost:8094/api/index/vector-search-index \
  -d '{
    "type": "fulltext-index",
    "name": "vector-search-index",
    "sourceType": "couchbase",
    "sourceName": "<your-bucket>",
    "params": {
      "doc_config": {"mode": "type_field", "type_field": "type"},
      "mapping": {
        "types": {
          "article": {
            "properties": {
              "embedding": {
                "type": "vector",
                "dims": 1536,
                "similarity": "cosine"
              }
            }
          }
        }
      }
    }
  }'
```

> **Note:** Adjust the bucket name, dimension, and field names as needed to match your schema and embedding setup.

Once the index is created and built, your backend vector search queries will use this index for efficient similarity search.
