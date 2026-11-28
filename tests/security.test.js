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

  test('neutralizes prototype pollution keys and null bytes', () => {
    const maliciousPayload = JSON.parse('{"__proto__":{"polluted":true},"user":"Safe\\u0000User"}');
    const sanitized = sanitizeInput(maliciousPayload);
    expect(Object.prototype.polluted).toBeUndefined();
    expect(sanitized.polluted).toBeUndefined();
    expect(sanitized.user).toBe('SafeUser');
  });
});
