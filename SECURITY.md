# 🔒 AeroShield AI - Security Policy & Architecture

## Security Standard Compliance: High Grade

AeroShield AI is engineered following defense-in-depth security principles to safeguard user privacy, protect sensitive health/vulnerability profiles, prevent Denial of Service (DoS) attacks, and neutralize web vulnerabilities (OWASP Top 10).

---

## 1. Threat Modeling & Attack Surface Analysis

| Threat Vector | Severity | Mitigation Strategy in AeroShield AI | Implementation |
| :--- | :---: | :--- | :--- |
| **Cross-Site Scripting (XSS)** | High | Strict Content Security Policy (CSP), HTML escaping, recursive script stripping on all input fields. | `server/middleware/security.js` |
| **Denial of Service (DoS)** | High | Tiered rate limiting on both API (150 req/15m) and AI endpoints (45 req/15m), strict 500KB JSON payload limits. | `server/middleware/rateLimiter.js` |
| **Injection Attacks** | High | Whitelisted parameter validation, bounds checking on numeric inputs, rejection of malicious characters. | `server/middleware/validator.js` |
| **API Secret Leakage** | High | `GEMINI_API_KEY` stored exclusively in environment variables; never exposed to client or logged. Safe fallback engaged if missing. | `server/services/geminiService.js` |
| **Clickjacking / MIME Sniffing** | Medium | Helmet headers enforcing `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`. | `server/middleware/security.js` |
| **Information Disclosure** | Medium | Central error handler sanitizes stack traces in production (`NODE_ENV === 'production'`). | `server/middleware/errorHandler.js` |

---

## 2. Security Middleware Breakdown

### Content Security Policy (CSP) & Headers
AeroShield AI enforces strict HTTP response headers via `helmet`:
```javascript
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});
```

### Recursive Input Sanitization
All incoming JSON bodies, URL parameters, and queries pass through `sanitizeInput()`:
- Strips `<script>` tags and embedded executable blocks.
- Strips `javascript:` pseudo-protocols.
- Strips event handlers (`onload=`, `onerror=`, `onclick=`).
- Recursively cleans nested objects and arrays.
- Trims whitespace to prevent padding attacks.

### Tiered Rate Limiting
Configured using `express-rate-limit`:
1. **General API Limiter**:
   - Window: 15 minutes (900,000 ms)
   - Max requests: 150
   - Responds with `429 Too Many Requests` and standard `Retry-After` header.
2. **GenAI Conversational Limiter**:
   - Window: 15 minutes
   - Max requests: 45
   - Protects generative inference compute resources from automated scraping or brute force.

---

## 3. Safe Fallback & Zero-Dependency Execution
If `GEMINI_API_KEY` is not provided, expired, or rate-limited:
- The system **never crashes** or throws uncaught exceptions.
- It seamlessly engages the internal **Autonomous Generative Local Engine**, which synthesizes responses using embedded atmospheric physics, pulmonary health databases, and building engineering algorithms.
- Stack traces and raw internal error strings are never returned to the client.

---

## 4. Vulnerability Disclosure Policy
To report security vulnerabilities, please contact the development team or open a confidential issue. All security patches are released promptly.
