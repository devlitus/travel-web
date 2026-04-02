# Performance Optimization Plan - TravelGen

## 1. Executive Summary

- **Feature Name**: Performance Optimization Bundle
- **Brief Description**: A set of six targeted optimizations addressing orphaned preconnect hints, CSS bloat, GPU-intensive decorative elements, oversized client-side utilities, and overly permissive build thresholds -- all discovered through Chrome DevTools and Performance API analysis.
- **System Impact**: Reduces total page weight, eliminates wasted DNS lookups, improves paint/composite performance, and provides accurate build-time feedback on bundle sizes.
- **Complexity Estimate**: Medium

---

## 2. Current Context Analysis

### 2.1 Relevant Existing Files

| File | Purpose | Relevance |
|------|---------|-----------|
| `src/layouts/Layout.astro` | Root HTML shell, includes `<head>` tags | Contains orphaned preconnect links (lines 47-48) |
| `src/styles/global.css` | Global styles + Tailwind v4 import | Source of CSS output bloat (2.8KB source, 43KB browser) |
| `src/pages/index.astro` | Homepage with hero section | Contains three `blur-3xl` decorative divs (lines 49-60) |
| `src/utils/clientCache.ts` | Client-side localStorage cache utility | 242 lines / ~17KB transferred; includes side effects at module level |
| `astro.config.mjs` | Astro + Vite build configuration | Has `reportCompressedSize: false` and `chunkSizeWarningLimit: 1000` |
| `tailwind.config.mjs` | Tailwind v4 theme extension | Color palette extension, no content purge directives |
| `src/components/TravelForm/formHandler.ts` | Form state handler, imports `clientCache.ts` | Consumer of `ClientCache`, `debounce`, `formCache` |
| `src/components/TravelForm/searchHandler.ts` | Search API handler, imports `clientCache.ts` | Consumer of `searchCache`, `hashString` |

### 2.2 Code Patterns in Use

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin and `@import "tailwindcss"` directive in `global.css`.
- **`@theme` block** in `global.css` for CSS custom property definitions (Tailwind v4 pattern).
- **Component CSS files** (`TravelForm.css`, `itinerary.css`) use plain CSS with `hsl(var(...))` references.
- **Server-side Astro components** for all UI; client-side JS only in `<script>` tags and handler classes.
- **No font loading anywhere** in the project -- `'Plus Jakarta Sans'` is declared in `font-family` in `global.css` line 34 but never loaded via `<link>` or `@font-face`.

### 2.3 Related Dependencies

- `tailwindcss@4.1.11` -- v4 with Vite plugin
- `@tailwindcss/vite@4.1.11` -- Vite integration
- `astro@5.14.4` -- framework
- `@astrojs/vercel@8.2.9` -- deployment adapter

### 2.4 Project Conventions (from CLAUDE.md)

- Minimize client-side JavaScript.
- Use TypeScript with typed interfaces.
- Follow existing folder structure (`src/components/[Name]/`).
- Dual cache system: server-side `MemoryCache` + client-side `ClientCache`.
- Tailwind v4 best practices documented in `docs/tailwind-v4-best-practices.md`.

---

## 3. Technical Design

### 3.1 Proposed Architecture

This optimization is decomposed into **six independent fixes** ordered by impact and risk. Each fix is self-contained and can be verified individually. No new modules are created; all changes are modifications to existing files.

### 3.2 Optimization Categories

```
[FIX-1] Remove orphaned preconnect      -- Network (Critical)
[FIX-2] CSS output optimization          -- Transfer size (Critical)
[FIX-3] GPU compositing for blur divs    -- Rendering (Medium)
[FIX-4] clientCache.ts size reduction    -- Bundle size (Medium)
[FIX-5] Build config tightening          -- Developer feedback (Medium)
[FIX-6] Font loading strategy            -- Typography/CLS (Medium)
```

### 3.3 Data Flow (unchanged)

The application data flow is not modified by these optimizations. All changes are to presentation, build configuration, and asset delivery.

---

## 4. Implementation Steps

### Step 1: Remove Orphaned Preconnect Links

