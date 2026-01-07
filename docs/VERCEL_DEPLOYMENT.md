# Vercel Deployment Plan for Fitness Web App

## Quick Reference

**Domain**: `apexfit.in` (from GoDaddy)
**Production URL**: `https://apexfit.in`
**Admin Panel**: `http://localhost:3001` (local-only, never deployed)
**Repository**: `https://github.com/shubh7shubh/web-admin-fitness.git`
**Deploy Directory**: `apps/web/` only

**Key Features**:
- ✅ Automatic deployments on push to `main`
- ✅ Preview deployments for all PRs
- ✅ Custom domain with SSL certificate
- ✅ Vercel Analytics enabled
- ✅ GitHub PR comments with preview URLs
- ✅ Admin panel remains local-only

---

## Overview
Deploy the web app from `apps/web/` to Vercel with automatic deployments on push/PR to main branch, configure custom GoDaddy domain (`apexfit.in`), enable Vercel Analytics and GitHub Preview Comments, and ensure admin panel remains local-only for security.

## Current State
- **Repository**: Simple monorepo with separate `apps/web` and `apps/admin`
- **Structure**: Not using Turborepo or npm workspaces
- **Web App**: Next.js 16, ready for deployment
- **Admin Panel**: Local-only (port 3001)
- **No existing Vercel config**: Clean slate for setup
- **Domain**: `apexfit.in` purchased from GoDaddy

---

## Execution Steps

### Step 0: Save Deployment Plan to Repository

**Before starting deployment**, save this entire plan to the repository for future reference:

**File**: `/Users/apple/Documents/GitHub/fitness-web/docs/VERCEL_DEPLOYMENT.md`
**Action**: Create new documentation file with this complete deployment plan
**Purpose**:
- Document the deployment process for future reference
- Share deployment instructions with team members
- Track configuration decisions and setup steps

---

## Deployment Strategy

### Phase 1: Vercel Project Setup (Web App Only)

**1.1 Create Vercel Configuration File**
- Create `vercel.json` in project root: `/Users/apple/Documents/GitHub/fitness-web/vercel.json`
- Configure to deploy only `apps/web`
- Set build settings and output directory
- Ignore admin panel from deployments

**File: `/Users/apple/Documents/GitHub/fitness-web/vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ],
  "buildCommand": "cd apps/web && npm install && npm run build",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "cd apps/web && npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

**1.2 Link Project to Vercel** (You already have a Vercel account)
```bash
cd /Users/apple/Documents/GitHub/fitness-web
vercel link
```
- Select your Vercel team/account
- Create new project: "apexfit-web"
- Link to GitHub repository: `shubh7shubh/web-admin-fitness`

**1.3 Configure Build Settings in Vercel Dashboard**
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Node Version**: 18.x or 20.x

---

### Phase 2: Environment Variables Configuration

**2.1 Set Environment Variables in Vercel Dashboard**

Navigate to Vercel Project → Settings → Environment Variables

Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://oswlhrzarxjpyocgxgbr.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[your-actual-anon-key]` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://apexfit.in` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://[preview-url].vercel.app` | Preview |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Development |

**2.2 Retrieve Supabase Keys**
- Copy from `apps/web/.env.local` file
- Or get from Supabase Dashboard → Project Settings → API

---

### Phase 3: Automatic Deployment Setup

**3.1 Connect GitHub Repository**
In Vercel Dashboard:
1. Go to Project Settings → Git
2. Connect repository: `shubh7shubh/web-admin-fitness`
3. Select branch: `main`

**3.2 Configure Deployment Triggers**
- **Production Deployments**: Triggered on push to `main` branch
- **Preview Deployments**: Triggered on PRs to `main` branch
- **Auto-deploy**: Enabled by default once connected

**3.3 Deployment Settings**
- Production Branch: `main`
- Deploy Hooks: Automatic (no manual approval needed)
- Build & Output Settings: Use settings from Phase 1.4

---

### Phase 4: Custom Domain Configuration (GoDaddy → apexfit.in)

**4.1 Add Domain in Vercel**
1. Go to Vercel Project → Settings → Domains
2. Click "Add Domain"
3. Enter your GoDaddy domain: `apexfit.in`
4. Also add `www.apexfit.in` for www subdomain
5. Vercel will provide nameserver configuration

