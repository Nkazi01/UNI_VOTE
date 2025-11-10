# 🚀 Deploy UniVote to GitHub Pages (Alternative)

## ⚠️ Important Note

**GitHub Pages is NOT recommended for this app** because:
- ❌ No native support for environment variables (Supabase credentials)
- ❌ Must commit `.env` to repo (security risk) OR use build-time injection
- ❌ Only supports static sites (no server-side features)
- ❌ Requires extra configuration for React Router

**We recommend Vercel instead** (see DEPLOY_TO_VERCEL.md)

**However, if you must use GitHub Pages, here's how:**

---

## 📋 Prerequisites

1. **GitHub account**
2. **Repository on GitHub** with your code
3. **Public repository** (GitHub Pages free tier requires public repos)

---

## Part 1: Configure for GitHub Pages

### Step 1: Update Vite Config

Create/update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/univote/', // Replace 'univote' with your repo name
  server: {
    port: 5173
  },
  // Inline environment variables at build time
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  }
})
```

### Step 2: Update package.json

Add deployment script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 4: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Part 2: Configure Repository Secrets

### Step 1: Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

**Secret 1:**
```
Name: VITE_SUPABASE_URL
Value: https://jkxnrbjasajvphewvamq.supabase.co
```

**Secret 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreG5yYmphc2FqdnBoZXd2YW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjUzNjksImV4cCI6MjA3Nzc0MTM2OX0.Q1sBMenJ_SXHLhIIKXDGGP_Wn4fwbNqcHiCuFIluTAc
```

---

## Part 3: Enable GitHub Pages

### Step 1: Configure Pages

1. Go to **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Click **Save**

### Step 2: Deploy

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push
```

The GitHub Action will automatically build and deploy!

---

## 🎯 Your App Will Be Live At:

```
https://YOUR-USERNAME.github.io/univote/
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## 🔧 Update React Router

Since your app is at `/univote/` instead of `/`, update routing:

**src/main.tsx:**

```typescript
<BrowserRouter basename="/univote">
  <App />
</BrowserRouter>
```

---

## ⚠️ Known Issues with GitHub Pages

### Issue 1: 404 on Refresh

**Problem:** Refreshing any route gives 404

**Solution:** Add `404.html` that redirects to `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/'">
  </head>
  <body></body>
</html>
```

Add to `public/404.html`

### Issue 2: Environment Variables Visible

**Problem:** Build-time variables are visible in JavaScript

**Risk:** Supabase ANON key is public (but this is okay - it's meant to be public)

**Mitigation:** Use Row Level Security (RLS) in Supabase (already configured)

### Issue 3: No HTTPS by Default

**Problem:** GitHub Pages uses `http://` for some custom domains

**Solution:** 
- Use the default `.github.io` domain (has HTTPS)
- OR configure custom domain with HTTPS

---

## 🔄 Future Updates

Push to GitHub = Auto deploy:

```bash
git add .
git commit -m "Update feature"
git push
```

Check deployment status:
1. Go to your repo
2. Click **Actions** tab
3. See deployment progress

---

## 📊 Monitor Deployments

1. **Actions** tab - See build/deploy status
2. **Deployments** - See live deployments
3. **Settings → Pages** - See current URL

---

## 🆘 Troubleshooting

### Build Fails?

**Check Actions logs:**
1. Go to **Actions** tab
2. Click on failed workflow
3. Expand failed step
4. Read error message

**Common fixes:**
- Secrets not set correctly
- Missing dependencies in package.json
- TypeScript errors

### Routes Don't Work?

**Check basename:**
- Make sure `basename="/univote"` in BrowserRouter
- Make sure `base: '/univote/'` in vite.config.ts

### Images Not Loading?

**Check paths:**
- Use relative paths
- Check browser console for 404s
- Verify image paths include `/univote/` prefix

---

## 💰 Pricing

**FREE** for public repositories! 

**Limits:**
- 1 GB published site
- 100 GB bandwidth/month
- 10 builds/hour

---

## ❌ Why We Don't Recommend GitHub Pages

1. **Environment variables** - Must be baked into build (less secure)
2. **No server** - Can't use server-side features later
3. **Public repo required** - Your code must be public for free tier
4. **Routing issues** - SPA routing requires workarounds
5. **No preview deploys** - Can't preview PRs easily

**Use Vercel instead** - It's free, easier, and more powerful!

---

## ✅ Deployment Checklist

- [ ] vite.config.ts updated with base path
- [ ] GitHub Actions workflow created
- [ ] Repository secrets added
- [ ] GitHub Pages enabled
- [ ] basename added to BrowserRouter
- [ ] 404.html created
- [ ] Code pushed to GitHub
- [ ] Deployment workflow succeeded
- [ ] App accessible at github.io URL
- [ ] All features tested

---

**Estimated time: 20-30 minutes** ⏱️

**Again, we strongly recommend Vercel** - it's easier and better for React apps!

