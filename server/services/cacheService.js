/**
 * AeroShield AI - In-Memory High-Performance TTL Cache
 * Ensures fast sub-millisecond retrieval and low memory footprint.
 */

class CacheService {
  constructor(defaultTTLSeconds = 300, maxEntries = 500) {
    this.defaultTTL = defaultTTLSeconds * 1000;
    this.maxEntries = maxEntries;
    this.store = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  set(key, value, ttlSeconds = null) {
    // Evict oldest entry if capacity reached
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) {
        this.store.delete(firstKey);
        this.stats.evictions++;
      }
    }

    const ttl = (ttlSeconds !== null ? ttlSeconds * 1000 : this.defaultTTL);
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now()
    });
  }

  has(key) {
    const val = this.get(key);
    return val !== null;
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + '%' : '0%';
    return {
      size: this.store.size,
      maxEntries: this.maxEntries,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      evictions: this.stats.evictions
    };
  }
}

module.exports = new CacheService();
