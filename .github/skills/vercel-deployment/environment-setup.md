# Environment Setup Guide

Complete guide for configuring environment variables for Vercel deployment.

## Required Environment Variables

### API Keys

#### GROQ_API_KEY
- **What**: API key for Groq AI service
- **Where to get**: https://console.groq.com
- **Scope**: Required for search/itinerary generation
- **Development**: Use personal dev key
- **Production**: Use production API key with higher limits
- **Format**: `gsk_XXXXXXXXXXXXXXXXXXXXXX`

#### UNSPLASH_ACCESS_KEY
- **What**: API key for Unsplash image service
- **Where to get**: https://unsplash.com/oauth/applications
- **Scope**: Required for destination images
- **Development**: Can use same key as production
- **Production**: Use production app credentials
- **Format**: Random string (example: `a1b2c3d4e5f6...`)

## Setting Up Environment Variables

### Step 1: Generate Keys

1. **Groq API Key**
   - Visit https://console.groq.com
   - Sign in / Create account
   - Go to API keys section
   - Create new API key
   - Copy the key

2. **Unsplash API Key**
   - Visit https://unsplash.com/oauth/applications
   - Create new application
   - Accept terms
   - Copy Access Key

### Step 2: Local Development (.env.local)

Create `.env.local` file in project root:

```env
GROQ_API_KEY=your_groq_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
```

**Important**: 
- Never commit `.env.local`
- Add to `.gitignore` (should already be there)
- Use dev keys that are non-production

### Step 3: Vercel Production Setup

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings**
   - Click "Settings" tab
   - Left sidebar → "Environment Variables"

3. **Add Variables**
   - Click "Add new"
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your production Groq key
   - **Select environments**: Production (optional: Preview)
   - Click "Save"

4. **Repeat for Unsplash**
   - **Name**: `UNSPLASH_ACCESS_KEY`
   - **Value**: Your Unsplash key
   - **Select environments**: Production, Preview, Development

### Step 4: Verify Setup

```bash
# Pull environment variables from Vercel
vercel env pull

# Check .env.local now has Vercel variables (for testing)
cat .env.local

# Run local build with production vars
npm run build
```

## Environment-Specific Values

### Development
```env
GROQ_API_KEY=gsk_dev_XXXXXXX (dev key with lower rate limits)
UNSPLASH_ACCESS_KEY=demo_or_personal_key
```

### Preview (Staging)
```env
GROQ_API_KEY=gsk_staging_XXXXXXX (staging key)
UNSPLASH_ACCESS_KEY=staging_app_key
```

### Production
```env
GROQ_API_KEY=gsk_prod_XXXXXXX (production key with high limits)
UNSPLASH_ACCESS_KEY=production_app_key
```

## Accessing Variables in Code

### In SSR Routes (src/pages/api/*)

```typescript
// Use process.env (server-side only)
const apiKey = process.env.GROQ_API_KEY;

// This is safe - only available on server
export async function POST({ request }) {
  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });
  // ...
}
```

### NOT in Client-Side Code

```typescript
// ❌ DON'T DO THIS (exposes keys!)
const key = import.meta.env.PUBLIC_GROQ_API_KEY;

// ❌ DON'T DO THIS (browser can see it)
fetch('/api/search', {
  body: JSON.stringify({
    apiKey: import.meta.env.GROQ_API_KEY, // WRONG!
  })
});
```

## Troubleshooting

### "GROQ_API_KEY is undefined"

**Solutions**:
1. Verify variable set in Vercel: Settings → Environment Variables
2. Check variable name matches: `GROQ_API_KEY` (case-sensitive)
3. Redeploy after adding variable
4. Use `vercel env pull` to test locally
5. Check it's used in `process.env`, not `import.meta.env`

### "Rate limit exceeded"

**Solutions**:
1. Verify you're using production key, not dev key
2. Check Groq console for rate limit settings
3. Add caching to reduce API calls
4. Contact Groq support for limit increase

### "Unsplash images not loading"

**Solutions**:
1. Verify `UNSPLASH_ACCESS_KEY` is set
2. Check key is valid and not revoked
3. Verify rate limits not exceeded
4. Use correct image URL format

### "Works locally, fails on production"

**Solutions**:
1. Verify environment variables in production ≠ development
2. Check production keys have correct permissions
3. Verify no typos in variable names
4. Test with `vercel env pull` locally first

## Security Best Practices

### DO ✅
- ✅ Keep keys in environment variables only
- ✅ Use strong, unique keys for production
- ✅ Rotate keys regularly
- ✅ Monitor key usage in provider dashboards
- ✅ Use different keys per environment
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use server-side routes for API calls

### DON'T ❌
- ❌ Commit keys to git
- ❌ Share keys in messages/email
- ❌ Use same key across environments
- ❌ Expose keys in client-side code
- ❌ Commit `.env` files
- ❌ Log keys in error messages
- ❌ Share keys in screenshots

## Monitoring Usage

### Groq API

1. Go to https://console.groq.com
2. Dashboard shows:
   - Request count
   - Tokens used
   - Rate limit status
   - Error rates

### Unsplash API

1. Go to https://unsplash.com/oauth/applications
2. Select your app
3. See:
   - Requests/hour used
   - Rate limit
   - Monthly requests

## Updating Variables

### For Development

```bash
# Update .env.local manually
echo "GROQ_API_KEY=new_key" > .env.local
```

### For Production

1. Vercel Dashboard
2. Settings → Environment Variables
3. Click variable
4. Edit value
5. Save
6. **Important**: Trigger new deployment for changes to take effect

## Rotation Strategy

Regular key rotation improves security:

1. **Create new key** in provider dashboard
2. **Add new key to Vercel** environment variables
3. **Test** with preview deployment
4. **Promote** to production when verified
5. **Revoke old key** in provider dashboard
6. **Monitor** for any issues

## References

- Groq Console: https://console.groq.com
- Unsplash Developers: https://unsplash.com/oauth/applications
- Vercel Docs: https://vercel.com/docs/environment-variables
- Astro Env: https://docs.astro.build/en/guides/environment-variables/
