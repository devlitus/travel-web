---
name: commit
description: Complete guide for writing, validating, and generating feature-based commits following Conventional Commits and Travel Web standards
agent: agent
argument-hint: Describe your changes, ask to validate a commit, or request commit generation
---

# 📝 Guía Completa de Commits - Travel Web

Use este prompt para:
- ✅ **Aprender** las convenciones de commits
- ✅ **Validar** tus mensajes de commit
- ✅ **Generar** commits automáticamente

## Convención de Commits Utilizadas

Seguimos la especificación de **Conventional Commits** para mantener un historial claro y estructurado.

### Formato Base

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

## Tipos de Commits (type)

| Tipo         | Uso                                      | Ejemplo                                          |
| ------------ | ---------------------------------------- | ------------------------------------------------ |
| **feat**     | Nueva característica o feature completa  | `feat(auth): Add user authentication system`     |
| **fix**      | Corrección de bugs                       | `fix(search): Resolve API timeout issue`         |
| **docs**     | Cambios en documentación                 | `docs(guides): Update setup instructions`        |
| **style**    | Formato, espacios, comillas (sin lógica) | `style(components): Format code with Prettier`   |
| **refactor** | Reorganización de código existente       | `refactor(utils): Extract cache logic to module` |
| **perf**     | Mejoras de rendimiento                   | `perf(search): Optimize query caching`           |
| **test**     | Agregar o modificar tests                | `test(api): Add integration tests for search`    |
| **chore**    | Tareas de mantenimiento, dependencias    | `chore(deps): Update dependencies`               |
| **ci**       | Cambios en CI/CD                         | `ci(github): Add workflow for automated tests`   |

---

## Scope (Áreas del Proyecto)

Define el área afectada:

- **agents** - Sistema de agentes (Planner, Implementer, etc.)
- **hooks** - Hooks de desarrollo y validación
- **groq** - Migración e integración de Groq AI
- **search** - Funcionalidad de búsqueda de destinos
- **cache** - Sistema de caché dual (servidor/cliente)
- **errors** - Manejo de errores y validación
- **forms** - Componentes y handlers de formularios
- **ui** - Componentes de interfaz de usuario
- **docs** - Documentación general del proyecto
- **config** - Configuración del proyecto (Astro, TypeScript, etc.)

---

## Estructura del Commit

### Subject (Asunto)

- **Máximo 50 caracteres**
- **Imperativos**: usa verbos directos (Add, Fix, Update, Remove)
- **Minúsculas** (excepto nombres propios)
- **Sin punto final**
- **Describe QUÉ cambió, no POR QUÉ**

✅ `feat(groq): Add Groq API configuration with error handling`
❌ `added groq configuration.`

### Body (Cuerpo)

- **Máximo 72 caracteres por línea**
- **Separado del subject por línea vacía**
- **Explica CÓMO y POR QUÉ cambió (no QUÉ)**
- **Lista cambios principales con bullets**
- **Incluye contexto importante**

### Footer (Pie)

- **Para breaking changes**: `BREAKING CHANGE: description`
- **Para issues relacionados**: `Fixes #123`, `Closes #456`
- **Para co-autores**: `Co-authored-by: name <email>`

---

## Ejemplos de Commits Bien Estructurados

### Ejemplo 1: Feature Completa

```
feat(agents): Implement specialized agent system

- Add Planner agent for creating detailed implementation plans
- Add Implementer agent for executing plans and writing code
- Add Reviewer agent for code quality and best practices auditing
- Add TestPlanner agent for strategic testing and edge case identification
- Include handoff system for seamless agent collaboration
- Save agents in .claude/agents/ with detailed documentation

Refs #15, #22
```

### Ejemplo 2: Bug Fix

```
fix(search): Resolve GROQ_API_KEY undefined in development

- Use process.env instead of import.meta.env for SSR routes
- Add proper environment variable validation
- Include logging for debugging in development mode

Fixes #18
```

