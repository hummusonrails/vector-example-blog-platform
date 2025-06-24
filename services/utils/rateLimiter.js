// rateLimiter.js - rate limiter utility
// Minimal Express-compatible in-memory rate limiter

const rateLimiters = new Map();

/**
 * Rate limiter middleware for Express
 * @param {number} windowMs - Time window in ms
 * @param {number} max - Max requests per window per IP
 */
function rateLimiter(windowMs = 60000, max = 30) {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        if (!rateLimiters.has(ip)) {
            rateLimiters.set(ip, []);
        }
        const timestamps = rateLimiters.get(ip);
        // Remove timestamps outside window
        while (timestamps.length && timestamps[0] <= now - windowMs) {
            timestamps.shift();
        }
        if (timestamps.length >= max) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
        }
        timestamps.push(now);
        next();
    };
}

module.exports = rateLimiter;
