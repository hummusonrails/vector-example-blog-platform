import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function scrapeTitles() {
  const baseURL = 'https://pragprog.com';
  const maxPages = 27;
  const maxTitles = 50;
  const allBooks = [];
  console.log(`Scraping up to ${maxTitles} book titles from Pragmatic Bookshelf...`);
  for (let page = 1; page <= maxPages; page++) {
    const pageURL = page === 1
      ? `${baseURL}/titles/`
      : `${baseURL}/titles/page/${page}/`;
    console.log(` - Fetching page ${page}`);
    const res = await fetch(pageURL);
    const html = await res.text();
    const $ = cheerio.load(html);
    $('.category-title-container').each((_, el) => {
      if (allBooks.length >= maxTitles) return false;
      const anchor = $(el).find('a').first();
      const title = $(el)
        .find('.category-title-title b')
        .text()
        .trim();
      const subtitle = $(el)
        .find('.category-title-subtitle')
        .text()
        .trim();
      const url = anchor.attr('href');
      if (title && url) {
        allBooks.push({ title, subtitle, url });
      }
    });
    if (allBooks.length >= maxTitles) break;
  }
  const unique = Array.from(
    new Map(allBooks.map(b => [b.url, b])).values()
  );
  console.log(`\nFinished scraping. ${unique.length} titles captured.`);
  return unique;
}

async function getEmbedding(text) {
  console.log(`Generating embedding for: "${text}"`);
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });
  const data = await res.json();
  return data.data[0].embedding;
}

async function embedTitles(books) {
  console.log(`Generating embeddings for all titles...`);
  const promises = books.map((book, i) => {
    const fullTitle = book.subtitle
      ? `${book.title}: ${book.subtitle}`
      : book.title;
    console.log(` (${i + 1}/${books.length}) ${fullTitle}`);
    return getEmbedding(fullTitle).then(embedding => {
      book.embedding = embedding;
    });
  });
  await Promise.all(promises);
  return books;
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

function compareTitles(queryEmbedding, books) {
  console.log('Comparing against catalog...');
  return books
    .map(book => ({
      ...book,
      similarity: cosineSimilarity(book.embedding, queryEmbedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
}

async function main() {
  const DATA_FILE = 'pragprog_titles.json';
  let books;
  if (fs.existsSync(DATA_FILE)) {
    console.log(`Loading cached data from ${DATA_FILE}...`);
    books = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } else {
    console.log('No cached data found. Starting fresh.');
    books = await scrapeTitles();
    books = await embedTitles(books);
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(books, null, 2)
    );
    console.log(`Saved ${books.length} books to ${DATA_FILE}`);
  }
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    console.error('Please pass a proposed title as a command-line argument');
    console.error('Example: node name_this_book.js "Mastering Vector Search"');
    process.exit(1);
  }
  console.log(`\nFinding matches for: "${query}"`);
  const queryEmbedding = await getEmbedding(query);
  const topMatches = compareTitles(queryEmbedding, books);
  console.log(`\nTop matches for "${query}":\n`);
  for (const match of topMatches) {
    console.log(
      `- ${match.title}${match.subtitle ? `: ${match.subtitle}` : ''}`
    );
    console.log(
      ` (${(match.similarity * 100).toFixed(2)}% similar)`
    );
    console.log(
      ` ${match.url}\n`
    );
  }
}

main();
