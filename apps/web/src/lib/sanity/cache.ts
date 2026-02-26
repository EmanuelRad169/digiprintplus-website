/**
 * Simple in-memory cache for Sanity queries
 * Prevents duplicate fetches during the same request
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private ttl: number;

  constructor(ttlSeconds: number = 60) {
    this.ttl = ttlSeconds * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Create a singleton instance
export const sanityCache = new QueryCache(60); // 60 second TTL

/**
 * Wrap a Sanity query with caching
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
): Promise<T> {
  // Check cache first
  const cached = sanityCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute query
  const result = await queryFn();

  // Cache the result
  sanityCache.set(key, result);

  return result;
}
