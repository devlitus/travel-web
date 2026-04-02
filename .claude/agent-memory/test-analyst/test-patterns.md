---
name: test-patterns
description: Patrones de testing probados y convenciones del proyecto Travel Web
type: project
---

## Official Docs (fetch when designing test strategy)

- **Vitest API**: https://vitest.dev/api/
- **Vitest mocking**: https://vitest.dev/guide/mocking.html
- **Astro testing guide**: https://docs.astro.build/en/guides/testing/

# Test Patterns — Travel Web

## Test Setup

- **Framework**: Vitest + happy-dom
- **Config**: `vitest.config.ts` o en `vite.config.ts`
- **Run**: `pnpm test` (all), `pnpm test -- path/to/file.spec.ts` (single)

## File Naming Convention
- `src/utils/clientCache.spec.ts` — junto al archivo fuente
- `src/utils/__tests__/feature.test.ts` — alternativa en carpeta tests

## Mock Patterns

```typescript
// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
vi.stubGlobal('fetch', vi.fn());

// Mock window.toast
vi.stubGlobal('toast', {
  success: vi.fn(), error: vi.fn(), loading: vi.fn(() => 'id'), dismiss: vi.fn()
});
```

## Critical Test Areas (Always Cover)

### 1. Cache System
- Cache key includes ALL params
- Cache miss → API call → cache store
- Cache hit → no API call
- localStorage unavailable (private mode)
- TTL expiry

### 2. Error Handling
- Each error class returns correct statusCode
- `handleApiError()` returns structured Response
- `validateApiKeys()` throws on missing key
- `handleExternalService()` wraps errors as ExternalServiceError

### 3. AI Response Validation
- Valid JSON → parsed correctly
- Truncated JSON (unbalanced braces) → ParseError
- Missing required fields → ParseError
- Empty arrays in daily_plan → validation error

### 4. Field Validation
- `essential_travel_tips` present and non-empty array
- `daily_plan` has >= 2 activities per day
- `budget_overview` has all subcategories

## Priority Matrix

| Area | Priority | Coverage Goal |
|------|----------|---------------|
| Error classes | Critical | 100% |
| Cache logic | Critical | 90%+ |
| AI JSON validation | High | 85%+ |
| API routes | High | 80%+ |
| Components | Medium | 60%+ |
| Utilities | Medium | 70%+ |
