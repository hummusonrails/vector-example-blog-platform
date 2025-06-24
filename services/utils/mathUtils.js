// mathUtils.js - vector math utilities

/**
 * Compute the dot product of two vectors
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
function dotProduct(a, b) {
    if (a.length !== b.length) throw new Error('Vectors must be the same length');
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Compute the Euclidean norm (magnitude) of a vector
 * @param {number[]} a
 * @returns {number}
 */
function vectorNorm(a) {
    return Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Compute the cosine similarity between two vectors
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
function cosineSimilarity(a, b) {
    return dotProduct(a, b) / (vectorNorm(a) * vectorNorm(b));
}

module.exports = {
    dotProduct,
    vectorNorm,
    cosineSimilarity,
};
