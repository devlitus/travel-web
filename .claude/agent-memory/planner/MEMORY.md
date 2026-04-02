# Planner Agent Memory

## Project Knowledge

- [architecture.md](architecture.md) — Patrones clave del proyecto y decisiones de diseño
- [decisions.md](decisions.md) — Decisiones arquitectónicas tomadas en planes anteriores

## Quick Reference

**Stack**: Astro 5.x + TypeScript + Groq AI (llama-3.3-70b-versatile) + Vercel
**Package manager**: pnpm
**Testing**: Vitest + happy-dom
**Styles**: Tailwind CSS

**Key constraints**:
- Minimizar JavaScript client-side (`client:idle` o `client:visible`)
- Zod obligatorio para validación de input en APIs
- Dual cache obligatorio: server (LRU) + client (localStorage)
- Errores tipados: AppError → ValidationError / ParseError / ExternalServiceError / ConfigurationError

## Feature History

<!-- El agente actualiza esta sección con features planificadas -->
| Feature | Plan | Status | Date |
|---------|------|--------|------|