### Ejemplo 3: Documentation

```
docs(groq): Create comprehensive testing plans

- Add groq-api-key-config.test-plan.md with 21 test cases
- Document critical path tests for API key configuration
- Identify 6 edge cases and 8 error scenarios
- Include setup requirements and mocking strategy

Relates to #22
```

### Ejemplo 4: Test Addition

```
test(groq): Add unit and integration tests for API key configuration

- Test createGroq configuration with various key scenarios
- Test POST handler validation and logging
- Test error propagation chain
- Include mocks for @ai-sdk/groq and ai SDK modules

Fixes #25
```

---

## Reglas Importantes para Travel Web

### ✅ SIEMPRE

- ✅ Un commit = Una feature o fix lógicamente completo
- ✅ Commits atómicos (pueden revertirse sin afectar otros)
- ✅ Incluir testing y documentación con la feature
- ✅ Referencia issues con `Fixes #123` si aplica
- ✅ Escribe en inglés (consistencia con codebase)

### ❌ NUNCA

- ❌ Mezclar varias features en un commit
- ❌ Commits con mensajes genéricos ("update files", "fix stuff")
- ❌ Commits sin body cuando la feature es compleja
- ❌ Exponer secretos (API keys, passwords, tokens)
- ❌ Commits muy grandes (>300 líneas de código)

---

## 🔍 Validar tu Commit

Antes de hacer push, verifica que tu commit cumpla estos criterios:

### ✅ Format Check

- [ ] Follows format: `<type>(<scope>): <subject>`
- [ ] Type es uno de: feat, fix, docs, style, refactor, perf, test, chore, ci
- [ ] Scope es de la lista: agents, hooks, groq, search, cache, errors, forms, ui, docs, config
- [ ] Subject tiene ≤ 50 caracteres
- [ ] Subject usa imperativo (Add, Fix, Update, NO Added, Fixed)
- [ ] Subject sin punto final

### ✅ Content Check

- [ ] Body explica QUÉ y POR QUÉ (no solo QUÉ)
- [ ] Body con líneas ≤ 72 caracteres
- [ ] Body separado del subject por línea vacía
- [ ] Cambios listados con bullet points
- [ ] Sin mensajes genéricos como "update files"

### ✅ Project Rules Check

