# Chapter 10: Optimizing Search Results

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

This branch focuses on optimizing vector search results. In this chapter, you will:
- Tune vector search parameters for accuracy and performance.
- Implement result ranking and relevance improvements.
- Apply best practices for search quality and speed.

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

## How to Implement Chapter 10 Optimizations

This section provides step-by-step guidance for implementing the optimizations described in Chapter 10—recency and popularity metrics, weighted ranking, stop word removal, and hybrid search routing—within this branch.

### 1. Recency and Popularity Metrics in the Article Model

**Summary:**
Add fields to your Article model to track how recent and popular each article is. These metrics will be used in ranking search results.

**Steps:**
- In `models/Article.js`, add fields for `recencyScore` and `popularityScore` (or similar names).
- Calculate `recencyScore` based on the publication date. For example:
  ```js
  // In ArticleSchema or before saving an article
  const maxDays = 365;
  const currentDate = new Date();
  const publicationDate = this.publicationDate || currentDate;
  this.recencyScore = Math.max(0, maxDays - Math.floor((currentDate - publicationDate) / (1000 * 60 * 60 * 24)));
  ```
- Calculate `popularityScore` based on views and likes:
  ```js
  // Example calculation
  this.popularityScore = (0.7 * this.views) + (0.3 * this.likes);
  ```
- Update these fields whenever an article is created or engagement data changes.

### 2. Weighted Ranking in Search Logic

**Summary:**
Combine similarity, recency, and popularity into a single ranking score for search results.

**Steps:**
- In your search logic (e.g., `controllers/searchController.js` or `services/search/performSearch.js`), after retrieving search results, compute a final score:
  ```js
  // Example weighted formula
  result.final_score = (0.7 * result.similarity_score) + (0.2 * result.recencyScore) + (0.1 * result.popularityScore);
  // Sort results by final_score descending
  results.sort((a, b) => b.final_score - a.final_score);
  ```
- Adjust weights as needed for your application.

### 3. Stop Word Removal and Integration

**Summary:**
Improve search precision by removing common stop words from user queries before generating embeddings.

**Steps:**
- Use the utility at `services/utils/stopWordProcessor.js` to process queries:
  ```js
  const { removeStopWords } = require('../services/utils/stopWordProcessor');
  const cleanedQuery = removeStopWords(userQuery);
  ```
- Integrate this step at the start of your search controller/service, before embedding the query or performing search.
- Optionally, expand the stop word list or add logic to preserve important phrases as described in the book.

### 4. Hybrid Search Routing (Vector + Keyword)

**Summary:**
Allow the API to route between vector-based and keyword-based search depending on query type (e.g., exact phrase vs. conceptual search).

**Steps:**
- In your search controller (e.g., `controllers/searchController.js`), detect the query type:
  ```js
  // Pseudocode
  const isExact = cleanedQuery.includes('"');
  if (isExact) {
    // Perform keyword-based search (e.g., MongoDB text index or SQL LIKE)
  } else {
    // Perform vector-based search (embedding + similarity)
  }
  ```
- Implement both search methods and merge/deduplicate results if needed.
- Return results to the user, ranked appropriately.

