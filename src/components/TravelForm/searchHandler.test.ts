import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchHandler } from './searchHandler';
import { searchCache } from '../../utils/clientCache';

describe('SearchHandler', () => {
    let searchHandler: SearchHandler;

    beforeEach(() => {
        localStorage.clear();
        searchHandler = new SearchHandler();

        // Mock fetch globally
        global.fetch = vi.fn();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('checkCache', () => {
        it('should return null for non-existent cache', () => {
            const formData = {
                destination: 'Paris',
                budget: 'medium'
            };

            const result = searchHandler.checkCache(formData);
            expect(result).toBeNull();
        });

        it('should return cached data if it exists', () => {
            const formData = {
                destination: 'Paris',
                budget: 'medium'
            };

            const cachedResult = {
                itinerary: 'Test itinerary',
                destination: 'Paris'
            };

            // Save to cache first
            searchHandler.saveToCache(formData, cachedResult);

            // Check cache
            const result = searchHandler.checkCache(formData);
            expect(result).toEqual(cachedResult);
        });

        it('should generate consistent cache keys for same data', () => {
            const formData1 = {
                destination: 'London',
                budget: 'high',
                duration: '1-week'
            };

            const formData2 = {
                destination: 'London',
                budget: 'high',
                duration: '1-week'
            };

            const cachedResult = { data: 'test' };
            searchHandler.saveToCache(formData1, cachedResult);

            const result = searchHandler.checkCache(formData2);
            expect(result).toEqual(cachedResult);
        });

        it('should return null for different form data', () => {
            const formData1 = {
                destination: 'Paris',
                budget: 'low'
            };

            const formData2 = {
                destination: 'Paris',
                budget: 'high'
            };

            searchHandler.saveToCache(formData1, { data: 'test' });

            const result = searchHandler.checkCache(formData2);
            expect(result).toBeNull();
        });
    });

    describe('saveToCache', () => {
        it('should save search result to cache', () => {
            const formData = {
                destination: 'Tokyo',
                budget: 'medium'
            };

            const result = {
                itinerary: 'Tokyo itinerary',
                activities: ['Temples', 'Food']
            };

            searchHandler.saveToCache(formData, result);

            const cached = searchHandler.checkCache(formData);
            expect(cached).toEqual(result);
        });

        it('should overwrite existing cache for same key', () => {
            const formData = {
                destination: 'Rome',
                budget: 'low'
            };

            searchHandler.saveToCache(formData, { version: 1 });
            searchHandler.saveToCache(formData, { version: 2 });

            const cached = searchHandler.checkCache(formData);
            expect(cached).toEqual({ version: 2 });
        });
    });

    describe('buildRedirectUrl', () => {
        it('should build URL with destination', () => {
            const url = searchHandler.buildRedirectUrl('Paris', {}, []);

            expect(url).toContain('/itinerary/Paris');
        });

        it('should encode destination with special characters', () => {
            const url = searchHandler.buildRedirectUrl('São Paulo', {}, []);

            expect(url).toContain('/itinerary/S%C3%A3o%20Paulo');
        });

        it('should include form data as query parameters', () => {
            const formData = {
                destination: 'London',
                budget: 'high',
                duration: '1-week',
                travelStyle: 'luxury'
            };

            const url = searchHandler.buildRedirectUrl('London', formData, []);

            expect(url).toContain('budget=high');
            expect(url).toContain('duration=1-week');
            expect(url).toContain('travelStyle=luxury');
        });

        it('should exclude destination from query parameters', () => {
            const formData = {
                destination: 'Barcelona',
                budget: 'medium'
            };

            const url = searchHandler.buildRedirectUrl('Barcelona', formData, []);

            expect(url).not.toContain('destination=');
            expect(url).toContain('budget=medium');
        });

        it('should include activities as multiple parameters', () => {
            const activities = ['Playa', 'Montaña', 'Cultura'];

            const url = searchHandler.buildRedirectUrl('Madrid', {}, activities);

            expect(url).toContain('activities=Playa');
            expect(url).toContain('activities=Monta%C3%B1a');
            expect(url).toContain('activities=Cultura');
        });

        it('should handle empty activities array', () => {
            const url = searchHandler.buildRedirectUrl('Berlin', { budget: 'low' }, []);

            expect(url).toContain('/itinerary/Berlin');
            expect(url).toContain('budget=low');
            expect(url).not.toContain('activities=');
        });

        it('should skip empty values in form data', () => {
            const formData = {
                destination: 'Vienna',
                budget: 'medium',
                duration: '',
                travelStyle: undefined as any,
                accommodation: null as any
            };

            const url = searchHandler.buildRedirectUrl('Vienna', formData, []);

            expect(url).toContain('budget=medium');
            expect(url).not.toContain('duration=');
            expect(url).not.toContain('travelStyle=');
            expect(url).not.toContain('accommodation=');
        });

        it('should filter out null/undefined activities', () => {
            const activities = ['Beach', null as any, 'Mountain', undefined as any, 'Culture'];

            const url = searchHandler.buildRedirectUrl('Nice', {}, activities);

            expect(url).toContain('activities=Beach');
            expect(url).toContain('activities=Mountain');
            expect(url).toContain('activities=Culture');
        });

        it('should build complete URL with all parameters', () => {
            const formData = {
                destination: 'Amsterdam',
                budget: 'high',
                duration: '2-weeks',
                travelStyle: 'luxury',
                accommodation: 'hotel',
                season: 'summer'
            };

            const activities = ['Museums', 'Canals'];

            const url = searchHandler.buildRedirectUrl('Amsterdam', formData, activities);

            expect(url).toContain('/itinerary/Amsterdam');
            expect(url).toContain('budget=high');
            expect(url).toContain('duration=2-weeks');
            expect(url).toContain('travelStyle=luxury');
            expect(url).toContain('accommodation=hotel');
            expect(url).toContain('season=summer');
            expect(url).toContain('activities=Museums');
            expect(url).toContain('activities=Canals');
        });
    });

    describe('submitSearch', () => {
        it('should submit search successfully', async () => {
            const formData = {
                destination: 'Paris',
                budget: 'medium'
            };

            const mockResponse = {
                success: true,
                itinerary: 'Paris itinerary'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await searchHandler.submitSearch(formData);

            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        });

        it('should cache the result after successful submission', async () => {
            const formData = {
                destination: 'Tokyo',
                budget: 'high'
            };

            const mockResponse = {
                itinerary: 'Tokyo itinerary'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            await searchHandler.submitSearch(formData);

            const cached = searchHandler.checkCache(formData);
            expect(cached).toEqual(mockResponse);
        });

        it('should return false on API error', async () => {
            const formData = {
                destination: 'London',
                budget: 'low'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                statusText: 'Internal Server Error'
            });

            const result = await searchHandler.submitSearch(formData);

            expect(result).toBe(false);
        });

        it('should not cache failed requests', async () => {
            const formData = {
                destination: 'Berlin',
                budget: 'medium'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                statusText: 'Bad Request'
            });

            await searchHandler.submitSearch(formData);

            const cached = searchHandler.checkCache(formData);
            expect(cached).toBeNull();
        });

        it('should handle network errors', async () => {
            const formData = {
                destination: 'Rome',
                budget: 'high'
            };

            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            const result = await searchHandler.submitSearch(formData);

            expect(result).toBe(false);
        });

        it('should log errors to console', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const formData = {
                destination: 'Madrid',
                budget: 'low'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                statusText: 'Not Found'
            });

            await searchHandler.submitSearch(formData);

            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });

        it('should send complete form data including activities', async () => {
            const formData = {
                destination: 'Barcelona',
                budget: 'medium',
                duration: '1-week',
                activities: ['Beach', 'Culture']
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await searchHandler.submitSearch(formData);

            expect(global.fetch).toHaveBeenCalledWith('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        });
    });

    describe('integration tests', () => {
        it('should handle complete search flow', async () => {
            const formData = {
                destination: 'Prague',
                budget: 'medium',
                duration: '1-week',
                travelStyle: 'backpacking',
                activities: ['Culture', 'Food']
            };

            const mockResponse = {
                itinerary: 'Prague itinerary',
                destination: 'Prague'
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            // Submit search
            const submitResult = await searchHandler.submitSearch(formData);
            expect(submitResult).toBe(true);

            // Check cache
            const cachedResult = searchHandler.checkCache(formData);
            expect(cachedResult).toEqual(mockResponse);

            // Build redirect URL
            const url = searchHandler.buildRedirectUrl(
                formData.destination,
                formData,
                formData.activities
            );

            expect(url).toContain('/itinerary/Prague');
            expect(url).toContain('budget=medium');
            expect(url).toContain('activities=Culture');
            expect(url).toContain('activities=Food');
        });
    });
});
