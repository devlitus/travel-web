# Claude Code Hooks Guide

This guide explains the hooks configured for the Travel Web project in `.claude/settings.json`.

## What are Hooks?

Hooks are automated shell commands that execute at specific lifecycle events in Claude Code. They ensure critical behaviors happen automatically without relying on the LLM to remember.

**Benefits**:
- 🔐 Security: Prevent accidental commits of sensitive files
- ✨ Quality: Auto-format code after modifications
- 💡 Guidance: Suggest best practices and patterns
- 🔍 Debugging: Suggest debugger agent for error investigations
- ⚠️ Safety: Catch missing setup before errors occur
- ✅ Completeness: Validate work before stopping

---

## Configured Hooks

### 1. **PreToolUse Hook - Protect Sensitive Files** 🔐

**Trigger**: Before any file modification (Edit or Write)

**What it does**:
- Blocks modification of `.env` (API keys)
- Blocks modification of `secrets.json`
- Blocks modification of `package-lock.json`
- Blocks modification of `.git/` directory

**Exit Code**: 2 (blocks the operation)

**Why**: Prevents accidentally committing:
- `GROQ_API_KEY` - Your Groq API key
- `UNSPLASH_ACCESS_KEY` - Your image API key
- Lock files that shouldn't be manually edited
- Git internal files

**Example**:
```
User: "Edit .env to add GROQ_API_KEY"
Hook: ❌ BLOCKED - ".env is protected"
```

**Override**: If you legitimately need to edit these, you can:
1. Edit `.claude/settings.local.json` to remove this hook
2. Or use the command line editor directly
3. Or ask to create a specific version in version control

---

### 2. **PreToolUse Hook - Protect Critical Architecture** ⚠️

**Trigger**: Before any file modification (Edit or Write)

**What it does**:
- Warns when modifying `cache.ts`
- Warns when modifying `errorHandler.ts`
- Warns when modifying `errors.ts`
- Any other critical system files

**Output**: Yellow warning message

**Why**: These files are critical to the project's architecture:
- **cache.ts**: Implements dual cache system (server + client)
- **errorHandler.ts**: Centralized error handling
- **errors.ts**: Custom error class definitions

Changing these can break the entire system if not done carefully.

**Example**:
```
User: "Fix errorHandler.ts"
Hook: ⚠️  ATENCIÓN: Estás modificando archivo crítico de arquitectura. Procede con cuidado.
Implementer: (proceeds with extra care, reviews changes twice)
```

**Override**: Not blocked, just warned. Critical changes can still be made with full understanding.

---

### 3. **PostToolUse Hook - Auto-Format TypeScript** ✨

**Trigger**: After any file modification (Edit or Write)

**What it does**:
- Automatically runs Prettier on `.ts` files
- Automatically runs Prettier on `.tsx` files
- Automatically runs Prettier on `.astro` files
- Reports success: "✨ Formateado: {filename}"

**Why**: Maintains consistent code style across the project
- No debates about formatting
- All code follows same rules
- Easier code reviews

**Timeout**: 30 seconds

