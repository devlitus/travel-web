---
name: debug-patterns
description: Patrones de debugging y puntos de falla conocidos en Travel Web
type: project
---

## Official Docs (fetch for deep investigation)

- **Astro error reference**: https://docs.astro.build/en/reference/error-reference/
- **AI SDK errors**: https://sdk.vercel.ai/docs/troubleshooting
- **Vitest debugging**: https://vitest.dev/guide/debugging.html

# Debug Patterns — Travel Web

## Investigation Checklist by Symptom

### "API returns 500"
1. Check `validateApiKeys()` — ¿la env var está definida?
2. Check Zod schema — ¿el input matchea el schema?
3. Check `handleExternalService` — ¿Groq API está disponible?
4. Check `transformMarkdownToJson` — ¿el JSON del AI está bien formado?

### "Cache hit but wrong data"
1. Verificar que el cache key incluye TODOS los params del form
2. Revisar TTL del client cache — puede estar expirado pero reusado
3. Verificar que `hashString()` está siendo llamado correctamente

### "JSON parse error from AI"
1. Verificar `validateBraceBalance()` — JSON truncado
2. Revisar que `maxOutputTokens: 8192` está configurado
3. Comprobar si hay texto antes/después del JSON en la respuesta

### "Toast stuck loading"
1. Buscar `window.toast.loading()` sin su correspondiente `dismiss(id)`
2. Verificar que el dismiss está en el `finally` block, no solo en `then`

### "TypeScript build errors"
1. `pnpm run build` primero para ver errores completos
2. Buscar `any` types añadidos recientemente
3. Verificar imports de tipos (`import type` para type-only imports)

## Key Files for Debugging

| Symptom | First File to Check |
|---------|---------------------|
| API errors | `src/pages/api/search.ts` |
| JSON parsing | `src/utils/transformMarkdownToJson.ts` |
| Cache issues | `src/utils/cache.ts` + `src/utils/clientCache.ts` |
| Error handling | `src/utils/errorHandler.ts` + `src/utils/errors.ts` |
| AI prompts | `src/utils/systemInstructions.ts` |
| UI errors | `src/pages/itinerary/[destination].astro` |
| Toast issues | `src/components/Toast/Toaster.astro` |

## Common Root Causes Found

1. **Field naming mismatch** — `travel_tips` en lugar de `essential_travel_tips`
2. **Missing await** — `handleExternalService` sin await causa silencio en errores
3. **Cache key incomplete** — key parcial produce falsos positivos de cache
4. **JSON truncation** — AI excede maxOutputTokens y corta el JSON
5. **localStorage unavailable** — modo privado de browser falla sin try/catch
