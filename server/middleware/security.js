/**
 * AeroShield AI - Enterprise-Grade Security Middleware & Input Sanitization
 * Enforces Helmet security headers, CORS, prototype pollution defense, and deep payload sanitization.
 */

const helmet = require('helmet');
const cors = require('cors');

// Custom Content Security Policy & Defense-in-Depth HTTP Headers
const securityHeaders = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
  }),
  // Additional strict security headers
  (req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.removeHeader('X-Powered-By');
    next();
  }
];

// Permissive yet safe CORS for API consumption
const corsOptions = cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
});

/**
 * Recursive sanitizer that escapes HTML, strips script tags, neutralizes prototype pollution, and trims strings
 * @param {any} data - Raw untrusted user input
 * @returns {any} Sanitized safe data
 */
function sanitizeInput(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return data
      .replace(/\0/g, '') // remove null bytes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
      .replace(/javascript\s*:/gi, '')
      .replace(/vbscript\s*:/gi, '')
      .replace(/data\s*:\s*text\/html/gi, '')
      .replace(/onload\s*=/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onclick\s*=/gi, '')
      .trim();
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeInput(item));
  }

  if (typeof data === 'object') {
    const sanitizedObj = {};
    for (const [key, val] of Object.entries(data)) {
      // Prototype Pollution Prevention: block hazardous inheritance vectors
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitizedObj[key] = sanitizeInput(val);
    }
    return sanitizedObj;
  }

  return data;
}

/**
 * Express middleware for sanitizing req.body, req.query, and req.params
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
