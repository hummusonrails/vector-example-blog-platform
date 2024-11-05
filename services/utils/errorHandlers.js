class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        Error.captureStackTrace(this, this.constructor);
    }
}

class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'APIError';
        Error.captureStackTrace(this, this.constructor);
    }
}

class VectorLengthError extends Error { 
    constructor(message) {
    super(message);
    this.name = 'VectorLengthError'; Error.captureStackTrace(this, this.constructor);
    } 
}

module.exports = {
    ValidationError,
    APIError,
    VectorLengthError
};