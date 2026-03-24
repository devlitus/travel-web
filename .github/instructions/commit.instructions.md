# Instrucciones de Commits - Travel Web

Guía completa para escribir, validar y generar commits siguiendo Conventional Commits.

## Formato Base

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Tipos de Commits

| Tipo     | Uso                          | Ejemplo                                    |
| -------- | ---------------------------- | ------------------------------------------ |
| feat     | Nueva característica         | `feat(search): Add destination filtering`  |
| fix      | Corrección de bugs           | `fix(api): Resolve timeout in SSR`         |
| docs     | Documentación                | `docs(guides): Update setup instructions`  |
| test     | Tests y cobertura            | `test(groq): Add configuration tests`      |
| refactor | Reorganización de código     | `refactor(cache): Extract logic to module` |
| perf     | Mejoras de rendimiento       | `perf(search): Optimize query caching`     |
| style    | Formato, espacios, comillas  | `style(components): Format with Prettier`  |
| chore    | Dependencias y mantenimiento | `chore(deps): Update packages`             |
| ci       | Cambios en CI/CD             | `ci(github): Add automated test workflow`  |

## Scopes - Áreas del Proyecto

- **agents** - Sistema de agentes (Planner, Implementer, Reviewer, TestPlanner)
- **hooks** - Hooks de desarrollo y validación
- **groq** - Migración e integración de Groq AI
- **search** - Funcionalidad de búsqueda de destinos
- **cache** - Sistema de caché dual (servidor/cliente)
- **errors** - Manejo de errores y validación
- **forms** - Componentes y handlers de formularios
- **ui** - Componentes de interfaz de usuario
- **docs** - Documentación general
- **config** - Configuración del proyecto

## Estructura Detallada

### Subject (Asunto)

**Reglas:**

- ≤ 50 caracteres
- Modo imperativo: Add, Fix, Update, Remove (NO Added, Fixed)
- Minúsculas (excepto nombres propios)
- Sin punto final
- Describe QUÉ cambió, no POR QUÉ

**Ejemplos:**

```
✅ feat(groq): Add API key configuration
✅ fix(search): Resolve timeout in SSR
❌ added groq configuration (no imperativo)
❌ Updated the search component (mayúscula)
```

### Body (Cuerpo)

**Reglas:**

- Separado del subject por línea vacía
- ≤ 72 caracteres por línea
- Explica CÓMO y POR QUÉ, no QUÉ
- Lista cambios principales con bullet points
- Contexto importante de la implementación

**Ejemplo:**

```
feat(agents): Implement specialized agent system

- Add Planner agent for creating implementation plans
- Add Implementer agent for executing plans
- Add Reviewer agent for code quality auditing
- Add TestPlanner for strategic testing
- Include seamless handoff system between agents
- Save agents in .claude/agents/ directory
- Update documentation with agent capabilities

This enables structured approach to complex tasks with
proper separation of concerns and collaborative workflow.
```

### Footer (Pie)

**Tipos:**

- Breaking changes: `BREAKING CHANGE: description`
- Issues: `Fixes #123`, `Closes #456`, `Relates #789`
- Co-autores: `Co-authored-by: name <email>`

**Ejemplo:**

```
Fixes #18
Relates #22
Co-authored-by: Maria <maria@example.com>
```

## Reglas del Proyecto

### ✅ SIEMPRE

- Un commit = una feature o fix lógicamente completo
- Commits atómicos (pueden revertirse sin afectar otros)
- Incluir tests y documentación con features
- Referenciar issues cuando aplique
- Escribir en inglés (consistencia con codebase)
- Cambios relacionados en un solo commit

### ❌ NUNCA

- Mezclar múltiples features en un commit
- Mensajes genéricos ("update files", "fix stuff")
- Commits sin body cuando son complejos
- Exponer secretos (API keys, passwords, tokens)
- Commits > 300 líneas de código
- Commits sin relacionar a ningún issue (si existe)

## Workflow: Hacer un Commit por Feature

### 1. Planificar

```bash
# Ver cambios pendientes
git status

# Revisar qué cambió
git diff
```

### 2. Agrupar Cambios Relacionados

```bash
# Agregar archivos de una feature
git add src/pages/api/search.ts src/utils/searchHandler.ts

# O con patrón
git add "src/**/*groq*"

# Ver cambios staged
git diff --staged
```

### 3. Escribir Commit

```bash
# Modo interactivo (recomendado para commits complejos)
git commit

# Modo línea de comandos (para commits simples)
git commit -m "feat(search): Add destination filtering

- Implement multi-criteria filter
- Add Zod validation
- Include cache integration
- Add error handling

Fixes #34"
```

### 4. Verificar

```bash
# Ver commit creado
git log -1 --stat

# Ver contenido completo
git show

# Ver cambios del commit
git show --name-status
```

## Casos de Uso Comunes

### Nueva Feature Completa

