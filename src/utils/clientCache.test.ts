import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ClientCache, debounce, hashString, searchCache, formCache } from './clientCache';

describe('ClientCache', () => {
    let cache: ClientCache;

    beforeEach(() => {
        localStorage.clear();
        cache = new ClientCache('test');
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('set and get', () => {
        it('should store and retrieve data', () => {
            cache.set('key', { value: 'test-data' });
            const result = cache.get('key');
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

        it('should use prefix in storage keys', () => {
            cache.set('mykey', 'value');
            const storedKey = localStorage.key(0);
            expect(storedKey).toBe('test:mykey');
        });
    });

    describe('expiration (TTL)', () => {
        it('should expire data after TTL', () => {
            vi.useFakeTimers();

            cache.set('expiring-key', 'data', 1000);
            expect(cache.get('expiring-key')).toBe('data');

            vi.advanceTimersByTime(1500);
            expect(cache.get('expiring-key')).toBeNull();

            vi.useRealTimers();
        });

        it('should not expire before TTL', () => {
            vi.useFakeTimers();

            cache.set('key', 'value', 10000);
            vi.advanceTimersByTime(5000);
            expect(cache.get('key')).toBe('value');

            vi.useRealTimers();
        });

        it('should use default TTL of 30 minutes', () => {
            vi.useFakeTimers();

            cache.set('key', 'value');
            vi.advanceTimersByTime(29 * 60 * 1000);
            expect(cache.get('key')).toBe('value');

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

            cache.set('key', 'value', 1000);
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

        it('should return true even for non-existent keys', () => {
            const deleted = cache.delete('non-existent');
            expect(deleted).toBe(true);
        });
    });

    describe('clear', () => {
        it('should remove all items with the same prefix', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');

            expect(cache.getStats().size).toBe(3);

            const removed = cache.clear();

            expect(removed).toBe(3);
            expect(cache.getStats().size).toBe(0);
        });

        it('should not remove items with different prefix', () => {
            const cache1 = new ClientCache('prefix1');
            const cache2 = new ClientCache('prefix2');

            cache1.set('key', 'value1');
            cache2.set('key', 'value2');

            cache1.clear();

            expect(cache1.get('key')).toBeNull();
            expect(cache2.get('key')).toBe('value2');
        });
    });

    describe('cleanup', () => {
        it('should remove only expired items', () => {
            vi.useFakeTimers();

            cache.set('short-lived', 'value1', 1000);
            cache.set('long-lived', 'value2', 100000);

            expect(cache.getStats().size).toBe(2);

            vi.advanceTimersByTime(1500);

            const cleaned = cache.cleanup();

            expect(cleaned).toBe(1);
            expect(cache.get('short-lived')).toBeNull();
            expect(cache.get('long-lived')).toBe('value2');
            expect(cache.getStats().size).toBe(1);

            vi.useRealTimers();
        });

        it('should remove corrupted items', () => {
            localStorage.setItem('test:corrupted', 'invalid-json');

            const cleaned = cache.cleanup();

            expect(cleaned).toBe(1);
            expect(localStorage.getItem('test:corrupted')).toBeNull();
        });
    });

    describe('getStats', () => {
        it('should return correct statistics', () => {
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');

            const stats = cache.getStats();

            expect(stats.size).toBe(2);
            expect(stats.keys).toContain('test:key1');
            expect(stats.keys).toContain('test:key2');
            expect(stats.totalSize).toBeGreaterThan(0);
        });

        it('should return empty stats for empty cache', () => {
            const stats = cache.getStats();

            expect(stats.size).toBe(0);
            expect(stats.keys).toEqual([]);
            expect(stats.totalSize).toBe(0);
        });
    });
});

describe('debounce', () => {
    it('should delay function execution', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 1000);

        debouncedFn('test');
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(mockFn).toHaveBeenCalledWith('test');
        expect(mockFn).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });

    it('should cancel previous calls', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 1000);

        debouncedFn('first');
        vi.advanceTimersByTime(500);

        debouncedFn('second');
        vi.advanceTimersByTime(500);

        debouncedFn('third');
        vi.advanceTimersByTime(1000);

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('third');

        vi.useRealTimers();
    });

    it('should handle multiple arguments', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 1000);

        debouncedFn('arg1', 'arg2', 'arg3');
        vi.advanceTimersByTime(1000);

        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');

        vi.useRealTimers();
    });
});

describe('hashString', () => {
    it('should generate consistent hashes for same input', () => {
        const input = 'test-string';
        const hash1 = hashString(input);
        const hash2 = hashString(input);

        expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
        const hash1 = hashString('string1');
        const hash2 = hashString('string2');

        expect(hash1).not.toBe(hash2);
    });

    it('should return a string', () => {
        const hash = hashString('test');
        expect(typeof hash).toBe('string');
    });

    it('should handle empty strings', () => {
        const hash = hashString('');
        expect(typeof hash).toBe('string');
        expect(hash).toBeTruthy();
    });

    it('should handle special characters', () => {
        const hash = hashString('test@#$%^&*()');
        expect(typeof hash).toBe('string');
        expect(hash).toBeTruthy();
    });

    it('should handle unicode characters', () => {
        const hash = hashString('测试 🎉 café');
        expect(typeof hash).toBe('string');
        expect(hash).toBeTruthy();
    });
});

describe('Cache instances', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should have searchCache instance', () => {
        expect(searchCache).toBeDefined();
        expect(searchCache).toBeInstanceOf(ClientCache);
    });

    it('should have formCache instance', () => {
        expect(formCache).toBeDefined();
        expect(formCache).toBeInstanceOf(ClientCache);
    });

    it('should keep searchCache and formCache separate', () => {
        searchCache.set('key', 'search-value');
        formCache.set('key', 'form-value');

        expect(searchCache.get('key')).toBe('search-value');
        expect(formCache.get('key')).toBe('form-value');
    });
});
