import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FormHandler } from './formHandler';
import type { FormData } from './formHandler';
import { formCache } from '../../utils/clientCache';

describe('FormHandler', () => {
    let form: HTMLFormElement;
    let activityButtons: NodeListOf<HTMLButtonElement>;
    let formHandler: FormHandler;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        // Create a mock form
        document.body.innerHTML = `
      <form>
        <input type="text" name="destination" value="" />
        <select name="budget">
          <option value="">Select</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="duration">
          <option value="">Select</option>
          <option value="weekend">Weekend</option>
          <option value="1-week">1 Week</option>
        </select>
        <select name="travelStyle">
          <option value="">Select</option>
          <option value="backpacking">Backpacking</option>
          <option value="luxury">Luxury</option>
        </select>
        <select name="accommodation">
          <option value="">Select</option>
          <option value="hotel">Hotel</option>
          <option value="hostel">Hostel</option>
        </select>
        <select name="season">
          <option value="">Select</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
        </select>
        <button type="button" class="activity-btn">
          <span>Playa</span>
        </button>
        <button type="button" class="activity-btn">
          <span>Montaña</span>
        </button>
        <button type="button" class="activity-btn">
          <span>Cultura</span>
        </button>
      </form>
    `;

        form = document.querySelector('form') as HTMLFormElement;
        activityButtons = document.querySelectorAll('.activity-btn') as NodeListOf<HTMLButtonElement>;
        formHandler = new FormHandler(form, activityButtons);
    });

    afterEach(() => {
        localStorage.clear();
        document.body.innerHTML = '';
    });

    describe('constructor', () => {
        it('should initialize with form and activity buttons', () => {
            expect(formHandler).toBeDefined();
            expect(formHandler).toBeInstanceOf(FormHandler);
        });
    });

    describe('getFormData', () => {
        it('should return form data without activities', () => {
            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            const budgetSelect = form.querySelector('[name="budget"]') as HTMLSelectElement;

            destinationInput.value = 'Paris';
            budgetSelect.value = 'medium';

            const formData = formHandler.getFormData();

            expect(formData.destination).toBe('Paris');
            expect(formData.budget).toBe('medium');
            expect(formData.activities).toEqual([]);
        });

        it('should include selected activities', () => {
            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            destinationInput.value = 'Tokyo';

            // Select some activities
            activityButtons[0].classList.add('active');
            activityButtons[2].classList.add('active');

            const formData = formHandler.getFormData();

            expect(formData.destination).toBe('Tokyo');
            expect(formData.activities).toEqual(['Playa', 'Cultura']);
        });

        it('should return all form fields', () => {
            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            const budgetSelect = form.querySelector('[name="budget"]') as HTMLSelectElement;
            const durationSelect = form.querySelector('[name="duration"]') as HTMLSelectElement;
            const travelStyleSelect = form.querySelector('[name="travelStyle"]') as HTMLSelectElement;
            const accommodationSelect = form.querySelector('[name="accommodation"]') as HTMLSelectElement;
            const seasonSelect = form.querySelector('[name="season"]') as HTMLSelectElement;

            destinationInput.value = 'Barcelona';
            budgetSelect.value = 'high';
            durationSelect.value = '1-week';
            travelStyleSelect.value = 'luxury';
            accommodationSelect.value = 'hotel';
            seasonSelect.value = 'summer';

            const formData = formHandler.getFormData();

            expect(formData.destination).toBe('Barcelona');
            expect(formData.budget).toBe('high');
            expect(formData.duration).toBe('1-week');
            expect(formData.travelStyle).toBe('luxury');
            expect(formData.accommodation).toBe('hotel');
            expect(formData.season).toBe('summer');
        });
    });

    describe('saveToCache', () => {
        it('should save form data to cache', async () => {
            vi.useFakeTimers();

            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            destinationInput.value = 'London';

            formHandler.saveToCache();

            // Wait for debounce
            vi.advanceTimersByTime(1000);

            const cached = formCache.get('last-form-data') as FormData;
            expect(cached).toBeDefined();
            expect(cached.destination).toBe('London');

            vi.useRealTimers();
        });

        it('should save activities to cache', async () => {
            vi.useFakeTimers();

            activityButtons[0].classList.add('active');
            activityButtons[1].classList.add('active');

            formHandler.saveToCache();
            vi.advanceTimersByTime(1000);

            const cached = formCache.get('last-form-data') as FormData;
            expect(cached.activities).toEqual(['Playa', 'Montaña']);

            vi.useRealTimers();
        });

        it('should debounce multiple calls', async () => {
            vi.useFakeTimers();

            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;

            destinationInput.value = 'First';
            formHandler.saveToCache();
            vi.advanceTimersByTime(500);

            destinationInput.value = 'Second';
            formHandler.saveToCache();
            vi.advanceTimersByTime(500);

            destinationInput.value = 'Third';
            formHandler.saveToCache();
            vi.advanceTimersByTime(1000);

            const cached = formCache.get('last-form-data') as FormData;
            expect(cached.destination).toBe('Third');

            vi.useRealTimers();
        });
    });

    describe('loadFromCache', () => {
        it('should load form data from cache', () => {
            const cachedData: FormData = {
                destination: 'Rome',
                budget: 'medium',
                duration: '1-week',
                travelStyle: 'backpacking',
                accommodation: 'hostel',
                season: 'summer',
                activities: []
            };

            formCache.set('last-form-data', cachedData);

            formHandler.loadFromCache();

            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            const budgetSelect = form.querySelector('[name="budget"]') as HTMLSelectElement;
            const durationSelect = form.querySelector('[name="duration"]') as HTMLSelectElement;

            expect(destinationInput.value).toBe('Rome');
            expect(budgetSelect.value).toBe('medium');
            expect(durationSelect.value).toBe('1-week');
        });

        it('should restore selected activities', () => {
            const cachedData: FormData = {
                destination: 'Madrid',
                activities: ['Playa', 'Cultura']
            };

            formCache.set('last-form-data', cachedData);

            formHandler.loadFromCache();

            expect(activityButtons[0].classList.contains('active')).toBe(true);
            expect(activityButtons[1].classList.contains('active')).toBe(false);
            expect(activityButtons[2].classList.contains('active')).toBe(true);
        });

        it('should do nothing if no cache exists', () => {
            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            destinationInput.value = 'Original';

            formHandler.loadFromCache();

            expect(destinationInput.value).toBe('Original');
        });

        it('should handle partial cached data', () => {
            const cachedData: FormData = {
                destination: 'Berlin'
                // Other fields missing
            };

            formCache.set('last-form-data', cachedData);

            formHandler.loadFromCache();

            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            expect(destinationInput.value).toBe('Berlin');
        });

        it('should skip activities field when restoring form fields', () => {
            const cachedData: FormData = {
                destination: 'Amsterdam',
                budget: 'high',
                activities: ['Playa']
            };

            formCache.set('last-form-data', cachedData);

            formHandler.loadFromCache();

            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            const budgetSelect = form.querySelector('[name="budget"]') as HTMLSelectElement;

            expect(destinationInput.value).toBe('Amsterdam');
            expect(budgetSelect.value).toBe('high');
            expect(activityButtons[0].classList.contains('active')).toBe(true);
        });
    });

    describe('integration tests', () => {
        it('should save and load complete form state', async () => {
            vi.useFakeTimers();

            // Fill form
            const destinationInput = form.querySelector('[name="destination"]') as HTMLInputElement;
            const budgetSelect = form.querySelector('[name="budget"]') as HTMLSelectElement;

            destinationInput.value = 'Vienna';
            budgetSelect.value = 'medium';
            activityButtons[1].classList.add('active');

            // Save
            formHandler.saveToCache();
            vi.advanceTimersByTime(1000);

            // Clear form
            destinationInput.value = '';
            budgetSelect.value = '';
            activityButtons[1].classList.remove('active');

            // Load
            formHandler.loadFromCache();

            // Verify
            expect(destinationInput.value).toBe('Vienna');
            expect(budgetSelect.value).toBe('medium');
            expect(activityButtons[1].classList.contains('active')).toBe(true);

            vi.useRealTimers();
        });
    });
});
