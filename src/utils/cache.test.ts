import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryCache, generateETag, generateCacheKey, CACHE_HEADERS } from './cache';

describe('MemoryCache', () => {
    let cache: MemoryCache;

    beforeEach(() => {
        cache = new MemoryCache();
    });

    describe('set and get', () => {
        it('should store and retrieve data', () => {
            cache.set('test-key', { value: 'test-data' });
            const result = cache.get('test-key');
            expect(result).toEqual({ value: 'test-data' });
        });

        it('should return null for non-existent keys', () => {
            const result = cache.get('non-existent');
            expect(result).toBeNull();
        });

        it('should handle different data types', () => {
            cache.set('string', 'hello');
            cache.set('number', 42);
            cache.set('boolean', true);
            cache.set('array', [1, 2, 3]);
            cache.set('object', { a: 1, b: 2 });

            expect(cache.get('string')).toBe('hello');
            expect(cache.get('number')).toBe(42);
            expect(cache.get('boolean')).toBe(true);
            expect(cache.get('array')).toEqual([1, 2, 3]);
            expect(cache.get('object')).toEqual({ a: 1, b: 2 });
        });
    });

    describe('expiration (TTL)', () => {
        it('should expire data after TTL', () => {
            vi.useFakeTimers();

            // Set with 1 second TTL
            cache.set('expiring-key', 'data', 1);

            // Should exist immediately
            expect(cache.get('expiring-key')).toBe('data');

            // Advance time by 1.5 seconds
            vi.advanceTimersByTime(1500);

            // Should be expired
            expect(cache.get('expiring-key')).toBeNull();

            vi.useRealTimers();
        });

        it('should not expire before TTL', () => {
            vi.useFakeTimers();

            cache.set('key', 'value', 10);

            // Advance by 5 seconds (less than TTL)
            vi.advanceTimersByTime(5000);

            expect(cache.get('key')).toBe('value');

            vi.useRealTimers();
        });

        it('should use default TTL of 1 hour', () => {
            vi.useFakeTimers();

            cache.set('key', 'value');

            // Advance by 59 minutes
            vi.advanceTimersByTime(59 * 60 * 1000);
            expect(cache.get('key')).toBe('value');

            // Advance by 2 more minutes (total 61 minutes)
            vi.advanceTimersByTime(2 * 60 * 1000);
            expect(cache.get('key')).toBeNull();

            vi.useRealTimers();
        });
    });

    describe('has', () => {
        it('should return true for existing keys', () => {
            cache.set('key', 'value');
            expect(cache.has('key')).toBe(true);
        });

        it('should return false for non-existent keys', () => {
            expect(cache.has('non-existent')).toBe(false);
        });

        it('should return false for expired keys', () => {
            vi.useFakeTimers();

            cache.set('key', 'value', 1);
            expect(cache.has('key')).toBe(true);

            vi.advanceTimersByTime(1500);
            expect(cache.has('key')).toBe(false);

            vi.useRealTimers();
        });
    });

    describe('delete', () => {
        it('should delete existing keys', () => {
            cache.set('key', 'value');
            expect(cache.has('key')).toBe(true);

            const deleted = cache.delete('key');
            expect(deleted).toBe(true);
            expect(cache.has('key')).toBe(false);
        });

        it('should return false for non-existent keys', () => {
            const deleted = cache.delete('non-existent');
            expect(deleted).toBe(false);
        });
    });

    describe('clear', () => {
        it('should remove all items', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            expect(cache.getStats().size).toBe(3);

            cache.clear();

            expect(cache.getStats().size).toBe(0);
            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBeNull();
            expect(cache.get('key3')).toBeNull();
        });
    });

    describe('getStats', () => {
        it('should return correct statistics', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            const stats = cache.getStats();

            expect(stats.size).toBe(2);
            expect(stats.keys).toContain('key1');
            expect(stats.keys).toContain('key2');
        });

        it('should return empty stats for empty cache', () => {
            const stats = cache.getStats();

            expect(stats.size).toBe(0);
            expect(stats.keys).toEqual([]);
        });
    });

    describe('cleanup', () => {
        it('should remove only expired items', () => {
            vi.useFakeTimers();

            cache.set('short-lived', 'value1', 1);
            cache.set('long-lived', 'value2', 100);

            expect(cache.getStats().size).toBe(2);

            // Advance time to expire first item
            vi.advanceTimersByTime(1500);

            const cleaned = cache.cleanup();

            expect(cleaned).toBe(1);
            expect(cache.get('short-lived')).toBeNull();
            expect(cache.get('long-lived')).toBe('value2');
            expect(cache.getStats().size).toBe(1);

            vi.useRealTimers();
        });

        it('should return 0 when no items are expired', () => {
            cache.set('key1', 'value1', 100);
            cache.set('key2', 'value2', 100);

            const cleaned = cache.cleanup();

            expect(cleaned).toBe(0);
            expect(cache.getStats().size).toBe(2);
        });
    });
});

