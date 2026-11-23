/**
 * AeroShield AI - Production Server Entry Point
 * Autonomous GenAI-Powered Community & Family Clean-Air Assistant
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');

const { securityHeaders, corsOptions, sanitizeMiddleware } = require('./server/middleware/security');
const { errorHandler, notFoundHandler } = require('./server/middleware/errorHandler');
const apiRoutes = require('./server/routes/apiRoutes');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Trust reverse proxies (Vercel, Cloudflare, Nginx, Docker)
app.set('trust proxy', 1);

// Security & Optimization Middleware
app.use(securityHeaders);
app.use(corsOptions);
app.use(compression());

// Request Body Parsing with Strict Payload Size Limits
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// Input Sanitization Middleware
app.use(sanitizeMiddleware);

// Serve Frontend Static Files with Instant Revalidation
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// API Routes
app.use('/api', apiRoutes);

// Catch 404 for undefined routes
app.use('/api/*', notFoundHandler);

// Fallback to SPA for any non-API GET request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized Error Handler
app.use(errorHandler);

// Start server if executed directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` 🛡️  AeroShield AI Server Active`);
    console.log(` 🚀 Listening at: http://localhost:${PORT}`);
    console.log(` 🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` 🧠 Gemini GenAI Status: ${process.env.GEMINI_API_KEY ? 'Active (API Key loaded)' : 'Autonomous Local Generative Fallback Engaged'}`);
    console.log(`================================================================`);
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`\n[AeroShield] Received ${signal}. Gracefully shutting down...`);
    server.close(() => {
      console.log('[AeroShield] Server successfully stopped. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
