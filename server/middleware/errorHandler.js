/**
 * AeroShield AI - Centralized Error Handling Middleware
 * Provides safe, structured JSON errors without exposing stack traces in production.
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[AeroShield Error] ${req.method} ${req.url} - Status ${statusCode}:`, err.message);

  res.status(statusCode).json({
    status: statusCode,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    ...(isProduction ? {} : { stack: err.stack })
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'NotFound',
    message: `Resource at ${req.originalUrl} not found.`,
    availableEndpoints: [
      '/api/aqi/current',
      '/api/inversion/forecast',
      '/api/iaq/simulate',
      '/api/routines/generate',
      '/api/hacks/catalog',
      '/api/community/grid',
      '/api/impact/calculate',
      '/api/assistant/chat',
      '/api/automation/evaluate',
      '/api/automation/home-assistant',
      '/api/health'
    ]
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
