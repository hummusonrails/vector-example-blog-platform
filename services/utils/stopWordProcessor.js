// stopWordProcessor.js - Stop word utilities

// A canonical list of common English stop words (can be expanded as needed)
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'while', 'with', 'of', 'at', 'by', 'for', 'to', 'in', 'on', 'from', 'as',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'this', 'that', 'these', 'those', 'it', 'its', 'he',
    'she', 'they', 'them', 'his', 'her', 'their', 'we', 'us', 'you', 'your', 'i', 'me', 'my', 'mine', 'our', 'ours',
    'so', 'no', 'not', 'too', 'very', 'just', 'than', 'then', 'there', 'here', 'when', 'where', 'why', 'how', 'all',
    'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'until', 'about',
]);

/**
 * Check if a word is a stop word
 * @param {string} word
 * @returns {boolean}
 */
function isStopWord(word) {
    return STOP_WORDS.has(word.toLowerCase());
}

/**
 * Remove stop words from a text string
 * @param {string} text
 * @returns {string}
 */
function removeStopWords(text) {
    return text
        .split(/\s+/)
        .filter(word => !isStopWord(word))
        .join(' ');
}

module.exports = {
    isStopWord,
    removeStopWords,
};
