const { VectorLengthError } = require('./errorHandlers');

/**
     * Function to calculate the dot product of two vectors.
     *
     *  @param {Array} vectorA - The first vector.
     * @param {Array} vectorB - The second vector.
     * @returns {number} - The dot product of the two vectors 
*/
function dotProduct(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new VectorLengthError('Vectors must be of the same length'); }
        return vectorA.reduce((acc, curr, idx) => acc + curr * vectorB[idx], 0); 
}
    
module.exports = { dotProduct };
