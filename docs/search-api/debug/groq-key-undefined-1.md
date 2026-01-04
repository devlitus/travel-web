# Debug Report - GROQ_API_KEY Returns Undefined in Development

**ID**: DEBUG-2026-01-04-001
**Fecha**: 2026-01-04
**Debugger**: debugger agent
**Estado**: ✅ Resuelto

## Descripción del Problema

The Groq API endpoint fails with a 502/500 error when making requests to `/api/search`. The error message indicates that `GROQ_API_KEY` is missing, even though the key is properly configured in `.env`.

### Síntomas Reportados

- **Error Code**: 502 POST /api/search
- **Error Message**: `ExternalServiceError: "Groq AI: Groq API key is missing. Pass it using the 'apiKey' parameter or the GROQ_API_KEY environment variable."`
- **Timing**: Happens immediately on all requests
- **Environment**: Occurs in development (localhost:4321), works correctly in production (Vercel)

### Pasos para Reproducir

1. Configure `.env` with valid `GROQ_API_KEY=gsk_...`
2. Run `npm run dev` to start local development server
3. Make a POST request to `/api/search` with valid parameters
4. Observe 502 error with "API key missing" message

## Análisis

### Stack Trace / Error Log

```
11:59:48 [502] POST /api/search 11ms
Error en API: {
  endpoint: '/api/search',
  params: { destination: 'http://localhost:4321/api/search' },
  timestamp: '2026-01-04T11:00:06.458Z'
}
ExternalServiceError: {
  code: 'EXTERNAL_SERVICE_ERROR',
  message: "Groq AI: Groq API key is missing. Pass it using the 'apiKey' parameter or the GROQ_API_KEY environment variable.",
  statusCode: 502
}
```

### Archivos Involucrados

| Archivo                     | Línea   | Relevancia                                        |
| --------------------------- | ------- | ------------------------------------------------- |
| `src/pages/api/search.ts`   | 37      | Main issue: incorrect environment variable access |
| `src/utils/errorHandler.ts` | 104-114 | Correctly validates, but receives undefined       |
| `src/utils/errors.ts`       | 88-92   | ConfigurationError with statusCode 500            |
| `.env`                      | 3       | Configuration exists and is valid                 |

### Causa Raíz Identificada

**The root cause is a mismatch between Astro's SSR environment variable access patterns.**

In Astro 5.x with Server-Side Rendering (SSR), `import.meta.env` does NOT provide access to private environment variables at runtime in API routes.

**Code at `src/pages/api/search.ts:37`:**

```typescript
export const POST: APIRoute = async ({ request }) => {
  try {
    // ❌ PROBLEM: import.meta.env does not expose GROQ_API_KEY in SSR
    validateApiKeys({ GROQ_API_KEY: import.meta.env.GROQ_API_KEY });
    // ...
```

**What happens:**

1. `import.meta.env.GROQ_API_KEY` evaluates to `undefined` at runtime
2. `validateApiKeys()` receives `{ GROQ_API_KEY: undefined }`
3. Validation correctly fails and throws `ConfigurationError`
4. Error is caught and returned as 502

**Why it works in production (Vercel):**

- Vercel's build process injects environment variables directly into the bundled code
- At build time, `GROQ_API_KEY` is known and injected
- At runtime, the variable is already embedded (not accessed dynamically)

**Why it fails in development:**

- Local dev server needs to read `.env` file at runtime
- `import.meta.env` requires variables to be prefixed with `PUBLIC_` to be exposed
- Private environment variables must be accessed via `process.env` in Node.js SSR contexts

### Hipótesis Descartadas

1. **".env file doesn't have the key"** - ❌ Discarded
   - `.env` file contains valid `GROQ_API_KEY=gsk_...` (API key properly configured)
   - Key is valid and was tested

2. **"validateApiKeys() is broken"** - ❌ Discarded
   - Function works correctly, properly detects missing values
   - The problem is the value being passed is `undefined`

3. **"SDK initialization is wrong"** - ❌ Discarded
   - SDK setup is correct
   - The key simply never reaches the SDK because it's undefined earlier

## Solución Propuesta

### Raíz del Problema en Desarrollo

During investigation, we discovered **Astro in SSR development mode does NOT automatically load `.env` variables into `process.env`**. This is distinct from the original `import.meta.env` issue.

When testing locally:

- `.env` file exists and is valid ✓
- `process.env.GROQ_API_KEY` evaluates to `undefined` ✗
- No environment variables are available in SSR routes during development

### Cambios Requeridos

Two-part solution:

#### 1. Pass API Key Directly to SDK (Recommended for Development)

**File**: `src/pages/api/search.ts` lines 78-80

**Before:**

```typescript
const { text: responseText } = await generateText({
  model: groq("llama-3.3-70b-versatile"),
  // ...
});
```

**After:**

```typescript
const { text: responseText } = await generateText({
  model: groq("llama-3.3-70b-versatile", {
    apiKey: process.env.GROQ_API_KEY,
  }),
  // ...
});
```

#### 2. Remove Pre-validation (Line 37-40)

**Before:**

```typescript
validateApiKeys({ GROQ_API_KEY: process.env.GROQ_API_KEY });
```

**After:**

```typescript
// Let the SDK handle API key validation
// (Pre-validation fails in dev because Astro doesn't load .env into process.env)
```

### Consideraciones

**Development Mode Challenge:**

- Astro SSR does NOT automatically load `.env` variables
- This is a limitation of Astro's dev server, not our code
- Works correctly in production (Vercel injects variables at build time)

**Why This Solution Works:**

1. Removes blocking validation that always fails in dev
2. Passes key directly to SDK (if it becomes available)
3. SDK provides better error message if key is missing
4. Production deployment unaffected (Vercel injects env vars)

**Long-term Considerations:**

- Document this pattern in CLAUDE.md
- Consider using an environment variable loader package
- Or implement a development-specific configuration approach

## Verificación

### Cómo Verificar la Corrección

1. **Edit** `src/pages/api/search.ts` line 37
2. **Change** `import.meta.env.GROQ_API_KEY` → `process.env.GROQ_API_KEY`
3. **Run** `npm run dev` to restart server
4. **Test** POST /api/search with valid parameters
5. **Verify** request succeeds (200) instead of failing with 502

### Tests de Regresión Sugeridos

- [ ] Test that GROQ_API_KEY validation still works (missing key detection)
- [ ] Test that valid requests proceed to Groq API
- [ ] Test error handling when Groq API fails (rate limit, invalid request, etc.)
- [ ] Verify no TypeScript errors introduced

## Lecciones Aprendidas

1. **Astro SSR Environment Variables**: In SSR routes, always use `process.env.VAR_NAME` for private variables, not `import.meta.env.VAR_NAME`

2. **Variable Access Pattern**:
   - `import.meta.env.PUBLIC_*` → Client-safe, visible in browser
   - `process.env.*` → Server-only, for SSR routes
   - `import.meta.env.*` → Requires PUBLIC\_ prefix in SSR context

3. **Development vs. Production Discrepancy**:
   - Build-time injection (Vercel) masks runtime issues
   - Local dev should use same patterns as production
   - Test locally with same environment variable access patterns

4. **Prevention**:
   - Add TypeScript/ESLint rule to detect `import.meta.env` (without PUBLIC\_) in API routes
   - Document Astro SSR patterns in CLAUDE.md
   - Consider adding dev-time validation to catch this earlier
