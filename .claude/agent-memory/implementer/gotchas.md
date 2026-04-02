---
name: gotchas
description: Errores comunes y trampas conocidas en Travel Web que el implementer debe evitar
type: project
---

## Official Docs (fetch when implementing)

- **AI SDK API reference**: https://sdk.vercel.ai/docs/reference
- **AI SDK Groq provider**: https://sdk.vercel.ai/providers/ai-sdk-providers/groq
- **Astro API routes**: https://docs.astro.build/en/guides/endpoints/
- **Astro components**: https://docs.astro.build/en/basics/astro-components/
- **Vitest**: https://vitest.dev/api/

# Known Gotchas — Travel Web Implementer

## Critical Rules

1. **Package manager**: SIEMPRE `pnpm`, NUNCA `npm install` o `yarn`
2. **Loading toast**: SIEMPRE dismiss antes de mostrar success/error toast
3. **Cache keys**: SIEMPRE incluir TODOS los params del form, no solo destination
4. **Field names**: `essential_travel_tips` no `travel_tips`, `destination_name` no `destination`
5. **localStorage**: SIEMPRE envolver en try/catch (falla en private browsing)

## Astro-Specific

- Props interface DENTRO del frontmatter (`---`), no fuera
- `client:idle` o `client:visible` preferido sobre `client:load`
- Scripts con `is:inline` si necesitas acceso a `window` inmediatamente
- Para forms: usar `Astro.request.formData()` en SSR o fetch en client-side

## TypeScript Pitfalls

- No usar `any` — si no sabes el tipo, usa `unknown` y haz type narrowing
- `import type` para imports de solo tipos
- Zod schemas deben estar fuera de la función handler (evita re-creación)

## Cache Pitfalls

- El servidor cache es in-memory: se pierde en cada deploy/restart
- El client cache puede no estar disponible: `try { localStorage... } catch {}`
- Cache keys incorrectos dan hits falsos — siempre incluir todos los params

## API Route Pitfalls

- `handleExternalService` es async — siempre `await`
- `handleApiError` retorna `Response`, no hace throw — retornar su resultado
- `validateApiKeys` hace throw si falta la key — no wrappear en try/catch propio

## AI Response Pitfalls

- El JSON puede estar truncado si excede maxOutputTokens (8192)
- Validar `validateBraceBalance()` antes de `JSON.parse()`
- Los campos requeridos pueden estar presentes pero vacíos — validar contenido también