**4.2 Configure DNS in GoDaddy (Using Nameservers - Recommended)**

**Steps to Change Nameservers**:
1. Log in to GoDaddy account
2. Go to **My Products** → **Domains** → Select `apexfit.in`
3. Click **Manage DNS**
4. Scroll to **Nameservers** section
5. Click **Change Nameservers** → Select **Custom**
6. Enter Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
7. Click **Save**
8. Wait for DNS propagation (typically 5-30 minutes, can take up to 48 hours)

**Why Nameservers?**
- ✅ Automatic SSL certificate management
- ✅ Faster DNS propagation
- ✅ No manual record updates needed
- ✅ Automatic www redirect handling
- ✅ Vercel manages all DNS records

**4.3 Verify Domain**
- Vercel automatically provisions SSL certificate (Let's Encrypt)
- Check domain status in Vercel dashboard
- Status should change to "Valid Configuration" with green checkmark
- Both `apexfit.in` and `www.apexfit.in` should show valid

**4.4 Set Primary Domain**
1. In Vercel → Domains, set `apexfit.in` (non-www) as primary
2. This ensures `www.apexfit.in` redirects to `apexfit.in`
3. Vercel subdomain (e.g., `apexfit-web.vercel.app`) also redirects to primary domain

---

### Phase 5: Supabase OAuth Redirect URLs

**5.1 Update Supabase Authentication Settings**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL**: `https://apexfit.in`
3. Add **Redirect URLs** (one per line):
   - `http://localhost:3000/auth/callback` (local development)
   - `https://apexfit.in/auth/callback` (production)
   - `https://www.apexfit.in/auth/callback` (www subdomain)
   - `https://*.vercel.app/auth/callback` (preview deployments - wildcard)

**5.2 Configure Allowed Redirect URLs for OAuth Providers**
If using Google OAuth, also update Google Cloud Console:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   - `https://apexfit.in/auth/callback`
   - `https://oswlhrzarxjpyocgxgbr.supabase.co/auth/v1/callback`

**5.3 Test OAuth Flow**
- Visit `https://apexfit.in/login`
- Click "Sign in with Google"
- Verify redirect to `/dashboard` after authentication
- Check no errors in browser console

---

### Phase 6: Admin Panel Security (Local-Only)

**6.1 Verify Admin Panel is NOT Deployed**
- Admin panel lives in `apps/admin` (separate directory)
- Vercel config points only to `apps/web`
- No deployment configuration for admin

**6.2 Admin Panel Usage**
**Local Development Only**:
```bash
cd /Users/apple/Documents/GitHub/fitness-web/apps/admin
npm run dev -- -p 3001
```
- Access at: `http://localhost:3001`
- Never accessible publicly
- Maximum security via localhost-only access

**6.3 Document Admin Access**
Add to README or internal docs:
- Admin panel runs locally on port 3001
- Only accessible to developers with repository access
- Requires admin role (`is_admin = true` in Supabase profiles table)

---

### Phase 7: Vercel Analytics Setup

**7.1 Enable Vercel Analytics**
1. Go to Vercel Dashboard → Your Project → Analytics tab
2. Click **Enable Analytics**
3. Select plan:
   - **Hobby (Free)**: Basic page views, top pages
   - **Pro**: Advanced metrics, real user monitoring, Web Vitals
4. Click **Enable**

**7.2 Verify Analytics Installation**
- Vercel automatically injects analytics script into Next.js app
- No code changes required for basic setup
- Analytics data appears within 24 hours

**7.3 View Analytics Dashboard**
Available metrics:
- **Page Views**: Total visits per page
- **Top Pages**: Most visited routes
- **Visitors**: Unique visitors over time
- **Web Vitals**: LCP, FID, CLS scores
- **Geography**: Visitor locations
- **Devices**: Desktop vs Mobile breakdown

**7.4 (Optional) Add Custom Events**
If you want to track custom events (e.g., "Download App Click"), add to `apps/web/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

Then track events:
```typescript
import { track } from '@vercel/analytics';

<button onClick={() => track('download_app_click', { platform: 'android' })}>
  Download for Android
</button>
```

---

### Phase 8: GitHub Integration & Preview Comments

**8.1 Connect GitHub Repository**
1. Go to Vercel Dashboard → Settings → Git
2. Click **Connect Git Repository**
3. Select GitHub and authorize Vercel
4. Select repository: `shubh7shubh/web-admin-fitness`
5. Configure branch: `main` (production)

**8.2 Enable Preview Deployments**
1. In Vercel → Settings → Git
2. Enable **Automatic Deployments from Git**
3. Configure:
   - ✅ **Production Branch**: `main`
   - ✅ **Preview Deployments**: All branches (automatically creates preview for PRs)
   - ✅ **Deploy Hooks**: Optional (for manual triggers)

**8.3 Enable GitHub Preview Comments**
1. Go to Vercel Dashboard → Settings → Git → GitHub
2. Enable **Comments on Pull Requests**
3. Configure comment settings:
   - ✅ **Post deployment comments**: Show preview URL in PR comments
   - ✅ **Post deployment status**: Update PR status checks
   - ✅ **Show deployment details**: Include build logs link

**8.4 Configure GitHub Branch Protection (Recommended)**
To ensure preview deployments pass before merging:
1. Go to GitHub → Repository → Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass: Select "Vercel Deployment"
   - ✅ Require conversation resolution before merging
3. Save changes

**8.5 Test Preview Deployment Workflow**
1. Create test branch: `git checkout -b test/preview-deployment`
2. Make small change to `apps/web/app/page.tsx`
3. Commit and push:
   ```bash
   git add .
   git commit -m "test: preview deployment"
   git push origin test/preview-deployment
   ```
4. Create PR on GitHub
5. Vercel bot should comment with:
   - 🔍 **Preview URL** (e.g., `https://apexfit-web-git-test-preview-deployment-yourteam.vercel.app`)
   - 🚀 **Deployment Status** (Building → Ready)
   - 📊 **Lighthouse Scores** (Performance, Accessibility, etc.)
6. Click preview URL to test changes
7. Merge PR → auto-deploys to production (`apexfit.in`)

---

### Phase 9: Testing & Verification

**9.1 Test Automatic Deployments**

**Production Deployment Test**:
1. Make a small change to `apps/web/app/page.tsx`
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger production deployment"
   git push origin main
   ```
3. Check Vercel dashboard for deployment status
4. Verify deployment completes successfully
5. Visit `https://apexfit.in` to confirm changes

**Preview Deployment Test**:
1. Create a new feature branch:
   ```bash
   git checkout -b feature/test-deployment
   ```
2. Make a change to `apps/web/app/page.tsx`
3. Commit and push:
   ```bash
   git add .
   git commit -m "feat: test preview deployment"
   git push origin feature/test-deployment
   ```
4. Create PR to `main` branch on GitHub
5. Vercel automatically creates preview deployment
6. Check PR comments for preview URL from Vercel bot
7. Verify preview deployment works

**9.2 Verify Web App Functionality**
- [ ] Landing page loads correctly at `https://apexfit.in`
- [ ] Navigation works (Header, Footer)
- [ ] Blog pages load (`/blogs`, `/blogs/[slug]`)
- [ ] Authentication flow works (Google OAuth)
- [ ] Protected routes redirect properly (`/dashboard`)
- [ ] Public profiles accessible (`/profile/[username]`)
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design works

**9.3 Verify Custom Domain**
- [ ] `https://apexfit.in` resolves correctly
- [ ] SSL certificate is valid (green padlock in browser)
- [ ] `https://www.apexfit.in` redirects to `https://apexfit.in`
- [ ] OAuth callback works with custom domain
- [ ] Vercel subdomain redirects to `apexfit.in`

**9.4 Performance Check**
- [ ] Run Lighthouse audit (Chrome DevTools) on `https://apexfit.in`
- [ ] Target scores: Performance >90, SEO >90
- [ ] Check Core Web Vitals in Vercel Analytics dashboard
- [ ] Verify First Contentful Paint (FCP) < 1.8s
- [ ] Verify Largest Contentful Paint (LCP) < 2.5s

---

## Critical Files to Create/Modify

### 1. `/Users/apple/Documents/GitHub/fitness-web/vercel.json`
**Action**: Create new file
**Purpose**: Configure Vercel to deploy only `apps/web` directory
**Content**: JSON configuration with build settings, routes, and framework detection

### 2. Supabase Dashboard - Authentication Settings (Manual)
**Action**: Update redirect URLs
**Location**: Supabase Dashboard → Project → Authentication → URL Configuration
**Add URLs**:
- Site URL: `https://apexfit.in`
- Redirect URLs: Include localhost, production, and preview URLs

### 3. GoDaddy DNS Settings (Manual)
**Action**: Change nameservers to Vercel
**Location**: GoDaddy → Domains → apexfit.in → Manage DNS → Nameservers
**Set Nameservers**:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

### 4. Google Cloud Console OAuth Settings (Manual)
**Action**: Update authorized redirect URIs
**Location**: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID
**Add URI**: `https://apexfit.in/auth/callback`

### 5. Vercel Dashboard Configuration (Manual)
**Actions**:
- Link GitHub repository
- Set environment variables
- Add custom domain `apexfit.in`
- Enable Analytics
- Enable GitHub Preview Comments

---

## Post-Deployment Checklist

### Immediate Actions
- [ ] Verify production deployment is live at `https://apexfit.in`
- [ ] Test OAuth login flow on production
- [ ] Check all environment variables are set correctly in Vercel
- [ ] Verify custom domain SSL certificate (should show green padlock)
- [ ] Test preview deployments via PR

### SEO & Monitoring
- [ ] Submit sitemap to Google Search Console: `https://apexfit.in/sitemap.xml`
- [ ] Verify robots.txt is accessible: `https://apexfit.in/robots.txt`
- [ ] Check Vercel Analytics dashboard for initial traffic
- [ ] Monitor deployment logs in Vercel dashboard for any errors

### Documentation
- [ ] Update README with deployment instructions
- [ ] Document custom domain setup
- [ ] Add deployment status badge to README (optional)

### Security
- [ ] Verify admin panel is NOT publicly accessible
- [ ] Confirm Supabase RLS policies are active
- [ ] Test banned user cannot create posts

---

## Rollback Plan

If deployment fails or issues arise:

1. **Revert to Previous Deployment**:
   - Go to Vercel Dashboard → Deployments
   - Find last successful deployment
   - Click "Promote to Production"

2. **Emergency DNS Rollback**:
   - In GoDaddy, remove Vercel DNS records
   - Point to previous hosting (if applicable)

3. **Disable Automatic Deployments**:
   - Vercel Dashboard → Settings → Git
   - Disable auto-deploy temporarily
   - Fix issues locally before re-enabling

---

## Maintenance

### Regular Tasks
- **Weekly**: Check Vercel deployment logs for errors
- **Monthly**: Review Vercel Analytics for traffic patterns
- **Quarterly**: Update dependencies (`npm update`)
- **As Needed**: Adjust environment variables for new features

### Deployment Workflow
1. Develop feature in feature branch
2. Test locally (`npm run dev`)
3. Push branch and create PR
4. Review preview deployment
5. Merge PR to `main` → auto-deploy to production
6. Verify production deployment

---

## Expected Outcome

After completing this plan:

✅ **Web App**: Deployed to Vercel at `https://apexfit.in`
✅ **Auto-Deployments**: Enabled for `main` branch pushes and PRs
✅ **Custom Domain**: `apexfit.in` configured with SSL certificate from GoDaddy
✅ **Admin Panel**: Remains local-only at `http://localhost:3001` (maximum security)
✅ **OAuth**: Working with production URLs (`https://apexfit.in/auth/callback`)
✅ **Analytics**: Vercel Analytics enabled and tracking traffic
✅ **Preview Comments**: GitHub bot commenting with preview URLs on PRs
✅ **CI/CD**: Fully automated deployment pipeline

**Production URL**: `https://apexfit.in`
**WWW Redirect**: `https://www.apexfit.in` → `https://apexfit.in` (automatic)
**Preview Deployments**: Auto-generated for each PR (e.g., `https://apexfit-web-git-feature-branch.vercel.app`)
**Admin Access**: `http://localhost:3001` (local development only, never deployed)