- **File**: `src/layouts/Layout.astro`
- **Action**: Modify
- **Description**: Delete lines 47-48 which contain `<link rel="preconnect">` tags for `fonts.googleapis.com` and `fonts.gstatic.com`. These initiate DNS resolution, TCP connection, and TLS negotiation to Google Fonts servers but no font resource is ever requested. This wastes approximately 100-300ms of connection setup time on first load.
- **Specific Changes**:
  - Remove line 47: `<link rel="preconnect" href="https://fonts.googleapis.com" />`
  - Remove line 48: `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
- **Reference Code**: The `<head>` section after this change should go directly from the closing `/>` of `<SEO>` (line 46) to `</head>` (line 49, renumbered).
- **Dependencies**: None
- **Expected Impact**: Eliminates 2 wasted DNS lookups + TCP connections + TLS handshakes. Saves ~100-300ms of network activity on cold loads. Removes 2 resource entries from the browser's network waterfall.
- **Risk**: None -- confirmed via grep that no file in the project references `fonts.googleapis.com` or loads any Google Font resource.

---

### Step 2: Optimize Tailwind CSS Output Size

- **File**: `src/styles/global.css`
- **Action**: Modify
- **Description**: The current `@import "tailwindcss"` directive on line 1 imports **all** of Tailwind v4 -- including the full preflight/reset, all theme variables, and the utility layer. In Tailwind v4, the `@import "tailwindcss"` is a shorthand for importing the three layers: `@import "tailwindcss/preflight"`, `@import "tailwindcss/utilities"`, and the theme. The Vite plugin with `@tailwindcss/vite` handles tree-shaking of utilities automatically at build time, but the `@theme` block in this file (lines 4-31) declares **many custom properties** that generate additional CSS output even if unused.

  **Root Cause Analysis**: The 43KB browser output versus 2.8KB source discrepancy comes from:
  1. Tailwind v4 preflight/reset: ~4KB
  2. Generated CSS custom properties from `@theme`: ~2KB
  3. Utility classes used across all templates: the bulk of the output
  4. Potential duplicate theme variables -- the `@theme` block defines both HSL-based CSS variables (`--background`, `--foreground`, etc.) AND hex color variables (`--primary-color`, `--secondary-color`, etc.), creating redundancy.

  **Solution**: Remove unused/duplicate theme variables from the `@theme` block. Specifically:
  - Lines 26-30 define `--primary-color`, `--secondary-color`, `--text-color`, `--background-color`, `--border-color` as hex values that duplicate the HSL-based variables above them.
  - Audit which `@theme` variables are actually referenced in the codebase and remove unreferenced ones.

- **Specific Changes**:

  **Phase A -- Remove duplicate hex variables from `@theme`**:

  Perform a grep for each variable to confirm usage:
  - `--primary-color`: Used in `TravelForm.css` lines 41-42, 78-80. **KEEP**.
  - `--secondary-color`: Grep the codebase -- if unused, remove. From analysis, no reference found outside `@theme`. **REMOVE**.
  - `--text-color`: No reference found outside `@theme`. **REMOVE**.
  - `--background-color`: No reference found outside `@theme`. **REMOVE**.
  - `--border-color`: No reference found outside `@theme`. **REMOVE**.

  **Phase B -- Verify unused HSL theme variables**:

  The following variables from `@theme` should be audited. If unused, they should be removed to reduce the generated CSS:
  - `--popover`, `--popover-foreground`: Search for `var(--popover` across the project. If unused, remove.
  - `--accent`, `--accent-foreground`: Search for `var(--accent`. If unused, remove.
  - `--destructive`, `--destructive-foreground`: Search for `var(--destructive`. If unused, remove.
  - `--ring`: Search for `var(--ring`. If unused, remove.
  - `--radius`: Used in `TravelForm.css` lines 32, 65. **KEEP**.

  **NOTE FOR IMPLEMENTER**: Before removing any variable, run a full project grep: `grep -r "var(--variable-name" src/` to confirm zero usage. Variables referenced only within `@theme` itself (not in any component or style file) are safe to remove.

  **Phase C -- Verify Tailwind utility tree-shaking is working**:

  The `@tailwindcss/vite` plugin in Tailwind v4 automatically scans all files matching the default content paths (`./src/**/*.{astro,html,js,ts,tsx,jsx}`). However, `tailwind.config.mjs` exists in the project root and does **not** define a `content` array. In Tailwind v4 with the Vite plugin, the content detection is automatic, so this file's `theme.extend` is additive only. The implementer should verify the build output by temporarily enabling `reportCompressedSize: true` (see Step 5) and checking actual CSS sizes.

- **Reference Code**: The current `@theme` block at lines 4-31 of `global.css`.
- **Dependencies**: None (but Step 5 enables size reporting which helps validate this step)
- **Expected Impact**: Reduction of 2-5KB in generated CSS by removing unused theme variables. The exact savings depend on how many variables are confirmed unused. This will NOT reduce the 43KB to near 2.8KB -- the majority of the output is legitimate Tailwind utilities. The 43KB is within normal range for Tailwind v4 in development mode; the production build with gzip/brotli will be significantly smaller (~8-12KB compressed).
- **Risk**: Low. If a variable is removed that is actually used somewhere, the CSS property will fall back to `initial` or the browser default, causing a visible style regression. This is easily caught during visual testing.

---

### Step 3: Add GPU Compositing Hints to Blur Decorative Elements

- **File**: `src/pages/index.astro`
- **Action**: Modify
- **Description**: Lines 49-60 contain three decorative `<div>` elements with `blur-3xl` (which compiles to `filter: blur(64px)`). Large blur radii are GPU-intensive because the browser must create a stacking context and composite the blurred layer. Without `will-change`, the browser may not promote these elements to their own compositor layer, causing them to be re-rasterized on every paint.

  **Solution**: Add `will-change-transform` (Tailwind v4 utility) to each blur div. This hints the browser to promote the element to its own GPU layer, reducing repaint cost. Additionally, since these are purely decorative and non-interactive, they should have `aria-hidden="true"` and `pointer-events-none` to ensure no accessibility or interaction interference.

- **Specific Changes**:

  Line 50 -- first blur div:
  ```
  BEFORE:
  class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"

  AFTER:
  class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
  ```
  Also add `aria-hidden="true"` attribute to the opening `<div` tag.

  Line 54 -- second blur div:
  ```
  BEFORE:
  class="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-pink-900/50 to-red-900/50 rounded-full blur-3xl translate-x-1/2"

  AFTER:
  class="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-pink-900/50 to-red-900/50 rounded-full blur-3xl translate-x-1/2 will-change-transform pointer-events-none"
  ```
  Also add `aria-hidden="true"`.

  Line 58 -- third blur div:
  ```
  BEFORE:
  class="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-full blur-3xl translate-y-1/2"

  AFTER:
  class="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-full blur-3xl translate-y-1/2 will-change-transform pointer-events-none"
  ```
  Also add `aria-hidden="true"`.

- **Reference Code**: The existing `docs/tailwind-v4-best-practices.md` lines 119-131 document the `will-change-transform` pattern as a recommended practice.
- **Dependencies**: None
- **Expected Impact**: Each blur div will be promoted to its own compositor layer, reducing main-thread paint work. On mobile devices this can save 5-15ms per frame during scroll. The `pointer-events-none` prevents accidental click interception by the decorative overlays. The `aria-hidden="true"` removes them from the accessibility tree.
- **Risk**: Low. `will-change-transform` increases GPU memory usage slightly (3 extra layers). On devices with very limited GPU memory (old mobile phones), this could theoretically cause issues, but the elements are simple gradient circles so memory impact is minimal. The benefit far outweighs the cost.

---

### Step 4: Reduce clientCache.ts Bundle Size

- **File**: `src/utils/clientCache.ts`
- **Action**: Modify
- **Description**: The file is 242 lines and reportedly transfers at 17KB. While the raw source is reasonable, several factors contribute to unnecessary size:

  1. **Module-level side effects** (lines 229-241): The `if (typeof window !== 'undefined')` block at the bottom registers event listeners and a `setInterval` at module import time. This means ANY import of this module -- even just `hashString` -- triggers these side effects. This prevents effective tree-shaking because bundlers cannot eliminate dead code when side effects exist.

  2. **`isStorageAvailable()` called on every operation**: The method performs a full write/read/delete cycle on localStorage for each `get()`, `set()`, `has()`, and `delete()` call. This is defensive but wasteful -- the availability rarely changes during a session.

  3. **`getStats()` method**: Used only for debugging; contributes to bundle size without production value.

  **Solution**: Refactor into side-effect-free exports and separate the initialization concern.

- **Specific Changes**:

  **Phase A -- Cache `isStorageAvailable()` result**:

  Replace the `isStorageAvailable()` method with a cached version that checks once per instance:

  ```typescript
  private storageAvailable: boolean | null = null;

  private isStorageAvailable(): boolean {
    if (this.storageAvailable !== null) return this.storageAvailable;
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this.storageAvailable = true;
    } catch {
      this.storageAvailable = false;
    }
    return this.storageAvailable;
  }
  ```

  **Phase B -- Extract side effects into a separate initialization function**:

  Remove lines 229-241 (the module-level side-effect block) and replace with an exported function:

  ```typescript
  /**
   * Initializes automatic cache cleanup.
   * Call this once from your app's entry point.
   */
  export function initCacheCleanup(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      searchCache.cleanup();
      formCache.cleanup();
    });

    setInterval(() => {
      searchCache.cleanup();
      formCache.cleanup();
    }, 10 * 60 * 1000);
  }
  ```

  Then, call `initCacheCleanup()` from the `<script>` block in `src/components/TravelForm/TravelForm.astro` (the only entry point that uses both caches), after line 118:

  ```typescript
  import { initCacheCleanup } from "../../utils/clientCache";
  // ... existing code ...
  initCacheCleanup();
  ```

  **Phase C -- Mark module as side-effect-free** (optional, for future optimization):

  In `package.json`, consider adding `"sideEffects": false` or a more targeted array. This is an advanced optimization that tells bundlers the module is safe to tree-shake. However, this is a project-wide setting and should be evaluated carefully. For now, simply removing the module-level side effects is sufficient.

- **Reference Code**: The current `formHandler.ts` and `searchHandler.ts` imports from `clientCache.ts`.
- **Dependencies**: None. But must update the import in `TravelForm.astro` to include `initCacheCleanup`.
- **Expected Impact**:
  - Removing module-level side effects enables better tree-shaking for any future module that imports only `hashString` or `debounce`.
  - Caching `isStorageAvailable()` eliminates redundant localStorage probe operations (4 operations per cache call reduced to 0 after first check).
  - Overall bundle size reduction: modest (~1-2KB) since the class itself is needed. The primary benefit is architectural -- side-effect-free modules are more predictable and tree-shakeable.
- **Risk**: Low. The cleanup initialization moves from "automatic on import" to "explicit call required". The implementer must ensure `initCacheCleanup()` is called. The existing test file (`clientCache.test.ts`) tests the `ClientCache` class methods independently and should not be affected by this refactor. The auto-cleanup tests (if any reference the side-effect block) will need updating.
- **Test Impact**: `src/utils/clientCache.test.ts` may need updates for the new `initCacheCleanup` export and removal of auto-initialization behavior. See Section 5.

---

### Step 5: Tighten Build Configuration

- **File**: `astro.config.mjs`
- **Action**: Modify
- **Description**: Two settings in the Vite build configuration hide real bundle sizes and allow oversized chunks to pass silently:

  1. **`reportCompressedSize: false`** (line 42): Disables gzip-compressed size reporting during `npm run build`. This means developers never see the actual transfer sizes of their assets, hiding problems like the 43KB CSS issue.

  2. **`chunkSizeWarningLimit: 1000`** (line 43): Set to 1000KB (1MB), which is extremely permissive. The default Vite value is 500KB. A 1MB threshold means no chunk will ever trigger a warning in this project, making the setting effectively useless.

- **Specific Changes**:

  Line 42 -- enable compressed size reporting:
  ```
  BEFORE: reportCompressedSize: false,
  AFTER:  reportCompressedSize: true,
  ```

  Line 43 -- lower chunk warning limit to a stricter but reasonable threshold:
  ```
  BEFORE: chunkSizeWarningLimit: 1000
  AFTER:  chunkSizeWarningLimit: 500
  ```

  The value 500KB matches Vite's default and is appropriate for a travel web application. For an even stricter approach, 300KB could be used, but 500KB provides a good balance between catching problems and avoiding false positives from the AI SDK dependency (which is the largest dependency in the project).

- **Reference Code**: Current `astro.config.mjs` lines 39-44.
- **Dependencies**: None (but should be done before or alongside Step 2 to see CSS size impact during build)
- **Expected Impact**:
  - Developers will see gzip/brotli compressed sizes during build, providing accurate transfer size visibility.
  - Chunks exceeding 500KB will generate warnings, prompting investigation.
  - Build time increases slightly (~1-3 seconds) due to compression calculation, which is negligible.
- **Risk**: Very low. `reportCompressedSize` only affects build output logging, not the actual build artifacts. `chunkSizeWarningLimit` only controls when warnings appear -- it does not fail the build. If the AI SDK chunk exceeds 500KB, the warning is informational and can be addressed separately via dynamic imports in the future.

---

### Step 6: Resolve Font Loading Strategy

- **File**: `src/styles/global.css`
- **Action**: Modify
- **Description**: Line 34 declares `font-family: 'Plus Jakarta Sans', sans-serif;` but the font is never loaded. Currently the browser will:
  1. Parse the CSS and see `'Plus Jakarta Sans'` as the preferred font.
  2. Not find it locally (unless the user happens to have it installed).
  3. Fall back to the generic `sans-serif` system font.

  This is not a performance problem per se -- the browser handles the fallback gracefully. However, it creates an inconsistency: the declared design intent (Plus Jakarta Sans) never materializes for most users. There are two valid approaches:

  **Option A -- Remove the font declaration (Recommended)**:
  Accept system fonts and remove the unfulfilled `Plus Jakarta Sans` reference. System fonts render instantly with zero network cost and provide a native feel. Replace with a system font stack.

  **Option B -- Load the font properly**:
  Add a `@font-face` declaration or Google Fonts `<link>` to actually load Plus Jakarta Sans. This adds ~20-50KB of font files and introduces FOIT/FOUT concerns.

  **Recommendation**: Option A. The project has no brand requirement for Plus Jakarta Sans, and the preconnect links being removed in Step 1 suggest this was a leftover from a previous iteration. System fonts are faster and more predictable.

- **Specific Changes (Option A -- Recommended)**:

  Line 34 of `global.css`:
  ```
  BEFORE: font-family: 'Plus Jakarta Sans', sans-serif;
  AFTER:  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  ```

  This is the standard system font stack that renders the OS-native sans-serif font on each platform (San Francisco on macOS/iOS, Segoe UI on Windows, Roboto on Android).

- **Specific Changes (Option B -- Alternative, if custom font is desired)**:

  If the team decides Plus Jakarta Sans is important for branding, the font should be self-hosted rather than loaded from Google Fonts (to avoid third-party dependency and privacy concerns):

  1. Download Plus Jakarta Sans WOFF2 files from Google Fonts.
  2. Place them in `src/assets/fonts/`.
  3. Add `@font-face` declarations in `global.css` before the `body` rule:

  ```css
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('../assets/fonts/plus-jakarta-sans-400.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('../assets/fonts/plus-jakarta-sans-600.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('../assets/fonts/plus-jakarta-sans-700.woff2') format('woff2');
  }
  ```

  The `font-display: swap` ensures text is visible immediately with a fallback font while the custom font loads.

- **Reference Code**: N/A -- new pattern for this project.
- **Dependencies**: Step 1 (preconnect removal) should be done first or simultaneously, since both relate to font loading.
- **Expected Impact**:
  - Option A: Zero font-related network requests. Eliminates any possibility of FOIT/FOUT. Font renders in <1ms using system font.
  - Option B: Adds ~60-80KB of font files (WOFF2) but with `font-display: swap` avoids blocking render. Requires Astro asset pipeline to hash and cache-bust the font files.
- **Risk**:
  - Option A: Visual change -- the font will look different (system font vs. Plus Jakarta Sans). Since Plus Jakarta Sans was never actually loading, this change makes the explicit behavior match the actual behavior. No visual regression for real users.
  - Option B: Adds complexity and file size. Font files must be maintained and versioned.

---

## 5. Testing Plan

### 5.1 Required Tests

Since these are primarily configuration and CSS changes, automated unit tests are limited in scope. The primary testing strategy is **build verification** and **manual visual regression**.

#### 5.1.1 Existing Tests to Verify (no changes needed)

| Test File | What to Verify |
|-----------|----------------|
| `src/utils/clientCache.test.ts` | All existing tests still pass after Step 4 refactor |
| `src/components/TravelForm/formHandler.test.ts` | Imports from `clientCache` still resolve correctly |
| `src/components/TravelForm/searchHandler.test.ts` | Imports from `clientCache` still resolve correctly |

#### 5.1.2 Tests to Update

| Test File | Changes Needed |
|-----------|----------------|
| `src/utils/clientCache.test.ts` | Add test for `initCacheCleanup()` export. Update or remove any tests that depend on auto-initialization side effects at module import time. |

**New test case for `initCacheCleanup`**:

```typescript
describe('initCacheCleanup', () => {
  it('should register load event listener when window is available', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    initCacheCleanup();
    expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it('should set up periodic cleanup interval', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval');
    initCacheCleanup();
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 10 * 60 * 1000);
    setIntervalSpy.mockRestore();
  });
});
```

**Updated test for cached `isStorageAvailable`**:

```typescript
describe('ClientCache - isStorageAvailable caching', () => {
  it('should cache the storage availability check result', () => {
    const cache = new ClientCache('test');
    // First call probes localStorage
    cache.set('key1', 'value1');
    // Subsequent calls should use cached result
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    cache.set('key2', 'value2');
    // Only the actual data storage call, not the availability check
    expect(setItemSpy).toHaveBeenCalledTimes(1);
    setItemSpy.mockRestore();
  });
});
```

#### 5.1.3 Manual Testing Checklist

| Test | How to Verify | Expected Result |
|------|---------------|-----------------|
| Preconnect removal | Chrome DevTools > Network tab > filter "googleapis" | Zero requests to googleapis.com or gstatic.com |
| CSS size | `npm run build` output with `reportCompressedSize: true` | CSS bundle shows gzip size; verify it is reasonable |
| Blur GPU layers | Chrome DevTools > Layers panel on index page | Three blur divs each appear as separate compositor layers |
| Blur pointer events | Click through blur areas on index page | Clicks pass through to underlying form elements |
| Blur accessibility | Run Lighthouse accessibility audit | Decorative divs not announced by screen readers |
| Font rendering | Visual inspection on Windows, macOS, mobile | Text renders in system font; no FOUT flash |
| Cache cleanup | Import `hashString` only in a test script | No `window.addEventListener` or `setInterval` triggered |
| Build warnings | Run `npm run build` | Chunk size warnings appear for chunks > 500KB (if any) |
| Form cache | Fill form, reload page, verify form data persists | Cache still works correctly after refactor |
| Search cache | Search for destination, search again with same params | Second search uses cached result |

### 5.2 Build Verification

After all steps, run the full test suite and build:

```bash
npm test
npm run build
```

Both must pass without errors. The build output should now show compressed sizes for all assets.

---

## 6. Affected Files

| File | Action | Step | Description |
|------|--------|------|-------------|
| `src/layouts/Layout.astro` | Modify | 1 | Remove lines 47-48 (orphaned preconnect links) |
| `src/styles/global.css` | Modify | 2, 6 | Remove unused `@theme` variables (lines in `@theme` block); update `font-family` on line 34 |
| `src/pages/index.astro` | Modify | 3 | Add `will-change-transform`, `pointer-events-none`, `aria-hidden="true"` to blur divs (lines 49-60) |
| `src/utils/clientCache.ts` | Modify | 4 | Cache `isStorageAvailable()` result; extract side effects into `initCacheCleanup()` function; remove module-level side effects (lines 229-241) |
| `src/components/TravelForm/TravelForm.astro` | Modify | 4 | Add `import { initCacheCleanup }` and call it in the `<script>` block |
| `astro.config.mjs` | Modify | 5 | Change `reportCompressedSize` to `true` (line 42); change `chunkSizeWarningLimit` to `500` (line 43) |
| `src/utils/clientCache.test.ts` | Modify | 4 | Add tests for `initCacheCleanup()`; update tests affected by side-effect removal; add test for cached storage availability check |

---

## 7. Implementation Order

The recommended order prioritizes highest-impact, lowest-risk changes first:

| Priority | Step | Impact | Risk | Estimated Time |
|----------|------|--------|------|----------------|
| 1 | Step 1: Remove orphaned preconnect | High (network) | None | 2 min |
| 2 | Step 5: Tighten build config | High (DX) | Very Low | 2 min |
| 3 | Step 3: GPU compositing for blur | Medium (render) | Low | 5 min |
| 4 | Step 6: Font loading strategy | Medium (consistency) | Low | 5 min |
| 5 | Step 2: CSS output optimization | Medium (size) | Low | 15 min (requires audit) |
| 6 | Step 4: clientCache.ts refactor | Medium (architecture) | Low | 20 min (requires test updates) |

---

## 8. Expected Metrics After All Fixes

| Metric | Before | After (Expected) | Notes |
|--------|--------|-------------------|-------|
| Wasted DNS lookups | 2 (googleapis, gstatic) | 0 | Step 1 |
| CSS transfer size (gzip) | Unknown (reporting disabled) | ~8-12KB gzip | Step 2 + Step 5 enables visibility |
| GPU composite layers on index | 0 (blur on main thread) | 3 dedicated layers | Step 3 |
| Main thread paint time (index scroll) | Baseline | -5-15ms per frame | Step 3 |
| Font load requests | 0 (was 0, but intent was unclear) | 0 (explicitly system font) | Step 6 |
| Build size visibility | Hidden | Full gzip/brotli reporting | Step 5 |
| Chunk warning threshold | 1MB (useless) | 500KB (effective) | Step 5 |
| clientCache.ts side effects on import | Yes (always) | No (explicit init only) | Step 4 |
| TTFB (cold start) | 987ms | ~987ms (unchanged, server-side) | No server changes |
| DOMContentLoaded | 102ms | ~95-100ms (marginal improvement) | Slight CSS reduction |
| Load Complete | 138ms | ~125-135ms (preconnect removal) | Eliminates wasted connections |

---

## 9. Additional Considerations

### 9.1 Potential Risks and Edge Cases

1. **Theme variable removal (Step 2)**: The implementer MUST grep the entire `src/` directory for each variable before removing it. Some variables may be used in inline styles within the `[destination].astro` template (which uses `hsl(var(...))` extensively in template literals). A missed reference will cause a visual regression.

2. **`initCacheCleanup()` not called (Step 4)**: If the implementer forgets to add the `initCacheCleanup()` call in `TravelForm.astro`, expired cache entries will accumulate in localStorage indefinitely. This is a degraded state, not a crash -- the cache still functions, it just doesn't auto-clean.

3. **`will-change` on always-visible elements (Step 3)**: The Tailwind v4 best practices doc warns against overusing `will-change`. In this case it is justified because the blur elements are always visible on the page and the blur radius (64px) is computationally expensive. However, if more `will-change` elements are added in the future, GPU memory should be monitored.

4. **System font visual change (Step 6)**: On Windows, the body text will render in Segoe UI instead of the previously declared (but never loaded) Plus Jakarta Sans. Since Plus Jakarta Sans was never loading anyway, this changes the declared intent but not the actual visual output. However, if any team member has Plus Jakarta Sans installed locally, they will see a visual difference after this change.

### 9.2 What This Plan Does NOT Address

- **Cold start TTFB of 987ms**: This is a Vercel serverless cold start issue and cannot be fixed with frontend optimizations. Solutions include Vercel's "Always Warm" feature (paid) or edge functions.
- **HTML transfer size of 60KB without compression**: The Astro config has `compressHTML: true` which minifies HTML. The actual transfer should be gzip-compressed by Vercel's CDN. The 60KB number may be the uncompressed size, which is normal for a page with inline structured data and a full form. If compression is not being applied, it is a Vercel configuration issue, not a code issue.
- **`clientCache.ts` 17KB transfer**: After Step 4, the file remains largely the same size because the class implementation is needed. The 17KB is likely the uncompressed/unminified development size. In production build with minification and gzip, this should be ~3-5KB.

### 9.3 Future Improvements

1. **CSS code-splitting**: Consider using Astro's `inlineStylesheets: 'never'` and letting the browser cache CSS separately from HTML. Currently set to `'auto'` which is reasonable.
2. **Dynamic import for AI SDK**: The `@ai-sdk/groq` and `ai` packages are large server-side dependencies. If they appear in client bundles (unlikely given Astro's architecture), they should be dynamically imported.
3. **Image optimization**: The itinerary page loads hero images from Unsplash. Consider using Astro's `<Image>` component with `loading="lazy"` and responsive `srcset` for better LCP.
4. **CSS Layers**: Investigate using `@layer` in `global.css` to control specificity and potentially allow Tailwind to better tree-shake unused styles.
5. **Periodic performance audits**: Establish a practice of running Lighthouse CI on every PR to catch performance regressions early.

---

## 10. Summary

This plan addresses six concrete performance issues in TravelGen through targeted, low-risk modifications. The highest-value changes (orphaned preconnect removal and build config tightening) can be implemented in under 5 minutes. The more involved changes (CSS audit and clientCache refactor) require careful verification but follow established patterns in the codebase. All changes are backward-compatible and require no API or data flow modifications.
