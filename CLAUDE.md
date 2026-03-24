# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Travel Web is an Astro 5.x application that generates personalized travel itineraries using Groq AI (via Vercel AI SDK). The app uses a hybrid rendering approach with SSG for static content and SSR for dynamic API routes.

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
GROQ_API_KEY          # Groq API key (get from console.groq.com)
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
User Form → /api/search → Groq API (via AI SDK) → JSON Response → Validation → Cache → Client
```

**Key files**:
- `src/utils/systemInstructions.ts` - System prompt for Groq
- `src/utils/transformMarkdownToJson.ts` - Parses AI response with validation
- `src/pages/api/search.ts` - Main API endpoint with field validation (uses `@ai-sdk/groq`)

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

## Groq/AI SDK Integration

Uses `@ai-sdk/groq` with `generateText()` from Vercel AI SDK:
- Model: `llama-3.3-70b-versatile`
- Separated system prompt and user prompt (best practice)
- Temperature: 0.1 for consistent JSON output
- maxOutputTokens: 8192 for long itineraries

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

## Agent System Architecture

This project uses a **specialized multi-agent system** for collaborative development:

### Available Agents

All agents are located in `.claude/agents/` and are configured with specific responsibilities:

#### 1. **Planner** (`planner.md`)
- **Model**: Claude Opus (complex analysis)
- **Role**: Software architect & solution designer
- **Capabilities**: Analyzes codebase, designs implementation plans, creates technical documentation
- **Output**: Saves plans to `docs/{feature-name}/{feature-name}-plan.md`
- **Restrictions**: Read-only, cannot modify source files
- **When to use**:
  - Planning complex features
  - Architectural decisions needed
  - Understanding existing code structure
  - Designing system improvements

#### 2. **Implementer** (`implementer.md`)
- **Model**: Claude Sonnet (fast implementation)
- **Role**: Senior developer executing plans
- **Capabilities**: Writes code, modifies files, runs tests, executes terminal commands
- **Input**: Uses plans from Planner as reference
- **When to use**:
  - Implementing approved plans
  - Writing new features or components
  - Fixing bugs with clear requirements
  - Refactoring based on code review feedback

#### 3. **Code-Reviewer** (`code-reviewer.md`)
- **Model**: Claude Opus (deep analysis)
- **Role**: Quality assurance & code expert
- **Capabilities**: Reviews code for bugs, performance, security, and best practices
- **Output**: Generates detailed reviews in `docs/{feature}/review/fase-{number}.md`
- **Restrictions**: Cannot modify source code directly
- **When to use**:
  - After implementation to catch issues
  - Before merging to main
  - Evaluating architectural decisions
  - Identifying performance bottlenecks

#### 4. **Test-Analyst** (`test-analyst.md`)
- **Model**: Claude Opus (test strategy design)
- **Role**: QA specialist & test strategist
- **Philosophy**: "Fewer tests, better coverage" - focus on critical paths
- **Output**: Test plans and strategies (integrated into feature documentation)
- **When to use**:
  - Planning test strategy for new features
  - Identifying critical test cases
  - Ensuring edge cases and error scenarios are covered
  - Validating security implications

#### 5. **Debugger** (`debugger.md`)
- **Model**: Claude Opus (deep analysis)
- **Role**: Expert debugging specialist & root cause analyst
- **Capabilities**: Analyzes errors, stack traces, traces code paths, identifies root causes
- **Output**: Detailed debug reports in `docs/{feature}/debug/{issue-type}-{number}.md`
- **Restrictions**: Read-only analysis, proposes fixes but doesn't implement
- **When to use**:
  - Investigating error messages or stack traces
  - Analyzing unexpected behaviors
  - Finding root causes of bugs
  - Understanding why something fails
  - Proposing fixes for complex issues

### Agent Workflow

The standard workflow for implementing a new feature:

```
1. PLANNER creates comprehensive plan
   ↓
2. TEST-ANALYST enriches plan with test strategy
   ↓
3. IMPLEMENTER builds feature following plan
   ↓
4. CODE-REVIEWER audits implementation
   ↓