**What if Prettier fails?**
- Hook continues gracefully (doesn't block)
- Reports error but doesn't stop workflow
- You can manually run: `npx prettier --write src/file.ts`

**Example**:
```
User: Edits src/utils/errors.ts
Hook: npx prettier --write src/utils/errors.ts
Output: ✨ Formateado: src/utils/errors.ts
Result: File is automatically formatted
```

---

### 4. **PostToolUse Hook - Suggest Tests** 💡

**Trigger**: After any file modification (Edit or Write)

**What it does**:
- Checks if a corresponding `.spec.ts` or `.spec.tsx` file exists
- If found, suggests running the specific test
- Provides exact command to run

**Why**: Reminds you to validate changes with tests
- Easy to forget tests when focused on implementation
- Provides exact command (copy-paste ready)
- Only suggests when tests actually exist

**Example**:
```
User: Edits src/utils/cache.ts
Hook: 💡 HINT: Existe test para este archivo. Ejecuta: npm test -- src/utils/cache.spec.ts
Result: Test suggestion with exact command
```

**What if there's no test?**
- Hook runs silently
- No suggestion is made
- Developers can choose to write tests or not

---

### 5. **SessionStart Hook - Validate Environment** ⚠️

**Trigger**: When Claude Code starts a new session or resumes an existing one

**What it does**:
- Checks if `node_modules/` directory exists
- Checks if `GROQ_API_KEY` is in `.env`
- Checks if `UNSPLASH_ACCESS_KEY` is in `.env`
- Reports missing items

**Why**: Catches configuration problems before work starts
- Missing dependencies cause npm install errors
- Missing API keys cause runtime errors
- Better to know upfront

**Example**:
```
Session starts...
Hook checks:
✓ node_modules exists
✗ GROQ_API_KEY not found
✗ UNSPLASH_ACCESS_KEY not found

Output:
⚠️  WARNING: GROQ_API_KEY no está configurada en .env
⚠️  WARNING: UNSPLASH_ACCESS_KEY no está configurada en .env
```

**What to do if warnings appear**:
1. Copy `.env.example` to `.env`
2. Add your actual API keys from:
   - Groq: https://console.groq.com
   - Unsplash: https://unsplash.com/developers
3. Restart Claude Code or run: `/compact` then start new session

**Timeout**: 10 seconds

---

### 6. **UserPromptSubmit Hook - Suggest Agent System** 💡

**Trigger**: When you submit a user prompt to Claude Code

**Keywords detected**:
- plan / planning
- arquitect / architecture
- diseña / design
- revisa / review
- testing / test
- estrategia / strategy

**What it does**:
- Detects when your prompt involves planning, designing, or reviewing
- Suggests using the specialized agent system
- Points to Agent System Architecture in CLAUDE.md

**Why**: Ensures you use the right tool for the job
- Planner is better at architecture than general Claude
- Code-Reviewer is better at auditing than general Claude
- Specialized agents produce better results

**Example**:
```
User prompt: "Design the authentication system"
Hook detects: "diseñ" keyword
Output: 💡 HINT: Considere usar el sistema de agentes...
```

**When to use agents vs. general Claude**:

| Task | Use | Why |
|------|-----|-----|
| Planning feature | Planner agent | Deep analysis, produces documented plan |
| Writing code | Implementer agent | Follows plans, respects patterns |
| Auditing code | Code-Reviewer agent | Catches subtle issues, knows patterns |
| Planning tests | Test-Analyst agent | Identifies critical test cases |
| **Investigating bugs** | **Debugger agent** | **Systematic analysis, documented findings** |
| Quick question | General Claude | Fast, conversational |
| Code example | General Claude | Quick reference |

**Timeout**: 5 seconds

---

### 7. **UserPromptSubmit Hook - Suggest Debugger** 🔍

**Trigger**: When you submit a user prompt to Claude Code

**Keywords detected**:
- error / exception
- bug / falla / crash
- debug / investigar
- "por qué falla" / "no funciona"
- stack trace
- undefined / null

**What it does**:
- Detects when your prompt involves debugging or error investigation
- Suggests using the Debugger agent
- Points to debug report location

**Why**: The Debugger agent is specialized in:
- Systematic bug investigation
- Root cause analysis
- Documenting findings for future reference
- Proposing tested solutions

**Example**:
```
User prompt: "Tengo un error cuando busco un destino"
Hook detects: "error" keyword
Output: 🔍 HINT: Para investigar bugs, considera usar el agente Debugger...
```

**Timeout**: 5 seconds

---

### 8. **Stop Hook - Validate Task Completion** ✅

**Trigger**: When Claude Code finishes responding and is about to stop

**What it does**:
- Prompts: "Have the tasks been completed correctly?"
- Waits for Claude's evaluation
- Can block stopping if work is incomplete
- Decision: continue or stop

**Why**: Prevents accidentally marking work as done too early
- Large features can be partially implemented
- Easy to forget important steps
- Better to catch issues before moving on

**Example**:
```
Claude finishes response...
Hook prompt: "Revisa si las tareas han sido completadas correctamente..."
Claude responds: {"should_continue": true, "reason": "El componente está listo pero falta test"}
Hook: Continues session, doesn't stop
Result: Work continues until actually complete
```

**User override**: You can always manually stop by pressing Ctrl+C or clicking Stop.

**Timeout**: 20 seconds

---

## How to View & Manage Hooks

### View All Hooks
```bash
/hooks
```
Shows:
- All configured hooks
- Which events they trigger on
- Which matchers they use
- The commands they run

### Add a New Hook
```bash
/hooks
```
Then:
1. Select "Add new hook"
2. Choose event (PreToolUse, PostToolUse, SessionStart, etc.)
3. Set matcher if needed (for PreToolUse, PostToolUse)
4. Enter command or prompt
5. Set timeout if needed

### Disable a Hook Temporarily
```bash
/hooks
```
Then:
1. Select the hook
2. Choose "Disable"

### Delete a Hook
```bash
/hooks
```
Then:
1. Select the hook
2. Choose "Delete"

### Edit Settings Directly
Edit `.claude/settings.json` with any text editor. Structure:
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",  // optional
        "hooks": [
          {
            "type": "command",
            "command": "your-bash-command",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

---

## Common Issues & Solutions

### Hook Isn't Triggering

**Problem**: You edit a TypeScript file but auto-format doesn't run.

**Solutions**:
1. Run `/hooks` to verify configuration
2. Check that the matcher is correct (`Edit|Write`)
3. Verify file extension is `.ts`, `.tsx`, or `.astro`
4. Check timeout isn't too short

### Hook is Blocking Legitimate Work

**Problem**: You need to edit `.env` but PreToolUse blocks it.

**Solutions**:
1. Use `.env.local` instead (git-ignored)
2. Edit `.claude/settings.local.json` to modify hook
3. Manually use system editor: `nano .env`
4. Ask in your prompt to remove the protection temporarily

### Hook Output is Hard to Read

**Problem**: Too many warnings or not enough information.

**Solutions**:
1. Edit the hook command to be more concise
2. Edit `.claude/settings.json` directly
3. Remove less important hooks
4. Customize output format

### Performance Issues

**Problem**: Hooks are taking too long to run.

**Solutions**:
1. Reduce timeout in hook configuration
2. Optimize the bash command (avoid slow operations)
3. Run expensive checks less frequently (only SessionStart?)
4. Disable hooks you don't use

---

## Best Practices

### 1. **Test Hook Commands First**

Before adding a hook, test the command in terminal:

```bash
# Test the prettier formatting
npx prettier --write src/utils/cache.ts

# Test Python validation
python3 -c "import json; print('OK')"
```

### 2. **Use Meaningful Output**

Good:
```bash
echo "✨ Formateado: $file"
```

Bad:
```bash
echo "Done"
```

### 3. **Always Quote Variables**

Good:
```bash
echo "File: \"$file_path\""
```

Bad:
```bash
echo "File: $file_path"  # Breaks with spaces
```

### 4. **Handle Errors Gracefully**

Good:
```bash
npx prettier --write "$file" 2>/dev/null || echo "Note: Prettier not installed"
```

Bad:
```bash
npx prettier --write "$file"  # Fails silently or exits
```

### 5. **Keep Timeouts Reasonable**

- Quick validation: 5 seconds
- Running formatters: 30 seconds
- Complex checks: 60 seconds

### 6. **Document Why Hooks Exist**

When you add a hook, update this guide explaining:
- What it does
- Why it's needed
- How to override it

---

## Configuration Precedence

Hooks are loaded in this order (later overrides earlier):

1. **Global**: `~/.claude/settings.json` (all projects)
2. **Project**: `.claude/settings.json` (this project only)
3. **Local**: `.claude/settings.local.json` (local overrides, don't commit)

So you can:
- Have project-wide hooks in `.claude/settings.json`
- Override them locally in `.claude/settings.local.json`
- Never break the committed configuration

---

## Advanced: Custom Hooks

Want to add more hooks? Here are ideas:

### Hook: Commit Message Validation
```json
{
  "type": "command",
  "command": "if ! grep -qE '^(feat|fix|docs|style|refactor|test|chore):' <<< \"$message\"; then echo 'Follow conventional commits'; exit 2; fi"
}
```

### Hook: Database Migration Safety
```json
{
  "matcher": "*.sql",
  "type": "command",
  "command": "echo '⚠️  Remember: Test migrations in dev environment first'"
}
```

### Hook: Auto-update Dependencies
```json
{
  "type": "command",
  "command": "npm audit --fix 2>/dev/null || true"
}
```

---

## Reference

**Official Claude Code Documentation**:
- https://code.claude.com/docs/en/hooks-guide.md
- https://code.claude.com/docs/en/hooks.md

**Related Guides**:
- `.claude/CLAUDE.md` - Main project documentation
- `.claude/agents/README.md` - Agent system overview
- See section "Development Hooks System" in CLAUDE.md
