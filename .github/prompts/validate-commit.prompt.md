---
name: validate-commit
description: Validate a commit message against Conventional Commits standards and Travel Web project conventions
agent: agent
argument-hint: Paste the commit message you want to validate
---

# ✅ Validador de Commits - Travel Web

Use this prompt to validate your commit message against the project standards.

## How to Use

1. **Validate a single commit message**:
   ```
   /validate-commit 
   feat(groq): Add Groq API configuration with error handling
   
   - Implement Groq client setup
   - Add error handling wrapper
   ```

2. **Check if a message follows conventions**:
   ```
   /validate-commit Is this correct? "fix: Fixed the search endpoint"
   ```

3. **Get suggestions for improvement**:
   ```
   /validate-commit 
   feat: added new feature
   ```

## Validation Criteria

Please check the following criteria:

### ✅ Format Check
- [ ] Follows format: `<type>(<scope>): <subject>`
- [ ] Type is one of: feat, fix, docs, style, refactor, perf, test, chore, ci
- [ ] Scope is from the project list: agents, hooks, groq, search, cache, errors, forms, ui, docs, config
- [ ] Subject is <= 50 characters
- [ ] Subject uses imperative mood (Add, Fix, Update, not Added, Fixed)
- [ ] Subject doesn't end with a period

### ✅ Content Check
- [ ] Body explains WHAT and WHY (not just WHAT)
- [ ] Body lines are <= 72 characters
- [ ] Body is separated from subject by blank line
- [ ] Lists changes with bullet points
- [ ] No generic messages like "update files", "fix stuff"

### ✅ Project Rules Check
- [ ] One commit = one logical feature or fix
- [ ] No mixing of multiple features
- [ ] No secrets or API keys exposed
- [ ] References issues if applicable (Fixes #123)
- [ ] Written in English for consistency

### ✅ Special Cases
- [ ] Breaking changes marked as `BREAKING CHANGE:`
- [ ] Co-authored commits include `Co-authored-by:`
- [ ] Related issues referenced with `Refs`, `Fixes`, or `Closes`

## Common Issues

| Issue | Solution |
|-------|----------|
| ❌ Too long subject | Shorten to ≤50 chars, move details to body |
| ❌ Wrong scope | Use one from: agents, hooks, groq, search, cache, errors, forms, ui, docs, config |
| ❌ No body | Add body explaining WHY the change was needed |
| ❌ Generic message | Be specific: "Fix timeout in API calls" not "Fix bugs" |
| ❌ Past tense | Use imperative: "Add feature" not "Added feature" |

## Output Format

After validation, provide:

1. **Status**: ✅ Valid / ⚠️ Needs improvements / ❌ Invalid
2. **Issues Found**: List any violations
3. **Suggestions**: How to improve if needed
4. **Example**: Corrected version if applicable

---

**Reference Guide**: See `/commit` for complete guidelines and examples.
