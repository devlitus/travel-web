# Troubleshooting Vercel Deployments

Common issues and solutions when deploying Travel Web to Vercel.

## Build Issues

### Build Timeout

**Error**: Build failed after 60 seconds

**Causes**:
- Large dependencies taking too long to install
- Network issues during build
- Complex build process
- Insufficient build resources

**Solutions**:
```bash
# 1. Check build time locally
npm run build
# Note the time - should be <30s

# 2. Verify dependencies
npm ls | grep -i large

# 3. Remove unnecessary dependencies
npm uninstall unused-package

# 4. In Vercel Settings:
# - Increase build timeout (max 60s for free tier)
# - Use npm ci instead of npm install
# - Add build cache
```

**In vercel.json**:
```json
{
  "buildCommand": "npm ci && npm run build",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Build Command Not Found

**Error**: `npm: command not found` or `npm: not found`

**Causes**:
- Node/npm not installed
- Node version mismatch
- PATH not set correctly

**Solutions**:
1. Specify Node version in `vercel.json`:
```json
{
  "nodeVersion": "18.x"
}
```

2. Or in `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Output Directory Not Found

**Error**: `dist directory not found`

**Causes**:
- Build command not running
- Output directory name mismatch
- Build failed silently

**Solutions**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Verify Astro build output:
```bash
# Check astro.config.mjs
# Should have: outDir: "dist" (default)
npm run build && ls -la dist/
```

## Environment Variable Issues

### Variables Undefined in Production

**Error**: `GROQ_API_KEY is undefined` on production

**Causes**:
- Variable not set in Vercel
- Variable name mismatch
- Using wrong access pattern
- Variable not deployed yet

**Solutions**:

1. **Verify variable exists**:
   - Vercel Dashboard → Settings → Environment Variables
   - Check name: `GROQ_API_KEY` (case-sensitive)
   - Check value is not empty

2. **Redeploy after adding variable**:
   ```bash
   # Variables don't auto-reload
   # Must redeploy or trigger new build
   git push origin main
   # or
   vercel --prod
   ```

3. **Use correct access method**:
   ```typescript
   // ✅ Correct - SSR only
   const key = process.env.GROQ_API_KEY;

   // ❌ Wrong - doesn't work for secrets
   const key = import.meta.env.GROQ_API_KEY;

   // ❌ Wrong - exposes to client
   const key = import.meta.env.PUBLIC_GROQ_API_KEY;
   ```

4. **Test locally**:
   ```bash
   vercel env pull
   npm run build
   # Check if error still occurs
   ```

### Different Values Between Environments

**Problem**: Dev keys working locally, production keys failing

**Causes**:
- Different key formats
- Production key not activated
- Rate limits different
- Permissions differ

**Solutions**:
```bash
# Check dev value works
GROQ_API_KEY=dev_key npm run build

# Check prod value locally
vercel env pull
# Edit to add production key
npm run build

# Deploy
git push origin main
```

## API Endpoint Issues

### 404 on /api/search

**Error**: GET /api/search returns 404

**Causes**:
- API route file missing
- Wrong file extension (.js vs .ts)
- Not in `src/pages/api/` directory
- Function not exported

**Solutions**:

1. **Verify file exists**:
   ```bash
   ls -la src/pages/api/
   # Should see search.ts or search.js
   ```

2. **Verify exports**:
   ```typescript
   // src/pages/api/search.ts
   export async function POST({ request }) {
     // Must export POST/GET/etc
   }
   ```

3. **Rebuild and redeploy**:
   ```bash
   npm run build
   npm run preview  # Test locally
   git push origin main
   ```

### API Timeout (500 errors)

**Error**: Request to /api/search times out or returns 500

**Causes**:
- Groq API slow
- Rate limit hit
- Missing environment variable
- Error in API code

**Solutions**:

1. **Check logs**:
   ```bash
   vercel logs --follow
   ```

2. **Verify environment variable loaded**:
   ```typescript
   export async function POST({ request }) {
     console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
     // Should log true
   }
   ```

3. **Test Groq API directly**:
   ```bash
   curl -X POST https://api.groq.com/openai/v1/chat/completions \
     -H "Authorization: Bearer YOUR_KEY" \
     -d '{"model":"llama-3.3-70b-versatile","messages":[...]}'
   ```