```
feat(groq): Add Groq API configuration system

- Configure Groq client with environment variables
- Add POST endpoint for API key configuration
- Implement error handling and validation
- Add logging for debugging
- Create .env.example template
- Update README with setup instructions

Fixes #18
```

### Bug Fix

```
fix(search): Resolve GROQ_API_KEY undefined in SSR

- Use process.env instead of import.meta.env for SSR routes
- Add environment variable validation
- Add console logging for debugging development
- Handle missing keys gracefully

Fixes #22
```

### Test Suite

```
test(groq): Add configuration tests

- Test createGroq with various key scenarios
- Test POST handler validation and error cases
- Test error propagation and logging
- Add mocks for @ai-sdk/groq module

Fixes #25
```

### Documentation

```
docs(agents): Add agent system architecture guide

- Document Planner agent responsibilities
- Document Implementer agent workflow
- Document Reviewer agent auditing process
- Document TestPlanner test strategy
- Include agent handoff examples

Relates #15
```

### Refactoring

```
refactor(cache): Extract caching logic to separate module

- Move caching logic from utils to cache.ts
- Create CacheManager class
- Add type-safe cache operations
- Maintain backward compatibility
- Update imports across codebase

No functional changes, improves maintainability.
```

## Validación Antes de Push

### Checklist de Formato

- [ ] Formato correcto: `<type>(<scope>): <subject>`
- [ ] Type es válido (feat, fix, docs, test, refactor, perf, style, chore, ci)
- [ ] Scope está en la lista
- [ ] Subject tiene ≤ 50 caracteres
- [ ] Subject usa modo imperativo
- [ ] Subject sin punto final
- [ ] Subject minúsculas (excepto nombres propios)

### Checklist de Contenido

- [ ] Body explica CÓMO y POR QUÉ
- [ ] Body tiene líneas ≤ 72 caracteres
- [ ] Body separado de subject por línea vacía
- [ ] Cambios listados con bullet points
- [ ] Sin mensajes genéricos
- [ ] Contexto claro de la implementación

### Checklist de Reglas del Proyecto

- [ ] Un commit = una feature/fix lógico
- [ ] Sin múltiples features mezcladas
- [ ] Sin secretos o credentials
- [ ] Referencia issues si aplica (Fixes #123)
- [ ] Escrito en inglés
- [ ] Cambios atómicos y revertibles

## Herramientas Útiles

### Corregir Último Commit

```bash
# Agregar cambios olvidados
git add archivo-olvidado.ts
git commit --amend --no-edit

# Cambiar mensaje del último commit
git commit --amend -m "nuevo mensaje"

# Deshacer último commit sin perder cambios
git reset --soft HEAD~1
```

### Reorganizar Commits

```bash
# Rebase interactivo últimos N commits
git rebase -i HEAD~3

# En el editor, cambiar "pick" a "reword", "squash", etc.
```

### Ver Historial

```bash
# Commits recientes
git log --oneline -n 10

# Commits de un tipo
git log --grep="^feat"

# Commits de un scope
git log --grep="^feat(search)"

# Commits que modifican archivo
git log -- src/pages/api/search.ts

# Detalles de commit
git show <hash>

# Diferencias en commit
git show <hash> --stat
```

## Preguntas Frecuentes

**P: ¿Puedo hacer un commit con múltiples scopes?**
R: Usa el scope más relevante. Si son realmente independientes, considera múltiples commits atómicos.

**P: ¿El body es obligatorio?**
R: Para features complejas sí. Para cambios triviales el subject es suficiente, pero es mejor siempre incluir contexto.

**P: ¿Qué hago si committé algo incorrecto?**
R: Antes de push, usa `git commit --amend` o `git rebase -i`. Después de push, crea un nuevo commit con `git revert`.

**P: ¿Cómo formularizo commit messages?**
R: Piensa que el commit completa la frase: "Si aplicamos este commit, esto...". Usa el imperativo.

**P: ¿Puedo escribir en español?**
R: Usa inglés para consistencia con el codebase existente y estándares del proyecto.

**P: ¿Qué commits no son atómicos?**
R: Commits que mezclan feature + refactor, fixes + features, o varios cambios lógicamente separables.

## Referencias Rápidas

```bash
# Workflow básico
git status                              # Ver cambios
git add .                              # Agregar cambios
git commit -m "type(scope): subject"  # Hacer commit
git push                               # Enviar a GitHub

# Verificar commits
git log --oneline                      # Ver historial
git log -p                             # Ver cambios
git diff HEAD~1                        # Comparar con anterior

# Deshacer cambios
git restore archivo.ts                 # Descartar cambios en archivo
git reset HEAD archivo.ts              # Sacar archivo de staging
git revert <hash>                      # Crear commit que deshace otro
```

## Integración con VS Code

Para usar con Copilot Chat:

```
/commit Help me write a proper commit message for the new search feature
/commit Validate this commit: "fix: Fixed bugs"
/commit Generate a commit for the Groq API implementation with tests
```

Ver [commit.prompt.md](commit.prompt.md) para el prompt interactivo.
