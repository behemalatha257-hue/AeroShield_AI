const { sanitizeInput } = require('../server/middleware/security');

describe('Security & Sanitization', () => {
  test('strips script tags and dangerous event handlers', () => {
    const dirty = '<script>malicious()</script>Clean air <img src=x onerror=alert(1)>';
    const clean = sanitizeInput(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onerror=');
    expect(clean).toContain('Clean air');
  });

  test('recursively sanitizes deeply nested payloads', () => {
    const payload = {
      user: 'Alice',
      details: {
        bio: 'Hello <script>xss()</script>World'
      }
    };
    const clean = sanitizeInput(payload);
    expect(clean.details.bio).toBe('Hello World');
  });
});