- [ ] Un commit = una feature o fix lógico
- [ ] Sin mezcla de múltiples features
- [ ] Sin secretos o API keys
- [ ] Referencias issues si aplica (Fixes #123)
- [ ] Escrito en inglés

---

## 🔨 Generar un Commit

Si necesitas ayuda para generar un commit, proporciona:

1. **Qué cambió**: Los archivos o features modificados
2. **Por qué**: La motivación o problema resuelto
3. **Cómo**: El approach técnico si es relevante
4. **Relacionado**: GitHub issues (ej: #123)

### Proceso de Generación

1. **Analizar** tu descripción
2. **Seleccionar** tipo: feat, fix, docs, test, etc.
3. **Elegir** scope: agents, hooks, groq, search, cache, errors, forms, ui, docs, config
4. **Estructurar** adecuadamente:
   - Subject ≤ 50 caracteres
   - Body con bullet points
   - Footer con referencias
5. **Validar** contra estándares Travel Web

### Tips para Mejores Resultados

| Hacer ✅                | Evitar ❌               |
| ----------------------- | ----------------------- |
| Ser específico          | Usar términos genéricos |
| Listar features         | Escribir párrafos       |
| Mencionar tests         | Olvidar documentación   |
| Referenciar issues      | Dejar vago              |
| Usar términos técnicos  | Ser demasiado extenso   |

---

## Workflow: Cómo Hacer un Commit por Feature

### 1️⃣ Planificar la Feature

```bash
# Identifica los cambios agrupables por característica
git status

# Revisa qué cambios tienes
git diff
```

### 2️⃣ Agrupar Cambios Relacionados

```bash
# Agrupa archivos relacionados a una feature
git add src/pages/api/search.ts src/utils/searchHandler.ts

# O agrega un patrón específico
git add "src/**/*groq*"
```

### 3️⃣ Escribir el Commit

```bash
# Abre editor interactivo para mejor formato
git commit

# O usa línea de comandos para commits simples
git commit -m "feat(search): Add destination filtering system

- Implement multi-criteria search filter
- Add validation with Zod schema
- Include cache integration
- Add comprehensive error handling"
```

### 4️⃣ Verificar el Commit

```bash
# Revisa que el commit se vea bien
git log -1 --stat

# Verifica el contenido
git show
```

---

## Herramientas Útiles

### Mensaje de Commit Interactivo

```bash
# Git abre tu editor preferido
git commit

# Escribes el mensaje con mejor formato
# Guarda y cierra el editor
```

### Amend (Corregir Último Commit)

```bash
# Agregar cambios olvidados
git add src/nuevo-archivo.ts
git commit --amend --no-edit

# Corregir mensaje del último commit
git commit --amend -m "mensaje corregido"
```

### Rebase Interactivo (Reorganizar Commits)

```bash
# Reorganizar últimos N commits
git rebase -i HEAD~3
```

---

## 🚀 Cómo Usar Este Prompt en VS Code

### Obtener Ayuda

```
/commit I added a new search filter feature, can you help me write a proper commit message?
```

### Validar tu Mensaje

```
/commit Is this a good commit message? "fix: Fixed bugs in search"
```

### Generar un Commit

```
/commit I implemented the Groq API migration with tests, documentation and configuration changes
```

### Preguntar sobre Convenciones

```
/commit What scope should I use for cache-related changes?
/commit Show me an example of a feat commit
/commit What are the NEVER rules?
```

---

## Checklist Antes de Hacer Push

- [ ] El commit tiene un mensaje claro y descriptivo
- [ ] El scope (entre paréntesis) es correcto
- [ ] El body explica QUÉ y POR QUÉ
- [ ] No hay secretos o información sensible
- [ ] Los archivos están agrupados lógicamente
- [ ] Es un commit atómico (puede reverterse sin afectar otros)
- [ ] Los tests pasan (si es aplicable)
- [ ] La documentación está actualizada (si es aplicable)

---

## Referencias Rápidas

| Tarea                      | Comando                        |
| -------------------------- | ------------------------------ |
| Ver commits recientes      | `git log --oneline -n 10`      |
| Ver detalles de un commit  | `git show <hash>`              |
| Ver commits de una feature | `git log --grep="feat(scope)"` |
| Ver cambios no commiteados | `git diff`                     |
| Ver cambios staged         | `git diff --staged`            |

---

## Dudas Frecuentes

**P: ¿Puedo hacer un commit con múltiples scopes?**
R: Usa el más relevante. Si realmente necesitas varios, considera hacer múltiples commits.

**P: ¿El body es obligatorio?**
R: Para features complejas o fixes delicados, sí. Para cambios triviales, el subject es suficiente.

**P: ¿Qué pasa si olvido incluir algo?**
R: Usa `git commit --amend` para corregir el último commit antes de hacer push.

**P: ¿Cómo escribo commits en español?**
R: Usa inglés para consistencia con el codebase existente.

**P: ¿Cómo valido si mi commit es bueno?**
R: Usa `/commit` con tu mensaje para validarlo contra los estándares del proyecto.

**P: ¿Puedo hacer que genere el commit automáticamente?**
R: Sí, describe tus cambios en `/commit` y pide que lo genere para ti.

---

## 📋 Resumen Rápido

**Estructura**: `<type>(<scope>): <subject>`

**Tipos principales**: feat, fix, docs, test

**Scopes**: agents, hooks, groq, search, cache, errors, forms, ui, docs, config

**Regla de Oro**: Un commit = Una feature o fix lógicamente completo

**Usar este prompt para**: Aprender, validar, y generar commits
