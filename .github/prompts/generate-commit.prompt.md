---
name: generate-commit
description: Generate a well-structured commit message based on your changes and description
agent: agent
argument-hint: Describe your changes and I'll generate the commit message
---

# 🔨 Generador de Commits - Travel Web

This prompt helps you generate properly formatted commit messages following Conventional Commits and Travel Web standards.

## How to Use

1. **Generate a commit for your changes**:
   ```
   /generate-commit I added unit tests for the Groq API key configuration, tested edge cases and error scenarios
   ```

2. **Let me generate a feature commit**:
   ```
   /generate-commit 
   - Created a new caching system
   - Added server-side LRU cache
   - Added client-side localStorage cache
   - Both with TTL support
   ```

3. **Generate a fix commit**:
   ```
   /generate-commit Fixed the search endpoint timing out by adding proper error handling and caching
   ```

4. **Generate based on changed files**:
   ```
   /generate-commit Changed src/pages/api/search.ts, src/utils/cache.ts, added tests
   ```

## Information to Provide

For best results, include:

- **What changed**: The files or features modified
- **Why**: The motivation or problem solved
- **How**: Technical approach if relevant
- **Related**: Any GitHub issues (e.g., #123)

## Commit Generation Process

1. **Analyze** your description
2. **Select** appropriate type: feat, fix, docs, test, etc.
3. **Choose** correct scope from: agents, hooks, groq, search, cache, errors, forms, ui, docs, config
4. **Structure** the message properly:
   - Subject ≤ 50 characters
   - Body with bullet points
   - Footer with issue references
5. **Validate** against Travel Web standards

## Output Format

Your generated commit will include:

```
<type>(<scope>): <subject>

- Bullet point 1
- Bullet point 2
- Bullet point 3

<footer>
```

**Example output**:
```
feat(groq): Add Groq API key configuration tests

- Add 21 unit test cases for API key handling
- Test critical path: valid keys, missing keys, invalid keys
- Test edge cases: undefined, empty, whitespace, special characters
- Test error propagation and cache integration
- Include mocks for @ai-sdk/groq module

Fixes #42
```

## Tips for Better Results

| Do | Don't |
|----|-------|
| ✅ Be specific | ❌ Use generic terms |
| ✅ List features | ❌ Write paragraphs |
| ✅ Mention tests | ❌ Forget documentation |
| ✅ Reference issues | ❌ Leave it vague |
| ✅ Use technical terms | ❌ Be too wordy |

---

**Need help?** Use `/commit` for complete guidelines or `/validate-commit` to check your message.
