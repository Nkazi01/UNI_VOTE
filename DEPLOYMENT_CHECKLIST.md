# ✅ Pre-Deployment Checklist

Use this checklist before deploying to ensure everything is ready!

---

## 🔧 Local Development

### Code Quality
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No console errors when running locally
- [ ] All features tested and working
- [ ] Mobile responsive design verified
- [ ] Dark mode working correctly

### Features Testing
- [ ] **Registration** - New users can create accounts
- [ ] **Login** - Users can login successfully
- [ ] **Email verification** - Toast messages appear
- [ ] **Poll listing** - Polls display on home page
- [ ] **Poll creation** (Admin) - Can create new polls
- [ ] **Image upload** - Party/candidate images upload
- [ ] **Voting** - Users can cast votes
- [ ] **Results** - Results display correctly
- [ ] **Admin dashboard** - Admin features work
- [ ] **Profile page** - User profile loads
- [ ] **Logout** - Users can logout

---

## 🗄️ Supabase Configuration

### Database
- [ ] All tables created (polls, votes, invites)
- [ ] RLS policies configured
- [ ] Indexes created
- [ ] Test data added (optional)

### Authentication
- [ ] Email/password authentication enabled
- [ ] Email confirmation setting configured
- [ ] User metadata set up correctly
- [ ] Role-based access working

### Storage
- [ ] `poll-images` bucket created
- [ ] Bucket set to **public**
- [ ] Storage policies created (4 policies)
- [ ] Test image uploaded successfully

### Security
- [ ] RLS enabled on all tables
- [ ] Admin role function created
- [ ] Invite system configured
- [ ] Rate limiting considered

---

## 🔐 Environment Variables

### Local (.env.local)
- [ ] `VITE_SUPABASE_URL` set
- [ ] `VITE_SUPABASE_ANON_KEY` set
- [ ] Values tested and working
- [ ] File is in `.gitignore`

### Deployment
- [ ] Supabase URL copied
- [ ] Supabase ANON key copied
- [ ] Ready to paste into Vercel/GitHub

---

## 📦 Git & GitHub

### Repository Setup
- [ ] Git initialized (`git init`)
- [ ] All files staged (`git add .`)
- [ ] First commit made (`git commit -m "Initial commit"`)
- [ ] GitHub repository created
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed (`git push -u origin main`)

### Files to Verify
- [ ] `.gitignore` includes `.env*`
- [ ] `.gitignore` includes `node_modules`
- [ ] `.gitignore` includes `dist`
- [ ] No sensitive data in repo
- [ ] `package.json` has correct scripts
- [ ] `README.md` exists (optional but recommended)

---

## 🚀 Deployment Platform

### For Vercel
- [ ] Vercel account created
- [ ] GitHub account connected
- [ ] Repository imported
- [ ] Build settings verified (Vite preset)
- [ ] Environment variables added:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Variables added to Production environment
- [ ] Variables added to Preview environment
- [ ] First deployment triggered

### For GitHub Pages (if using)
- [ ] `vite.config.ts` updated with base path
- [ ] GitHub Actions workflow created
- [ ] Repository secrets added
- [ ] GitHub Pages enabled
- [ ] `basename` added to BrowserRouter

---

## 🔗 Post-Deployment

### Supabase URL Update
- [ ] Deployment URL obtained
- [ ] Supabase Dashboard → Authentication → URL Configuration
- [ ] **Site URL** updated to deployment URL
- [ ] **Redirect URLs** updated to `https://your-app.vercel.app/**`

### Testing on Live Site
- [ ] App loads without errors
- [ ] Registration flow works
- [ ] Login flow works
- [ ] Email verification works (if enabled)
- [ ] Poll creation works
- [ ] Image upload works
- [ ] Voting works
- [ ] Results display correctly
- [ ] Mobile view works
- [ ] Dark mode works

### Performance Check
- [ ] Page loads quickly (< 3 seconds)
- [ ] Images load properly
- [ ] No broken links
- [ ] No console errors in production
- [ ] Network requests succeed

---

## 📢 Launch Preparation

### Documentation
- [ ] User guide created (optional)
- [ ] Admin guide created (optional)
- [ ] Login instructions prepared
- [ ] Support email/contact set up

### Communication
- [ ] Announcement email drafted
- [ ] URL to share ready
- [ ] Instructions for students prepared
- [ ] Support plan in place

### Monitoring
- [ ] Deployment URL bookmarked
- [ ] Vercel/GitHub dashboard accessible
- [ ] Analytics set up (optional)
- [ ] Error monitoring configured (optional)

---

## ⚡ Quick Test Script

After deployment, run through this quick 5-minute test:

1. **Open deployment URL** ✅
2. **Register new test account** ✅
3. **Check email for verification** ✅
4. **Login with test account** ✅
5. **View polls list** ✅
6. **Cast a vote** ✅
7. **View results** ✅
8. **Logout** ✅
9. **Login as admin** ✅
10. **Create new poll with images** ✅

**If all pass → You're ready to launch!** 🎉

---

## 🆘 Common Issues & Solutions

### Build Fails
- ✅ Check TypeScript errors locally
- ✅ Verify environment variables
- ✅ Check build logs for details
- ✅ Run `npm run build` locally first

### Features Don't Work on Live Site
- ✅ Verify environment variables in platform
- ✅ Check browser console for errors
- ✅ Verify Supabase URLs updated
- ✅ Check network tab for failed requests

### Images Don't Upload
- ✅ Check Storage policies in Supabase
- ✅ Verify bucket is public
- ✅ Check browser console for errors
- ✅ Verify auth token is being used

### Routes Give 404
- ✅ Check `vercel.json` rewrites
- ✅ Verify React Router basename
- ✅ Check deployment platform settings

---

## 📊 Success Metrics

Your deployment is successful when:

### Functionality
- ✅ All features work on live site
- ✅ No console errors
- ✅ No broken pages
- ✅ Fast loading times

### Security
- ✅ HTTPS enabled
- ✅ Environment variables not exposed
- ✅ RLS policies working
- ✅ Authentication secure

### Performance
- ✅ < 3 second initial load
- ✅ Images load quickly
- ✅ Smooth navigation
- ✅ Mobile responsive

### User Experience
- ✅ Registration flow clear
- ✅ Login process smooth
- ✅ Voting intuitive
- ✅ Admin features accessible

---

## 🎯 Final Steps

Before launching to students:

1. **Test with a small group** (5-10 people)
2. **Gather feedback**
3. **Fix any issues found**
4. **Test again**
5. **Launch to everyone!** 🚀

---

## 📝 Launch Day Checklist

- [ ] Deployment verified working
- [ ] Admin accounts created
- [ ] Test polls created (or real polls ready)
- [ ] Announcement sent
- [ ] URL shared
- [ ] Support channel ready
- [ ] Monitoring active
- [ ] Backup plan in place

---

**Print this checklist and check items as you complete them!**

**Good luck with your deployment!** 🎉

