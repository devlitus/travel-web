---
name: commit
description: Guía optimizada de commits siguiendo Conventional Commits
agent: agent
model: Claude Haiku 4.5 (copilot)
argument-hint: Describe tus cambios, valida o genera commits
---

# Commits - Travel Web

**Formato**: `<type>(<scope>): <subject>`

## Tipos

| Tipo     | Uso                          |
| -------- | ---------------------------- |
| feat     | Nueva característica         |
| fix      | Corrección de bugs           |
| docs     | Documentación                |
| test     | Tests                        |
| refactor | Reorganización de código     |
| perf     | Mejoras de rendimiento       |
| style    | Formato (sin lógica)         |
| chore    | Dependencias y mantenimiento |
| ci       | CI/CD                        |

## Scopes

agents • hooks • groq • search • cache • errors • forms • ui • docs • config

## Subject (≤50 caracteres)

- Imperativo: Add, Fix, Update, Remove (no "Added", "Fixed")
- Minúsculas (excepto nombres propios)
- Sin punto final
- Describe QUÉ cambió

```
✅ feat(search): Add destination filtering system
❌ added destination filtering.
```

## Body (Opcional, ≤72 caracteres/línea)

- Separado del subject por línea vacía
- Explica CÓMO y POR QUÉ
- Usa bullet points para cambios principales

```
feat(agents): Implement specialized agent system

- Add Planner, Implementer, Reviewer, TestPlanner agents
- Include seamless handoff system
- Save agents in .claude/agents/

Fixes #15
```

## Reglas Clave

**✅ SIEMPRE**

- Un commit = una feature o fix lógico
- Commits atómicos (revertibles)
- Incluir tests y docs con features
- Referenciar issues: `Fixes #123`
- Código en inglés

**❌ NUNCA**

- Múltiples features en un commit
- Mensajes genéricos ("fix stuff")
- Exponer secretos (API keys, tokens)
- Commits >300 líneas

## Validación Rápida

- [ ] Formato: `<type>(<scope>): <subject>`
- [ ] Type válido (feat, fix, docs, test, etc.)
- [ ] Scope de la lista
- [ ] Subject ≤50 caracteres
- [ ] Body explica QUÉ y POR QUÉ
- [ ] Sin secretos
- [ ] Cambios relacionados

## Usar en VS Code

```
/commit Help me write a commit for the new search feature
/commit Validate: "fix: Fixed bugs"
/commit Generate a commit for Groq API implementation
```

## Herramientas Rápidas

```bash
# Verificar cambios
git diff

# Hacer commit interactivo
git commit

# Corregir último commit
git commit --amend --no-edit

# Ver último commit
git show
```

## Ejemplos

### Feature

```
feat(groq): Add Groq API configuration

- Configure Groq client with environment variables
- Add error handling and validation
- Update documentation

Fixes #18
```

### Fix

```
fix(search): Resolve API timeout in SSR

- Use process.env instead of import.meta.env
- Add proper error handling
- Include debug logging

Fixes #22
```

### Test

```
test(groq): Add API key configuration tests

- Test createGroq with various scenarios
- Test handler validation
- Include mocks for external modules

Fixes #25
```

---

**Referencia**: `<type>(<scope>): <subject>` | Types: feat, fix, docs, test, refactor, perf, style, chore, ci | Scopes: agents, hooks, groq, search, cache, errors, forms, ui, docs, config
