# 🚀 Deploy UniVote to Vercel (RECOMMENDED)

## ⚡ Why Vercel?
- ✅ **Easiest deployment** - 5 minutes setup
- ✅ **Free tier** - Perfect for university projects
- ✅ **Auto SSL** - Free HTTPS certificates
- ✅ **Fast global CDN**
- ✅ **Environment variables** - Easy to configure
- ✅ **Auto-deploys** - Push to GitHub = auto deploy
- ✅ **Preview URLs** - Every PR gets a preview URL

---

## 📋 Prerequisites

1. **GitHub account** - Create at https://github.com
2. **Vercel account** - Sign up at https://vercel.com (use GitHub to login)
3. **Your code in GitHub** - Follow Part 1 below

---

## Part 1: Push Your Code to GitHub

### Step 1: Initialize Git (if not already done)

```bash
cd C:\Users\Admin\Desktop\univote
git init
git add .
git commit -m "Initial commit - UniVote ready for deployment"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `univote`
3. Description: "Secure university voting system"
4. **Keep it Private** (for now)
5. Click **Create repository**

### Step 3: Push to GitHub

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/univote.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## Part 2: Deploy to Vercel

### Step 1: Import Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `univote` repository
5. Click **"Import"**

### Step 2: Configure Build Settings

Vercel should auto-detect these settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

✅ **Don't change these** - they're correct!

### Step 3: Add Environment Variables

Before clicking "Deploy", add your Supabase credentials:

1. Click **"Environment Variables"**
2. Add these variables:

```
VITE_SUPABASE_URL
Value: https://jkxnrbjasajvphewvamq.supabase.co

VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreG5yYmphc2FqdnBoZXd2YW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjUzNjksImV4cCI6MjA3Nzc0MTM2OX0.Q1sBMenJ_SXHLhIIKXDGGP_Wn4fwbNqcHiCuFIluTAc
```

**Important:** 
- Add them to **Production**, **Preview**, and **Development** environments
- Click the checkboxes for all three

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see "🎉 Congratulations!" when done

---

## 🎯 Your App is Live!

You'll get a URL like:
```
https://univote-xyz123.vercel.app
```

**Share this URL with your university students!**

---

## 🔧 Post-Deployment Setup

### Update Supabase URLs

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

### Test Your Deployment

Visit your Vercel URL and test:
- ✅ Registration works
- ✅ Login works
- ✅ Poll creation works (admin)
- ✅ Voting works
- ✅ Image uploads work

---

## 🔄 Future Updates

Every time you push to GitHub, Vercel auto-deploys!

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys! 🚀
```

---

## 📊 Monitor Your App

1. Go to https://vercel.com/dashboard
2. Click on your `univote` project
3. See:
   - **Deployments** - All your deploys
   - **Analytics** - Visitor stats (free tier: 100K requests/month)
   - **Logs** - Runtime logs
   - **Settings** - Environment variables, domains

---

## 🌐 Custom Domain (Optional)

Want `vote.youruniversity.edu` instead of `univote-xyz.vercel.app`?

1. Go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS setup instructions
4. Free SSL included!

---

## 🆘 Troubleshooting

### Build Fails?

**Check the build logs:**
1. Go to your deployment
2. Click **"Building"** tab
3. Look for error messages

**Common fixes:**
- Missing environment variables
- TypeScript errors (fix locally first)
- Missing dependencies

### App Loads But Features Don't Work?

**Check environment variables:**
1. Settings → Environment Variables
2. Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Redeploy: Deployments → ⋮ → Redeploy

### Images Not Uploading?

1. Check Supabase Storage policies (see SUPABASE_STORAGE_SETUP.md)
2. Verify Supabase URL is whitelisted in CORS settings

---

## 💰 Pricing

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 100 GB-hours compute/month
- ✅ SSL certificates
- ✅ Preview deployments
- ✅ Unlimited team members

**Perfect for a university project!** 🎓

---

## 🎓 Quick Reference

### Useful Commands

```bash
# Push changes and auto-deploy
git add .
git commit -m "Update feature"
git push

# View logs
vercel logs

# Pull environment variables locally
vercel env pull
```

### Useful Links

- **Your Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Support**: https://vercel.com/support

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Supabase URLs updated with Vercel URL
- [ ] Registration tested on live site
- [ ] Login tested on live site
- [ ] Voting tested on live site
- [ ] Share URL with users! 🎉

---

**Estimated time: 10 minutes** ⏱️

**Need help?** Check the Troubleshooting section or Vercel docs!

