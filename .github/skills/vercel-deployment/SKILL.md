---
name: vercel-deployment
description: Complete workflow for deploying Astro applications to Vercel, including configuration, environment setup, and deployment verification
---

# Vercel Deployment Skill

This skill guides you through deploying Astro applications to Vercel with proper configuration, environment management, and production readiness checks.

## When to Use This Skill

Use this skill when you need to:
- Deploy the Travel Web application to Vercel
- Set up Vercel environment variables (API keys, secrets)
- Configure Vercel build settings for Astro
- Verify deployment status and logs
- Troubleshoot deployment failures
- Update production environment variables
- Roll back deployments

## Deployment Checklist

Before deploying, verify:

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] Type checking passing: `npm run check`
- [ ] No console errors or warnings
- [ ] Committed all changes to git
- [ ] Branch is up-to-date with main

### Environment & Secrets
- [ ] All required environment variables defined in `.env.example`
- [ ] No hardcoded secrets in code
- [ ] Vercel environment variables configured in dashboard
- [ ] `GROQ_API_KEY` configured in Vercel
- [ ] `UNSPLASH_ACCESS_KEY` configured in Vercel
- [ ] Production environment variables set (not dev values)

### Build Configuration
- [ ] `vercel.json` configured correctly
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Root directory: `.` (or project root)

### Application Readiness
- [ ] Images optimized and in `/public`
- [ ] Fonts loaded correctly
- [ ] API endpoints tested
- [ ] Cache strategy validated
- [ ] Error handling tested
- [ ] Mobile responsiveness verified

## Step-by-Step Deployment

### 1. Prepare Your Local Environment

```bash
# Verify you're on main branch
git branch

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Verify build locally
npm run build

# Check for errors
npm run check
```

### 2. Verify Deployment Configuration

Review `[vercel.json](./vercel.json)`:
- Build command is correct
- Output directory matches Astro output
- Environment variables are listed
- Functions are configured (if using Vercel Functions)

### 3. Set Environment Variables in Vercel Dashboard

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add/update:
   - `GROQ_API_KEY` - Your Groq API key
   - `UNSPLASH_ACCESS_KEY` - Unsplash API key
   - Any other required variables

**Important**: Different values for development vs production:
- **Development**: Less strict rate limits, debug logging
- **Production**: Optimized for performance, no debug output

### 4. Trigger Deployment

#### Option A: Push to main (Automatic)
```bash
git push origin main
```
Vercel automatically deploys when main branch is updated.

#### Option B: Manual Deploy from CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

### 5. Monitor Deployment

```bash
# View deployment logs in Vercel Dashboard:
# 1. Go to project
# 2. Click "Deployments" tab
# 3. Click most recent deployment
# 4. Check Build Logs and Function Logs
```

**Expected output:**
```
✓ Build completed
✓ Assigned production URL
✓ Environment variables loaded
✓ All functions deployed
```

### 6. Post-Deployment Verification

After deployment completes:

1. **Check Application**
   - Visit production URL
   - Test search functionality
   - Verify itinerary generation
   - Check image loading

2. **Verify API Calls**
   - Open DevTools (F12)
   - Go to Network tab
   - Trigger search
   - Verify `/api/search` returns 200
   - Check response time

3. **Check Logs**
   - Vercel Dashboard → Deployments → Function Logs
   - Look for errors or warnings
   - Verify environment variables loaded

4. **Test Features**
   - Search with different parameters
   - Generate itinerary
   - Check cache working
   - Verify error handling

## Common Deployment Issues & Solutions

### Issue: Environment variables undefined

**Symptom**: `GROQ_API_KEY is undefined`

**Solution**:
1. Verify variable is set in Vercel Dashboard
2. Redeploy after updating (Vercel caches)
3. Use Vercel CLI to check: `vercel env pull`
4. Check variable name matches (case-sensitive)

### Issue: Build timeout

**Symptom**: `Build failed after 60s`

**Solution**:
1. Check `vercel.json` build command
2. Ensure dependencies are cacheable
3. Increase build timeout in project settings
4. Optimize large dependencies

### Issue: API calls failing in production

**Symptom**: Works locally, fails on production

**Solutions**:
- Check API endpoint paths (relative vs absolute)
- Verify CORS headers (if needed)
- Check environment variables in production
- Review Vercel Function logs
- Test with production API keys locally

### Issue: Image/asset 404

**Symptom**: Images not loading on production

**Solutions**:
- Verify assets in `/public` directory
- Check asset paths (use `/` prefix)
- Ensure proper image optimization
- Check deployment file structure

## Advanced: Environment-Specific Configuration

### Different configs per environment

In `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "GROQ_API_KEY": "@groq-api-key",
    "UNSPLASH_ACCESS_KEY": "@unsplash-key"
  }
}
```

### Preview vs Production

- **Preview**: Automatic from pull requests
- **Production**: Only from main branch

Use preview URLs to test before promoting to production.

## Rollback Procedure

If deployment has issues:

1. **Immediate Rollback**
   - Vercel Dashboard → Deployments
   - Find previous working deployment
   - Click "Redeploy"

2. **Code Rollback**
   ```bash
   git log --oneline
   git revert <commit-hash>
   git push origin main
   ```

3. **Verify Rollback**
   - Check deployment status
   - Visit production URL
   - Verify features working

## Monitoring & Logs

### View Deployment Logs

**Build Logs**:
- Vercel Dashboard → Deployments → Click deployment → Build Logs

**Function Logs** (API Routes):
- Vercel Dashboard → Deployments → Click deployment → Function Logs
- Real-time logs as requests come in

### Debug with Vercel CLI

```bash
# View latest logs
vercel logs

# Follow logs in real-time
vercel logs --follow

# Specific deployment
vercel logs --id=<deployment-id>
```

## Performance Optimization for Production

After deployment, optimize:

1. **Image Optimization**
   - Use Vercel Image Optimization
   - Lazy load images
   - Compress before upload

2. **Caching**
   - Set appropriate cache headers
   - Use Vercel Edge Cache
   - Enable ISR if using dynamic content

3. **Database Queries**
   - Minimize API calls
   - Use caching strategy
   - Optimize query performance

4. **Monitoring**
   - Set up Vercel Analytics
   - Monitor Core Web Vitals
   - Track error rates

## Resources

- [vercel.json](./vercel.json) - Configuration template
- [deployment-checklist.md](./deployment-checklist.md) - Printable checklist
- [environment-setup.md](./environment-setup.md) - Environment variables guide
- [troubleshooting.md](./troubleshooting.md) - Common issues and solutions

## Next Steps

After successful deployment:
1. Monitor analytics in Vercel Dashboard
2. Set up alerts for build failures
3. Configure monitoring tools (Sentry, etc.)
4. Plan rollout strategy for major updates
5. Document any project-specific deployment procedures
