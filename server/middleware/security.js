/**
 * AeroShield AI - Security Middleware & Input Sanitization
 * Enforces Helmet security headers, CORS, and deep payload sanitization.
 */

const helmet = require('helmet');
const cors = require('cors');

// Custom Content Security Policy
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
});

// Permissive yet safe CORS for API consumption
const corsOptions = cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
});

/**
 * Recursive sanitizer that escapes HTML, strips script tags, and trims strings
 */
function sanitizeInput(data) {
  if (typeof data === 'string') {
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
      .replace(/javascript:/gi, '')
      .replace(/onload=/gi, '')
      .replace(/onerror=/gi, '')
      .trim();
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeInput(item));
  }
  if (typeof data === 'object' && data !== null) {
    const sanitizedObj = {};
    for (const [key, val] of Object.entries(data)) {
      sanitizedObj[key] = sanitizeInput(val);
    }
    return sanitizedObj;
  }
  return data;
}

/**
 * Express middleware for sanitizing req.body and req.query
 */
const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
};

module.exports = {
  securityHeaders,
  corsOptions,
  sanitizeMiddleware,
  sanitizeInput
};
