const cacheService = require('../server/services/cacheService');

describe('In-Memory High-Performance TTL Cache', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  test('stores, retrieves, and handles cache hit/miss statistics', () => {
    cacheService.set('key1', { value: 123 }, 60);
    expect(cacheService.has('key1')).toBe(true);

    const data = cacheService.get('key1');
    expect(data.value).toBe(123);

    const missed = cacheService.get('nonexistent');
    expect(missed).toBeNull();

    const stats = cacheService.getStats();
    expect(stats.hits).toBe(2); // has() calls get() + direct get()
    expect(stats.misses).toBe(1);
  });

  test('expires entries past their TTL', async () => {
    cacheService.set('shortKey', 'temporary', 0.05); // 50ms
    await new Promise(r => setTimeout(r, 60));
    expect(cacheService.get('shortKey')).toBeNull();
  });
});
