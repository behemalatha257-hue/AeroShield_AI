/**
 * AeroShield AI - Tiered Rate Limiting Middleware
 * Protects APIs from abuse, credential stuffing, and DoS attacks.
 */

const rateLimit = require('express-rate-limit');

// General API Rate Limiter: 150 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '150', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please wait 15 minutes before retrying.',
    retryAfterSeconds: 900
  }
});

// Stricter Rate Limiter for GenAI Assistant endpoint: 45 requests per 15 minutes
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 45,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'AI Rate Limit Exceeded',
    message: 'To prevent compute overload, AI requests are limited to 45 queries per 15 minutes.',
    retryAfterSeconds: 900
  }
});

module.exports = {
  apiLimiter,
  aiLimiter
};
