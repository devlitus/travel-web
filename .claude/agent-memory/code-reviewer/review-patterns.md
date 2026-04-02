---
name: review-patterns
description: Patrones de issues recurrentes en reviews de código del proyecto Travel Web
type: project
---

# Recurring Review Issues — Travel Web

## High Priority Checklist

Always verify these in every review:

### API Routes
- [ ] `validateApiKeys()` llamado PRIMERO
- [ ] Input validado con Zod schema
- [ ] Cache key incluye TODOS los params (no solo destination)
- [ ] `handleExternalService()` wrappea todas las llamadas externas
- [ ] Response validada antes de cachear
- [ ] `handleApiError()` en el catch (no throw manual)

### Error Handling
- [ ] Clase de error correcta usada (Ver jerarquía en CLAUDE.md)
- [ ] No `catch (e) {}` vacíos
- [ ] No `console.log` en producción

### Field Naming
- [ ] `essential_travel_tips` (no `travel_tips`)
- [ ] `destination_name` (no `destination`)
- [ ] `duration_days`, `daily_plan`, `budget_overview` correctos

### Client-Side
- [ ] Loading toast dismissed antes de success/error
- [ ] localStorage access en try/catch
- [ ] Optional chaining `?.` en datos dinámicos de la API
- [ ] Minimizar client-side JS

### TypeScript
- [ ] No `any` types
- [ ] `import type` para type imports
- [ ] Props interface definida para componentes Astro

## Common Mistakes Found

1. **Wrong field names** — `travel_tips` en vez de `essential_travel_tips`
2. **Incomplete cache keys** — falta algún param del form
3. **Missing error class** — usar `Error` genérico en vez de `ParseError`/`ExternalServiceError`
4. **Toast not dismissed** — loading toast queda activo después de success
5. **Missing await** — `handleExternalService` sin await
