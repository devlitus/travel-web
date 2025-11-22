# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Travel Web is an Astro 5.x application that generates personalized travel itineraries using Google's Generative AI (Gemini). The app uses a hybrid rendering approach with SSG for static content and SSR for dynamic API routes.

## Development Commands

```bash
npm run dev           # Start dev server at localhost:4321
npm run build         # Build for production
npm run preview       # Preview production build
npm test              # Run Vitest tests
npm test:ui           # Run tests with UI
npm test:coverage     # Run tests with coverage report
```

## Environment Variables Required

```env
GEMINI_API_KEY        # Google Generative AI API key
UNSPLASH_ACCESS_KEY   # Unsplash API key for destination images
```

## Architecture & Key Systems

### 1. **Dual Cache System**

The app implements two independent caching layers:

- **Server Cache** (`src/utils/cache.ts`): In-memory LRU cache for API responses with ETag support
- **Client Cache** (`src/utils/clientCache.ts`): localStorage-based cache with TTL and automatic cleanup

Both caches use content-based keys via `hashString()` for cache invalidation.

### 2. **Error Handling System**

**Custom Error Classes** (`src/utils/errors.ts`):
- `AppError` - Base class with `code`, `message`, `statusCode`, `details`
- `ValidationError` - Zod validation errors (400)
- `ParseError` - JSON parsing failures (500)
- `ExternalServiceError` - API/service failures (502)
- `ConfigurationError` - Missing API keys (500)

**Error Handler** (`src/utils/errorHandler.ts`):
- `handleApiError()` - Centralized error handling with structured logging
- `validateApiKeys()` - Validates required API keys
- `handleExternalService()` - Wrapper for external API calls

**Error Propagation**:
```typescript
// API routes throw typed errors
throw new ParseError("Message", rawData);

// Caught by handleApiError() which returns structured Response
return handleApiError(error, { endpoint, params });

// Client receives SearchResult interface with error details
interface SearchResult {
  success: boolean;
  error?: { code, message, description, statusCode };
}
```

### 3. **Toast Notification System**

Custom toast implementation (`src/components/Toast/Toaster.astro`) with global API:

```typescript
window.toast.success(message, description?)
window.toast.error(message, description?)
window.toast.warning(message, description?)
window.toast.info(message, description?)
window.toast.loading(message) // Returns ID for dismissal
window.toast.dismiss(toastId)
```

The `Toaster` component is globally available via `Layout.astro`.

### 4. **AI Integration Flow**

```
User Form → /api/search → Gemini API → JSON Response → Validation → Cache → Client
```

**Key files**:
- `src/utils/systemInstructions.ts` - Prompt engineering for Gemini
- `src/utils/transformMarkdownToJson.ts` - Parses AI response with validation
- `src/pages/api/search.ts` - Main API endpoint with field validation

**Critical validations**:
- Required fields: `destination_name`, `country`, `duration_days`, `daily_plan`, `budget_overview`, `essential_travel_tips`
- Each day must have ≥2 activities
- Budget overview must have all subcategories
- JSON truncation detection (maxOutputTokens: 8192)

### 5. **Dynamic Routes**

`/itinerary/[destination]` is a dynamic route that:
1. Fetches params from URL query string
2. Calls `/api/search` with form data
3. Renders itinerary client-side via `innerHTML`
4. Handles missing fields gracefully with `?.` operators

### 6. **Form Handler Pattern**

`SearchHandler` class pattern used throughout:
- `checkCache()` - Check localStorage cache
- `saveToCache()` - Save with TTL
- `submitSearch()` - Returns `SearchResult` with typed errors
- `buildRedirectUrl()` - Constructs URL with query params

## Important Patterns

### API Route Structure

All API routes follow this pattern:

```typescript
export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Validate API keys
    validateApiKeys({ KEY_NAME });

    // 2. Parse and validate input with Zod
    const data = await request.json();
    const validated = schema.parse(data);

    // 3. Check cache
    const cached = cache.get(key);
    if (cached) return new Response(...);

    // 4. Call external service with error wrapper
    const result = await handleExternalService('ServiceName', async () => {
      // service call
    });

    // 5. Validate response structure
    if (!result.requiredField) {
      throw new ParseError("Missing field");
    }

    // 6. Cache and return
    cache.set(key, result);
    return new Response(JSON.stringify(result), { ... });

  } catch (error) {
    return handleApiError(error, { endpoint, params });
  }
};
```

### Component Communication

- **Form to API**: Uses `SearchHandler` class with typed `SearchResult`
- **API to Client**: JSON responses with consistent error structure
- **Client notifications**: Global `window.toast` API
- **State persistence**: Dual cache (server + client localStorage)

## Gemini Prompt Engineering

The system instruction (`getTravelSystemInstruction()`) uses:
- Mandatory field requirements with examples
- JSON structure validation rules
- Minimum content requirements (≥5 tips, ≥2 activities/day)
- Full example of valid 2-day itinerary
- Explicit "NO OMIT ANY FIELD" instructions

Responses are validated for:
- Brace balance
- Truncation detection
- Required field presence
- Array content validation

## Testing

Tests use Vitest with happy-dom. Run individual tests:

```bash
npm test -- path/to/test.spec.ts
```

## Deployment

Deployed on Vercel with:
- Adapter: `@astrojs/vercel`
- Sitemap generation (excludes `/api/`)
- Compression and minification enabled
- Asset fingerprinting for cache busting

## Key Gotchas

1. **Field naming**: API uses `essential_travel_tips` (not `travel_tips`)
2. **Cache keys**: Based on ALL form params, not just destination
3. **Loading toasts**: Must be manually dismissed before showing success/error
4. **Validation errors**: Zod errors caught separately from API errors
5. **localStorage**: Falls back gracefully if unavailable (private browsing)
