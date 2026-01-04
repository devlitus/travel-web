# Claude Code Agent System

This directory contains specialized agents for collaborative development on the Travel Web project.

## Quick Overview

The agent system consists of 5 specialized roles that work together:

| Agent | Role | Model | Best For |
|-------|------|-------|----------|
| **Planner** | Architect | Opus | Designing features, understanding architecture |
| **Implementer** | Developer | Sonnet | Building features, writing code |
| **Code-Reviewer** | Auditor | Opus | Reviewing code, finding issues |
| **Test-Analyst** | QA Specialist | Opus | Test planning, strategy |
| **Debugger** | Bug Hunter | Sonnet | Investigating errors, finding root causes |

---

## Standard Workflow

### For New Features:

```
Feature Request
    ↓
PLANNER → Create plan in docs/{feature}/
    ↓
TEST-ANALYST → Add test strategy to plan
    ↓
IMPLEMENTER → Build following plan
    ↓
CODE-REVIEWER → Audit implementation
    ↓
Issues? → IMPLEMENTER fixes → CODE-REVIEWER re-reviews
    ↓
Feature Complete ✅
```

### For Bug Fixes:

```
Bug Reported / Error Detected
    ↓
DEBUGGER → Investigate and create debug report in docs/{feature}/debug/
    ↓
Root cause identified?
├─ Simple fix: IMPLEMENTER applies fix
├─ Complex fix: PLANNER designs solution → IMPLEMENTER implements
└─ Not reproducible: Document findings, monitor
    ↓
CODE-REVIEWER → Verify fix
    ↓
TEST-ANALYST → Add regression tests
    ↓
Bug Fixed ✅
```

---

## Invoking Agents from Claude Code

### 1. **Planner** - Design & Architecture

Use when you need to design a feature, understand code structure, or make architectural decisions.

**Example:**
```bash
claude --model=opus task --description="Design user authentication system" \
  --prompt="Review the codebase and design an authentication system that..."
```

Or via Claude Code interface:
- Use the Task tool with `subagent_type='Plan'`
- Pass a detailed description and prompt

**Planner outputs to**: `docs/{feature-name}/{feature-name}-plan.md`

**Expects**: Detailed architectural plans with file references, implementation steps, and affected files table.

---

### 2. **Implementer** - Code Implementation

Use after you have a plan from the Planner. This agent writes code, modifies files, and runs tests.

**When to use**:
- Implementing approved plans from Planner
- Writing new features or components
- Fixing bugs with clear requirements
- Refactoring based on code review feedback

**Capabilities**:
- Read and modify any file
- Execute bash commands and terminal operations
- Run test suites
- Create new files and directories

**Example prompt**:
```
Implement the authentication feature following the plan in docs/auth/auth-plan.md.
Use the SearchHandler pattern for consistency with the codebase.
Ensure all error cases are covered with custom error classes.
Run tests after implementation.
```

---

### 3. **Code-Reviewer** - Quality Assurance

Use after Implementer completes a feature. This agent thoroughly audits code for bugs, performance, security, and best practices.

**Reviews against**:
- Project patterns documented in CLAUDE.md
- Error handling guidelines (custom error classes)
- Cache system usage
- API route structure
- Security best practices

**Outputs to**: `docs/{feature}/review/fase-1.md` (fase-2, fase-3 if iterations needed)

**Example prompt**:
```
Review the implementation in src/pages/api/auth.ts and src/utils/auth.ts
Check against patterns in CLAUDE.md, especially:
- Error handling system
- API route structure
- Cache usage patterns
Report findings with specific line numbers.
```

---

### 4. **Test-Analyst** - Test Strategy

Use for planning comprehensive test coverage. This agent focuses on critical test cases.

**Philosophy**: "Fewer tests, better coverage" - focus on:
- Happy path (main functionality)
- Error scenarios (what can go wrong)
- Edge cases (boundaries, limits)
- Security implications

**Output**: Test plan integrated into feature documentation

**Example prompt**:
```
Create a comprehensive test plan for the authentication feature.
Focus on:
- Valid login/logout scenarios
- Invalid credentials
- Expired tokens
- Rate limiting
- Session management
```

---

### 5. **Debugger** - Bug Investigation

Use when you encounter errors, unexpected behaviors, or bugs that need investigation.

**Specializes in**:
- Analyzing error messages and stack traces
- Tracing code paths to find root causes
- Identifying patterns in bugs
- Proposing fixes with code examples
- Documenting findings for future reference

**Outputs to**: `docs/{feature}/debug/{issue-type}-{number}.md`

**Investigation process**:
1. **Gather information** - Stack traces, error logs, reproduction steps
2. **Form hypotheses** - Based on error patterns and Travel Web architecture
3. **Trace code** - Follow execution path using LSP and file reading
4. **Identify root cause** - Find exact failure point and why it fails
5. **Propose solution** - Specific fix with code examples

**Example prompt**:
```
I'm getting this error when searching for a destination:
"ExternalServiceError: Groq API failed with 429 Too Many Requests"

The error happens intermittently. Please investigate:
1. Why is this happening?
2. Where in the code is this being thrown?
3. What's the best way to handle this?
```