describe('generateETag', () => {
    it('should generate consistent ETags for same data', () => {
        const data = { key: 'value', number: 42 };
        const etag1 = generateETag(data);
        const etag2 = generateETag(data);

        expect(etag1).toBe(etag2);
    });

    it('should generate different ETags for different data', () => {
        const data1 = { key: 'value1' };
        const data2 = { key: 'value2' };

        const etag1 = generateETag(data1);
        const etag2 = generateETag(data2);

        expect(etag1).not.toBe(etag2);
    });

    it('should return a quoted string', () => {
        const etag = generateETag({ test: 'data' });

        expect(etag).toMatch(/^".*"$/);
    });

    it('should handle arrays', () => {
        const data = [1, 2, 3, 4, 5];
        const etag = generateETag(data);

        expect(etag).toBeTruthy();
        expect(typeof etag).toBe('string');
    });
});

describe('generateCacheKey', () => {
    it('should generate consistent keys for same params', () => {
        const params = { destination: 'Paris', budget: 'medium' };
        const key1 = generateCacheKey('search', params);
        const key2 = generateCacheKey('search', params);

        expect(key1).toBe(key2);
    });

    it('should generate same key regardless of param order', () => {
        const params1 = { destination: 'Paris', budget: 'medium' };
        const params2 = { budget: 'medium', destination: 'Paris' };

        const key1 = generateCacheKey('search', params1);
        const key2 = generateCacheKey('search', params2);

        expect(key1).toBe(key2);
    });

    it('should include prefix in the key', () => {
        const params = { test: 'value' };
        const key = generateCacheKey('myprefix', params);

        expect(key).toContain('myprefix');
    });

    it('should handle special characters in values', () => {
        const params = { destination: 'São Paulo', query: 'test&value=1' };
        const key = generateCacheKey('search', params);

        expect(key).toBeTruthy();
        expect(typeof key).toBe('string');
    });

    it('should generate different keys for different params', () => {
        const params1 = { destination: 'Paris' };
        const params2 = { destination: 'London' };

        const key1 = generateCacheKey('search', params1);
        const key2 = generateCacheKey('search', params2);

        expect(key1).not.toBe(key2);
    });
});

describe('CACHE_HEADERS', () => {
    it('should have API_LONG headers', () => {
        expect(CACHE_HEADERS.API_LONG).toBeDefined();
        expect(CACHE_HEADERS.API_LONG['Cache-Control']).toContain('public');
    });

    it('should have API_SHORT headers', () => {
        expect(CACHE_HEADERS.API_SHORT).toBeDefined();
        expect(CACHE_HEADERS.API_SHORT['Cache-Control']).toContain('public');
    });

    it('should have STATIC headers', () => {
        expect(CACHE_HEADERS.STATIC).toBeDefined();
        expect(CACHE_HEADERS.STATIC['Cache-Control']).toContain('immutable');
    });

    it('should have NO_CACHE headers', () => {
        expect(CACHE_HEADERS.NO_CACHE).toBeDefined();
        expect(CACHE_HEADERS.NO_CACHE['Cache-Control']).toContain('no-cache');
    });
});
