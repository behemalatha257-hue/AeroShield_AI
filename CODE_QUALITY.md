# 💎 AeroShield AI - Code Quality, Security & Architecture Standards

AeroShield AI is engineered to the highest industry standards for enterprise reliability, scientific rigor, code maintainability, and security compliance. This document details the architectural principles, defensive programming patterns, and automated verification suites implemented across the codebase.

---

## 1. Architectural Architecture & Design Principles

### 1.1 Modular Service-Oriented Architecture (SOA)
The backend follows a decoupled Service-Oriented pattern where business logic, aerosol physics computations, and meteorological algorithms reside in isolated services:
- **`server/services/iaqPhysicsService.js`**: Numerical solvers for differential mass-balance aerosol loss rates.
- **`server/services/inversionService.js`**: Planetary boundary layer diurnal modeling and convective mixing algorithms.
- **`server/services/automationService.js`**: Natural language task parsing, equipment allocation, and smart home IoT compilation.
- **`server/services/geminiService.js`**: Multi-agent LLM orchestration with model cascades and offline fallback.
- **`server/services/communityService.js`**: Collective neighborhood syndicates and persistent environmental pledges.
- **`server/services/cacheService.js`**: In-memory high-throughput TTL cache with eviction and hit/miss telemetry.

### 1.2 Clear Separation of Concerns (SoC)
- **Routes Layer (`server/routes/apiRoutes.js`)**: Pure HTTP endpoint declarations with rate-limiting and validation middlewares.
- **Validation Middleware (`server/middleware/validator.js`)**: Strictly asserts type, length, and logical boundaries on every payload before passing execution to services.
- **Security Middleware (`server/middleware/security.js`)**: Helmet defense headers, deep recursive sanitization, and prototype pollution defenses.
- **Error Handling (`server/middleware/errorHandler.js`)**: Centralized error interceptor ensuring zero uncaught exceptions and consistent JSON error formats (`{ status, error, message }`).

---

## 2. Code Quality & Static Analysis Standards

### 2.1 Linting & Formatting Standards
The project adheres to strict ESLint and Prettier configurations:
- **`.eslintrc.json`**: Enforces strict equality (`eqeqeq: error`), no undefined identifiers (`no-undef: error`), curly braces for control structures (`curly: error`), semicolon termination (`semi: error`), and unused parameter checks.
- **`.prettierrc`**: Standardizes 2-space indentation, single quotes, and 100-character line lengths.
- **`jsconfig.json`**: Provides ES2022 type-checking and autocompletion across frontend and backend modules.

### 2.2 Comprehensive JSDoc Type Annotations
All public methods and exported functions across the service and middleware layers are documented with complete JSDoc headers specifying:
- `@description`: Plain-language explanation of function responsibility.
- `@param {Type} name`: Explicit data types and default fallback values.
- `@returns {Type}`: Expected structure of return values.

---

## 3. Defensive Programming & Error Resilience

### 3.1 Network Timeout & AbortController Handling
All external API calls (including Google Gemini API invocations) utilize `AbortController` with explicit timeouts. Timers are created with `.unref()` and wrapped in `finally { clearTimeout(id); }` blocks, guaranteeing zero memory leaks, zero open handle hangs, and 100% graceful worker teardowns.

### 3.2 Dual-Tier High-Availability Architecture
- **Primary Tier**: Google Gemini 1.5/2.5 Flash via live Generative Language API.
- **Secondary Tier (Autonomous Scientific Fallback)**: If network connectivity is unavailable, the system transparently engages the autonomous domain synthesizer, providing peer-reviewed, science-backed guidance with zero downtime.

---

## 4. Security & OWASP Top 10 Mitigation

| OWASP Vulnerability | Mitigation in AeroShield AI |
|---|---|
| **A01: Broken Access Control** | Strictly bounds request parameters and isolates endpoints via declarative Express routing. |
| **A02: Cryptographic Failures** | Zero plaintext secrets committed; API keys sourced solely via `.env` variables. |
| **A03: Injection (XSS, SQLi)** | Deep recursive input sanitizer (`sanitizeInput`) strips `<script>`, `javascript:`, `vbscript:`, event handlers, and null bytes (`\0`). |
| **A04: Insecure Design** | Rate limiting (`apiLimiter`, `aiLimiter`) prevents brute-force abuse and DoS floods. |
| **A05: Security Misconfiguration** | Helmet security headers: strict CSP (`default-src 'self'`), HSTS (`maxAge: 31536000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. |
| **Prototype Pollution** | Recursive sanitizer explicitly drops `__proto__`, `constructor`, and `prototype` keys from all JSON payloads. |

---

## 5. Verification & Test Suite Coverage

AeroShield AI maintains two testing harnesses:
1. **Jest Test Runner (`npm test`)**: 11 modular test suites covering:
   - `physics.test.js`: IAQ differential mass balance and CADR sizing.
   - `inversion.test.js`: Planetary boundary layer compression and golden window.
   - `impact.test.js`: Personal lung dose and Berkeley Earth cigarette equivalence.
   - `routine.test.js`: 7-phase daily schedule and vulnerability alerts.
   - `hacks.test.js`: Corsi-Rosenthal economics and DIY blueprints.
   - `community.test.js`: Syndicates and pledge counters.
   - `automation.test.js`: NLP task parser, trigger alerts, and IoT YAML generator.
   - `security.test.js`: XSS, prototype pollution, and null byte neutralization.
   - `cache.test.js`: In-memory TTL cache eviction and hit/miss telemetry.
   - `gemini.test.js`: Multi-agent copilot and autonomous knowledge synthesis.
   - `api.test.js`: Full HTTP integration and 400 Bad Request validations.
2. **Autonomous Verification Runner (`npm run test:suite`)**: Custom dependency-free test runner verifying 33 core physical and API benchmarks.
