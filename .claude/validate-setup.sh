#!/bin/bash
# Claude Code Setup Validator for Travel Web
# This script validates that all hooks, agents, and documentation are properly configured

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔍 Validating Travel Web Claude Code Setup"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# Check 1: Settings.json exists
echo "📋 Configuration Files"
if [ -f "$SCRIPT_DIR/settings.json" ]; then
    pass "settings.json exists"

    # Validate JSON
    if python3 -c "import json; json.load(open('$SCRIPT_DIR/settings.json'))" 2>/dev/null; then
        pass "settings.json is valid JSON"
    else
        fail "settings.json has invalid JSON syntax"
    fi
else
    fail "settings.json not found"
fi

echo ""

# Check 2: Agent files exist
echo "🤖 Agent Files"
AGENTS=("planner" "implementer" "code-reviewer" "test-analyst")
for agent in "${AGENTS[@]}"; do
    if [ -f "$SCRIPT_DIR/agents/$agent.md" ]; then
        pass "Agent: $agent.md"
    else
        fail "Agent: $agent.md not found"
    fi
done

if [ -f "$SCRIPT_DIR/agents/README.md" ]; then
    pass "Agent README.md exists"
else
    fail "Agent README.md not found"
fi

echo ""

# Check 3: Documentation files
echo "📚 Documentation Files"
if [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
    pass "CLAUDE.md exists"

    # Check for Agent System Architecture section
    if grep -q "Agent System Architecture" "$SCRIPT_DIR/CLAUDE.md"; then
        pass "CLAUDE.md contains Agent System Architecture section"
    else
        warn "CLAUDE.md missing Agent System Architecture section"
    fi

    # Check for Development Hooks System section
    if grep -q "Development Hooks System" "$SCRIPT_DIR/CLAUDE.md"; then
        pass "CLAUDE.md contains Development Hooks System section"
    else
        warn "CLAUDE.md missing Development Hooks System section"
    fi
else
    fail "CLAUDE.md not found"
fi

if [ -f "$SCRIPT_DIR/hooks-guide.md" ]; then
    pass "hooks-guide.md exists"
else
    fail "hooks-guide.md not found"
fi

if [ -f "$SCRIPT_DIR/agent-example.md" ]; then
    pass "agent-example.md exists"
else
    warn "agent-example.md not found (optional)"
fi

echo ""

# Check 4: Project structure
echo "🏗️  Project Structure"
if [ -f "$PROJECT_DIR/package.json" ]; then
    pass "package.json exists"
else
    fail "package.json not found"
fi

if [ -f "$PROJECT_DIR/.env.example" ]; then
    pass ".env.example exists"
else
    warn ".env.example not found"
fi

if [ -d "$PROJECT_DIR/src" ]; then
    pass "src/ directory exists"
else
    fail "src/ directory not found"
fi

if [ -d "$PROJECT_DIR/docs" ]; then
    pass "docs/ directory exists"
else
    warn "docs/ directory doesn't exist yet (will be created when features are implemented)"
fi

echo ""

# Check 5: Required files in src/
echo "📁 Critical Source Files"
CRITICAL_FILES=(
    "utils/cache.ts"
    "utils/errors.ts"
    "utils/errorHandler.ts"
    "pages/api/search.ts"
    "components/Toast/Toaster.astro"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$PROJECT_DIR/src/$file" ]; then
        pass "src/$file"
    else
        fail "src/$file not found"
    fi
done

echo ""

# Check 6: Environment variables (only warn)
echo "🔐 Environment Configuration"
if [ -f "$PROJECT_DIR/.env" ]; then
    if grep -q "GROQ_API_KEY" "$PROJECT_DIR/.env"; then
        pass "GROQ_API_KEY configured in .env"
    else
        warn "GROQ_API_KEY not set in .env"
    fi

    if grep -q "UNSPLASH_ACCESS_KEY" "$PROJECT_DIR/.env"; then
        pass "UNSPLASH_ACCESS_KEY configured in .env"
    else
        warn "UNSPLASH_ACCESS_KEY not set in .env"
    fi
else
    warn ".env file not found (copy from .env.example and add your keys)"
fi

echo ""

# Check 7: Node modules (only warn)
echo "📦 Dependencies"
if [ -d "$PROJECT_DIR/node_modules" ]; then
    pass "node_modules directory exists"
else
    warn "node_modules not found. Run: npm install"
fi

echo ""

# Check 8: Hooks configuration details
echo "🎣 Hooks Configuration Details"
if [ -f "$SCRIPT_DIR/settings.json" ]; then
    HOOKS_COUNT=$(grep -o '"type"' "$SCRIPT_DIR/settings.json" | wc -l)
    pass "Found $HOOKS_COUNT hooks configured"

    # Check for specific hooks
    if grep -q '"PreToolUse"' "$SCRIPT_DIR/settings.json"; then
        pass "PreToolUse hook is configured"
    else
        warn "PreToolUse hook not configured"
    fi

    if grep -q '"PostToolUse"' "$SCRIPT_DIR/settings.json"; then
        pass "PostToolUse hook is configured"
    else
        warn "PostToolUse hook not configured"
    fi

    if grep -q '"SessionStart"' "$SCRIPT_DIR/settings.json"; then
        pass "SessionStart hook is configured"
    else
        warn "SessionStart hook not configured"
    fi

    if grep -q '"UserPromptSubmit"' "$SCRIPT_DIR/settings.json"; then
        pass "UserPromptSubmit hook is configured"
    else
        warn "UserPromptSubmit hook not configured"
    fi
else
    fail "Cannot validate hooks - settings.json not found"
fi

echo ""
echo "==========================================="
echo "📊 Validation Summary"
echo "==========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"

echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ Setup validation complete - All critical files are in place!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start Claude Code: 'claude' or 'claude --model=opus'"
    echo "2. Run '/hooks' to verify hooks are loaded"
    echo "3. Check 'docs/' folder for existing feature plans"
    echo "4. Read '.claude/CLAUDE.md' for project guidelines"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Setup validation failed - Some critical files are missing${NC}"
    echo ""
    echo "Please fix the above issues and run this script again."
    echo ""
    exit 1
fi