**Common bugs it investigates**:
- API errors (Groq, Unsplash)
- Cache misses or invalid cache states
- JSON parsing failures from AI responses
- Validation errors with Zod schemas
- Async/timing issues

---

## Agent Configuration Files

Each agent is defined in its own markdown file with:

- **Role & Responsibilities**: What the agent does
- **Capabilities**: Tools it has access to
- **Restrictions**: What it cannot do
- **Output Format**: Where and how results are saved
- **System Instructions**: Detailed prompts for consistent behavior

### Files:
- `planner.md` - Planner agent configuration
- `implementer.md` - Implementer agent configuration
- `code-reviewer.md` - Code reviewer agent configuration
- `test-analyst.md` - Test analyst agent configuration
- `debugger.md` - Debugger agent configuration

---

## Documentation Structure

Features create organized documentation:

```
docs/
└── {feature-name}/
    ├── {feature-name}-plan.md          # Architecture & implementation steps
    ├── {feature-name}.test-plan.md     # Test strategy
    ├── debug/                          # Bug investigation reports
    │   ├── api-error-1.md              # First API error investigation
    │   ├── cache-issue-1.md            # Cache problem investigation
    │   └── validation-bug-1.md         # Validation issue investigation
    └── review/
        ├── fase-1.md                   # Initial code review
        ├── fase-2.md                   # Post-fix review (if needed)
        └── fase-3.md                   # Final review (if needed)
```

This documentation:
- Serves as reference for future work
- Shows design decisions and rationale
- Helps new team members understand the system
- Tracks all reviews and iterations
- **Preserves debugging knowledge** for similar future issues

---

## Integration with Hooks

The agent system works seamlessly with Claude Code hooks:

- **UserPromptSubmit hook**: Detects when you're planning/designing and suggests agent system
- **Stop hook**: Validates task completion before ending
- **SessionStart hook**: Reminds you to check existing plans in `docs/`

See "Development Hooks System" in CLAUDE.md for details.

---

## Best Practices

### 1. **Always Start with Planner**
- Plans should be detailed with file references
- Include "affected files" table with line numbers
- Provide clear implementation steps

### 2. **Follow Plans Precisely**
- Implementer should reference plan steps during implementation
- Update plan if new issues discovered
- Don't skip steps in the plan

### 3. **Review Before Merging**
- Code-Reviewer evaluates against CLAUDE.md patterns
- Check for hidden issues and improvements
- Multiple review iterations are normal

### 4. **Test Planning Matters**
- Test-Analyst identifies critical paths
- Not all code needs 100% test coverage
- Focus on business logic and error scenarios
- Document why certain areas don't have tests

### 5. **Keep Documentation Updated**
- Plans are living documents
- Update if requirements change
- Reference plans in PRs and commits
- Use plans as onboarding material

---

## Common Patterns to Follow

### API Route Pattern
```typescript
// 1. Validate API keys
// 2. Parse and validate input (Zod)
// 3. Check cache
// 4. Call external service with error wrapper
// 5. Validate response structure
// 6. Cache and return
```

### Error Handling Pattern
```typescript
throw new ValidationError("Message", details)
throw new ParseError("Message", data)
throw new ExternalServiceError("Message", details)
throw new ConfigurationError("Message", details)
```

### Component Communication Pattern
- Form to API: SearchHandler class with typed SearchResult
- API to Client: JSON with consistent error structure
- Client notifications: Global window.toast API

---

## Troubleshooting Agent Issues

### Agent doesn't understand context?
- Read its configuration file (e.g., `planner.md`)
- Check if you provided necessary context in your prompt
- Review previous agent outputs in `docs/` folder

### Agent output format is wrong?
- Check the agent's configuration file for expected output format
- Verify matcher patterns (for agents that use them)
- Run the agent again with corrected prompt

### Agent seems incomplete?
- Check the Stop hook - it validates completion
- Agent may have deliberately stopped waiting for input
- Re-invoke with additional context if needed

### Can't find where agent saves output?
- Plans: `docs/{feature-name}/{feature-name}-plan.md`
- Test Plans: `docs/{feature-name}/{feature-name}.test-plan.md`
- Reviews: `docs/{feature-name}/review/fase-*.md`

---

## Integration with Project Systems

All agents understand and follow:

1. **Error Handling System** (`src/utils/errors.ts`)
   - Custom error classes (AppError, ValidationError, etc.)
   - Structured error responses

2. **Caching System**
   - Server cache (in-memory LRU)
   - Client cache (localStorage with TTL)

3. **API Patterns**
   - Groq/AI SDK integration
   - Field validation
   - Response transformation

4. **Form Handler Pattern**
   - SearchHandler class structure
   - Cache checking and saving
   - Redirect URL building

---

## Next Steps

1. **Review CLAUDE.md**: Read the full project documentation
2. **Start with Planner**: Plan your first feature
3. **Check existing docs/**: Look for similar features that might have plans
4. **Follow patterns**: Use established patterns from the codebase
5. **Document everything**: Your docs are valuable for the team

---

## Questions?

Refer to:
- `CLAUDE.md` - Full project documentation
- `.claude/CLAUDE.md` - This file explains agent configuration
- Individual agent files (e.g., `planner.md`) - Agent-specific instructions
- `docs/` - Examples of agent outputs from completed features