5. Issues found?
   ├─ YES: IMPLEMENTER fixes, CODE-REVIEWER reviews again
   └─ NO: Feature complete ✅
```

**When bugs occur during development or production:**

```
Bug reported / Error detected
   ↓
DEBUGGER investigates root cause
   ↓
Creates debug report in docs/{feature}/debug/
   ↓
Root cause identified?
├─ Simple fix: IMPLEMENTER applies fix
├─ Complex fix: PLANNER designs solution → IMPLEMENTER implements
└─ Not reproducible: Document findings, monitor
   ↓
CODE-REVIEWER verifies fix
   ↓
TEST-ANALYST adds regression tests
```

### Documentation Structure

Each feature creates a documentation folder:
```
docs/{feature-name}/
├── {feature-name}-plan.md          # Plan & architecture (Planner)
├── {feature-name}.test-plan.md     # Test strategy (Test-Analyst)
├── debug/                          # Debug reports (Debugger)
│   ├── api-error-1.md              # Bug investigation report
│   └── cache-issue-1.md            # Another investigation
└── review/
    ├── fase-1.md                   # Initial review (Code-Reviewer)
    ├── fase-2.md                   # Post-fix review (if needed)
    └── fase-3.md                   # Final review (if needed)
```

### How to Invoke Agents

Agents are invoked via the Task tool in Claude Code:

```typescript
// Call the Planner to design a feature
Task tool with subagent_type='Plan', description='Design new feature X', prompt='...'

// Call the Implementer to build it
Task tool with subagent_type='Implementer', description='Implement feature X', prompt='...'

// Call Code-Reviewer to audit
Task tool with subagent_type='code-reviewer', description='Review feature X', prompt='...'

