# Deployment Checklist - Travel Web

Use this checklist before each deployment to ensure everything is ready.

## Pre-Deployment (Local Development)

### Code Quality
- [ ] Run tests: `npm test`
- [ ] Type checking passes: `npm run check`
- [ ] No ESLint errors: `npm run lint` (if configured)
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors or warnings in browser
- [ ] All changes committed to git
- [ ] Branch up-to-date: `git pull origin main`

### Features Testing
- [ ] Search functionality works
- [ ] Itinerary generation works
- [ ] Images load correctly
- [ ] Cache is working
- [ ] Error handling works (test with invalid input)
- [ ] Responsive design verified (mobile, tablet, desktop)

### Code Review
- [ ] No hardcoded secrets (API keys, passwords)
- [ ] No debug code left behind
- [ ] Comments updated if needed
- [ ] No console.log() in production code
- [ ] No TODO comments blocking deployment

## Vercel Configuration

### Environment Variables
- [ ] `GROQ_API_KEY` set in Vercel
- [ ] `UNSPLASH_ACCESS_KEY` set in Vercel
- [ ] All variables have production values (not dev)
- [ ] No empty environment variables
- [ ] Secrets encrypted (not visible in logs)

### Configuration Files
- [ ] `vercel.json` present and valid
- [ ] Build command correct: `npm run build`
- [ ] Output directory correct: `dist`
- [ ] Node version compatible: `18.x`
- [ ] Framework specified: `astro`

### Project Settings
- [ ] Deployments enabled on main branch
- [ ] Auto-deploy on push enabled (if desired)
- [ ] Build settings configured
- [ ] Root directory is `.`

## Pre-Deployment Verification

### Git Status
- [ ] All work committed: `git status` shows clean
- [ ] Latest code pushed: `git log --oneline -1`
- [ ] No uncommitted changes

### Build Verification
```bash
npm run build
npm run check
```
- [ ] Build completes without errors
- [ ] No type errors
- [ ] Output directory has content

## Deployment Execution

### Deployment Method
- [ ] Using: `git push origin main` OR
- [ ] Using: `vercel --prod` OR
- [ ] Using: Vercel Dashboard manual deploy

### Post-Deployment (Immediate)
- [ ] Deployment completes successfully
- [ ] No build errors
- [ ] Production URL assigned
- [ ] Deployment marked as ready

### Verification After Deploy

#### Website Functionality
- [ ] Production URL loads without errors
- [ ] Page renders correctly
- [ ] All assets load (images, fonts, CSS, JS)
- [ ] Navigation works
- [ ] Forms are interactive

#### API Functionality
- [ ] Search endpoint responds: `/api/search`
- [ ] API calls complete successfully
- [ ] Response times acceptable
- [ ] Error handling works

#### Features Testing
- [ ] Search with test input works
- [ ] Itinerary generation succeeds
- [ ] Results display correctly
- [ ] Images load from Unsplash
- [ ] Cache operates correctly

#### Performance
- [ ] Page loads in <3 seconds
- [ ] No 404 errors in console
- [ ] No JavaScript errors
- [ ] No CORS issues
- [ ] Network requests normal

### Logs Review
- [ ] Vercel Build Logs show success
- [ ] Function Logs show no errors
- [ ] No warnings in deployment
- [ ] Check environment variable logs

## Post-Deployment

### Monitoring
- [ ] Monitor error rates for 5-10 minutes
- [ ] Check for user-reported issues
- [ ] Verify analytics data coming in
- [ ] Monitor API response times

### Documentation
- [ ] Update CHANGELOG if needed
- [ ] Document any configuration changes
- [ ] Note any known issues
- [ ] Update team on deployment status

### Ready to Sign Off
- [ ] All checks passed
- [ ] Features working as expected
- [ ] No critical issues found
- [ ] Performance acceptable
- [ ] Team notified of deployment

## If Something Goes Wrong

### Immediate Actions
- [ ] Check Vercel dashboard for errors
- [ ] Review build logs
- [ ] Check function logs for API errors
- [ ] Verify environment variables loaded

### Debugging Steps
- [ ] Check network tab in browser DevTools
- [ ] Review console for errors
- [ ] Test API endpoint directly (Postman/curl)
- [ ] Check Vercel logs: `vercel logs --follow`

### Rollback Procedure
- [ ] Go to Vercel Deployments
- [ ] Find previous successful deployment
- [ ] Click "Redeploy"
- [ ] Wait for redeploy to complete
- [ ] Verify previous version working

## Notes

Use this section to note anything specific to this deployment:

```
Date: ___________
Deployed by: ___________
Changes included: ___________
Special considerations: ___________
Issues discovered: ___________
Resolution: ___________
```
