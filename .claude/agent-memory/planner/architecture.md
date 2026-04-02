---
name: architecture
description: Patrones arquitectónicos clave y estructura del proyecto Travel Web
type: project
---

## Official Docs (use WebFetch when needed)

- **Astro 5.x**: https://docs.astro.build/en/getting-started/
- **AI SDK (Vercel)**: https://sdk.vercel.ai/docs — API reference en https://sdk.vercel.ai/docs/reference
- **@ai-sdk/groq**: https://sdk.vercel.ai/providers/ai-sdk-providers/groq
- **Zod**: https://zod.dev
- **Vitest**: https://vitest.dev/guide/

# Architecture Reference — Travel Web

## File Structure Conventions
- Components: `src/components/[ComponentName]/ComponentName.astro`
- Pages: `src/pages/page-name.astro` (kebab-case)
- APIs: `src/pages/api/endpoint-name.ts`
- Utilities: `src/utils/utilityName.ts`
- Tests: junto al archivo o en `src/utils/*.spec.ts`

## API Route Pattern (MANDATORY)
```typescript
export const POST: APIRoute = async ({ request }) => {
  try {
    validateApiKeys({ GROQ_API_KEY });           // 1. Keys
    const validated = schema.parse(data);         // 2. Zod
    const cached = cache.get(key);               // 3. Cache check
    if (cached) return new Response(...);
    const result = await handleExternalService(  // 4. External call
      'ServiceName', async () => { ... }
    );
    if (!result.requiredField) throw new ParseError(...); // 5. Validate
    cache.set(key, result);                      // 6. Cache + return
    return new Response(JSON.stringify(result), { ... });
  } catch (error) {
    return handleApiError(error, { endpoint, params }); // 7. Error
  }
};
```

## Cache System
- **Server cache**: `src/utils/cache.ts` — LRU in-memory con ETag
- **Client cache**: `src/utils/clientCache.ts` — localStorage con TTL
- Cache keys: `hashString(JSON.stringify({ ALL params }))` — incluir TODOS los params

## Error Classes
- `ValidationError(message)` — Zod errors, 400
- `ParseError(message, rawData)` — JSON parse failures, 500
- `ExternalServiceError(service, message)` — API failures, 502
- `ConfigurationError(message)` — Missing API keys, 500

## Toast System
```typescript
window.toast.success(msg, desc?)
window.toast.error(msg, desc?)
window.toast.warning(msg, desc?)
window.toast.info(msg, desc?)
const id = window.toast.loading(msg)  // Returns ID
window.toast.dismiss(id)              // Must dismiss before success/error
```

## Critical Field Names
- `destination_name` (NOT `destination`)
- `essential_travel_tips` (NOT `travel_tips`)
- `duration_days`, `daily_plan`, `budget_overview`

## AI Integration
- Provider: `@ai-sdk/groq`, model: `llama-3.3-70b-versatile`
- `generateText()` with temperature: 0.1, maxOutputTokens: 8192
- System prompt in `src/utils/systemInstructions.ts`
- Response validation: brace balance + required fields + array content

## Component Communication Pattern
- Form → API: `SearchHandler` class with `checkCache()`, `submitSearch()`, `saveToCache()`, `buildRedirectUrl()`
- API → Client: `SearchResult` interface `{ success: boolean, error?: { code, message, description, statusCode } }`