// Call Test-Analyst for test planning
Task tool with subagent_type='Plan', description='Plan tests for X', prompt='...'
```

### Key Rules for Agent Collaboration

1. **Planner outputs must exist before Implementer starts**
   - Plans should be detailed with specific file references
   - Include affected files table with line numbers
   - Provide implementation steps with rationale

2. **Implementer follows plans precisely**
   - Reference plan steps while implementing
   - Update plan if new issues discovered
   - Run full test suite before marking complete

3. **Code-Reviewer evaluates against project standards**
   - Check adherence to patterns in this CLAUDE.md
   - Verify error handling follows custom error classes
   - Ensure cache usage and API patterns are correct

4. **Test-Analyst prioritizes critical paths**
   - Not all code needs tests, focus on business logic
   - Include happy path, error cases, and edge cases
   - Document why certain areas have/don't have tests

5. **Documentation is central**
   - All decisions should be documented in `docs/`
   - Use this documentation as reference for future work
   - Keep plans updated if requirements change mid-implementation

## Development Hooks System

Claude Code hooks are automated bash/prompt commands that trigger at specific lifecycle events. They ensure critical behaviors happen automatically without relying on the LLM to remember.

### Configured Hooks in `.claude/settings.json`

#### 1. **PreToolUse - Protect Sensitive Files** 🔐
- **Matcher**: `Edit|Write`
- **Function**: Blocks modification of `.env`, `secrets.json`, `package-lock.json`, `.git/`
- **Impact**: Prevents accidental commits of API keys
- **Exit code**: 2 (blocks the operation)

#### 2. **PreToolUse - Protect Critical Architecture** ⚠️
- **Matcher**: `Edit|Write`
- **Function**: Warns when modifying `cache.ts`, `errorHandler.ts`, `errors.ts`
- **Impact**: Makes you think twice before changing core systems
- **Output**: Warning message with yellow emoji

#### 3. **PostToolUse - Auto-Format TypeScript** ✨
- **Matcher**: `Edit|Write`
- **Function**: Automatically runs Prettier on `.ts`, `.tsx`, `.astro` files after modification
- **Impact**: Maintains consistent code style across the project
- **Timeout**: 30 seconds

#### 4. **PostToolUse - Suggest Tests** 💡
- **Matcher**: `Edit|Write`
- **Function**: Detects if a `.spec.ts` or `.spec.tsx` file exists for modified file
- **Impact**: Reminds to run tests after changes
- **Output**: Helpful hint with exact test command

#### 5. **SessionStart - Validate Environment** ⚠️
- **Trigger**: When Claude Code starts a new session or resumes
- **Function**: Checks for:
  - `node_modules/` directory exists
  - `GROQ_API_KEY` configured in `.env`
  - `UNSPLASH_ACCESS_KEY` configured in `.env`
- **Impact**: Catches missing setup before errors occur
- **Timeout**: 10 seconds

#### 6. **UserPromptSubmit - Suggest Agent System** 💡
- **Trigger**: When you submit a user prompt
- **Keywords**: plan, arquitect, diseña, revisa, review, test, testing, estrategia
- **Function**: Suggests using the agent system when relevant keywords detected
- **Output**: Points to Agent System Architecture section in CLAUDE.md
- **Timeout**: 5 seconds

#### 7. **Stop - Validate Task Completion** ✅
- **Trigger**: When Claude Code finishes responding
- **Function**: Prompts whether work is complete or should continue
- **Impact**: Prevents premature stopping when tasks are incomplete
- **Timeout**: 20 seconds

### How Hooks Work

1. **Hook Config**: Defined in `.claude/settings.json`
2. **Auto-loading**: Claude Code reads this file automatically at startup
3. **Execution**: Hooks run as shell commands or LLM prompts at defined lifecycle events
4. **Exit Codes**:
   - `0`: Success
   - `2`: Error (blocks the operation for PreToolUse)
   - `1` or other: Error (non-blocking)

### Common Hook Patterns in This Project

**Pattern 1: File Protection**
```json
"PreToolUse": [
  {
    "matcher": "Edit|Write",
    "hooks": [{"type": "command", "command": "...validation script..."}]
  }
]
```

**Pattern 2: Post-Processing**
```json
"PostToolUse": [
  {
    "matcher": "Edit|Write",
    "hooks": [{"type": "command", "command": "...format/check script..."}]
  }
]
```

**Pattern 3: Session Setup**
```json
"SessionStart": [
  {
    "hooks": [{"type": "command", "command": "...validation checks..."}]
  }
]
```

### Managing Hooks

#### View Current Hooks
```bash
/hooks
```

#### Add New Hooks
Use the interactive `/hooks` command or edit `.claude/settings.json` directly.

#### Override Hooks
- **Global**: `~/.claude/settings.json` (applies to all projects)
- **Project**: `.claude/settings.json` (applies to this project only)
- **Local** (don't commit): `.claude/settings.local.json`

### Best Practices for Hooks

1. **Keep timeouts reasonable**: 5-30 seconds depending on operation
2. **Test commands manually first**: Ensure they work before adding as hooks
3. **Use clear output**: Echo warnings with emoji and context
4. **Quote variables**: Always use `"$variable"` not `$variable` in bash
5. **Handle missing tools gracefully**: Don't fail if formatter isn't installed (use `|| true`)
6. **Document changes**: If you modify `.claude/settings.json`, explain why

### Troubleshooting Hooks

**Hook not triggering?**
- Run `/hooks` to verify configuration
- Check `claude --debug` output for hook execution logs
- Verify matcher pattern matches the tool name exactly

**Hook blocking legitimate operation?**
- Edit `.claude/settings.json` to adjust the hook
- Temporarily disable with `/hooks` → select hook → delete
- Check if exit code should be 2 (blocking) vs 0 (non-blocking)

## Key Gotchas

1. **Field naming**: API uses `essential_travel_tips` (not `travel_tips`)
2. **Cache keys**: Based on ALL form params, not just destination
3. **Loading toasts**: Must be manually dismissed before showing success/error
4. **Validation errors**: Zod errors caught separately from API errors
5. **localStorage**: Falls back gracefully if unavailable (private browsing)
6. **Agent separation**: Planner and Code-Reviewer cannot modify files; use Implementer for changes
7. **Documentation persistence**: Always check `docs/` folder for existing plans before starting new features
