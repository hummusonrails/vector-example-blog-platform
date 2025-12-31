const { ValidationError } = require('./errorHandlers');

function validateText(text) {
    if (typeof text !== 'string') {
        throw new ValidationError(
            'Input must be a string'
        );
    }
    if (text.trim() === '') {
        throw new ValidationError(
          'Input cannot be empty or just whitespace'
        ); 
    }

    const maxLength = 5000; // Adjust as necessary 
    if (text.length > maxLength) {
        throw new ValidationError(
            `Input text exceeds maximum length of ${maxLength} characters`
        ); 
    }

    const minLength = 5; // Adjust as necessary
    if (text.length < minLength) {
        throw new ValidationError(
            `Input text is too short, must be at least ${minLength} characters`
        );
    }

    // Check for repetitive content
    const words = text.split(' ');
    const uniqueWords = new Set(words);
    // More than 70% repetitive words
    if (uniqueWords.size / words.length < 0.3) {
        throw new ValidationError(
            'Input text is too repetitive'
        );
    }

    // Check for excessive punctuation
    const excessivePunctuationRegex = /[!?.]{5,}/;
    if (excessivePunctuationRegex.test(text)) {
        throw new ValidationError(
            'Input text contains excessive punctuation'
        );
    }

    return true;
}

module.exports = validateText;