4. **Increase function timeout** in `vercel.json`:
   ```json
   {
     "functions": {
       "src/pages/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

## Asset Loading Issues

### Images Not Loading (404)

**Error**: Images show broken icon, 404 in network tab

**Causes**:
- Assets not in `/public` directory
- Asset paths incorrect
- Missing domain whitelist

**Solutions**:

1. **Check asset location**:
   ```bash
   ls public/
   # Images should be here
   ```

2. **Fix asset paths in HTML**:
   ```astro
   <!-- ✅ Correct -->
   <img src="/images/destination.jpg" alt="Destination" />

   <!-- ❌ Wrong -->
   <img src="images/destination.jpg" alt="Destination" />
   <img src="./images/destination.jpg" alt="Destination" />
   ```

3. **Verify build includes assets**:
   ```bash
   npm run build
   ls dist/ | grep -E "images|assets"
   # Should see asset files
   ```

### Unsplash Images Failing

**Error**: Unsplash images 403 Forbidden or 429 Rate Limit

**Causes**:
- API key invalid or revoked
- Rate limit exceeded
- Key permissions insufficient

**Solutions**:

1. **Verify key**:
   - Go to https://unsplash.com/oauth/applications
   - Check app exists and key matches

2. **Check rate limit**:
   ```bash
   # Unsplash allows 50 requests/hour free tier
   # Increase if needed in dashboard
   ```

3. **Verify key in Vercel**:
   - Settings → Environment Variables
   - Check `UNSPLASH_ACCESS_KEY` value
   - Redeploy if just added

### CSS/JS Not Loading

**Error**: Page loads but unstyled, no interactivity

**Causes**:
- Build not including CSS/JS
- Asset paths incorrect
- Output directory mismatch

**Solutions**:

1. **Check build output**:
   ```bash
   npm run build
   ls -la dist/
   # Should see _astro/ folder with CSS/JS
   ```

2. **Verify output directory**:
   ```json
   {
     "outputDirectory": "dist"
   }
   ```

3. **Check astro.config.mjs**:
   ```javascript
   export default defineConfig({
     outDir: new URL('./dist', import.meta.url),
   });
   ```

## Performance Issues

### Slow Page Load

**Problem**: Page takes >5 seconds to load

**Check**:

1. **Deployment latency**:
   - Is it slow globally or from specific region?
   - Check Vercel Analytics

2. **Asset size**:
   - Images too large?
   - JavaScript bundle large?
   - ```bash
     npm run build
     npm run preview  # Check sizes
     ```

3. **API response time**:
   - Test Groq API response
   - Check Groq dashboard

**Solutions**:
- Optimize images
- Enable caching
- Reduce JavaScript
- Use CDN

### High Memory Usage

**Error**: Function execution timeout due to memory

**Solutions** in `vercel.json`:
```json
{
  "functions": {
    "src/pages/api/**/*.ts": {
      "memory": 1024
    }
  }
}
```

## Debugging Tips

### Check Vercel Logs

```bash
# Install Vercel CLI
npm i -g vercel

# View deployment logs
vercel logs
vercel logs --follow  # Real-time

# Specific deployment
vercel logs --id=<deployment-id>

# Filter by function
vercel logs --function=api/search
```

### Local Preview

```bash
# Build and preview locally
npm run build
npm run preview

# Should match production behavior
# Test all features before deploying
```

### Enable Debug Logging

Add to code temporarily:
```typescript
export async function POST({ request }) {
  console.log('Starting search...');
  console.log('Environment check:', {
    hasKey: !!process.env.GROQ_API_KEY,
    hasUnsplash: !!process.env.UNSPLASH_ACCESS_KEY
  });
  
  try {
    // ... main code
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
}
```

Check logs:
```bash
vercel logs --follow
# Trigger request to see logs
```

## Getting Help

### Check Resources

1. **Vercel Status**: https://www.vercel-status.com
2. **Vercel Docs**: https://vercel.com/docs
3. **Community**: https://github.com/vercel/vercel/discussions
4. **Support**: https://vercel.com/support

### Provide Info When Asking For Help

```
- Deployment ID: [from Vercel dashboard]
- Error message: [exact error]
- Steps to reproduce: [what triggers it]
- Build log excerpt: [relevant log section]
- Local behavior: [does it work locally?]
```

## Emergency: Rollback

If something critical is broken:

```bash
# 1. Check previous deployment
vercel deployments

# 2. Redeploy previous working version
vercel redeploy <deployment-id>

# 3. Or revert code
git log --oneline
git revert <bad-commit>
git push origin main
```

Takes ~30 seconds to rollback.
