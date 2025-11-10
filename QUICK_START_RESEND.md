# Quick Start: Resend OTP Setup

Follow these steps to get your production OTP system working in 15 minutes.

## ⚡ Quick Steps

### 1. Get Resend API Key (2 minutes)

1. Go to https://resend.com and sign up
2. Go to **API Keys** → **Create API Key**
3. Name it: `UniVote Production`
4. Copy the key (starts with `re_`)

### 2. Add API Key to Environment (1 minute)

**For Local Development:**

Edit `supabase/.env.local` and replace `re_your_api_key_here` with your actual key:

```bash
RESEND_API_KEY=re_abc123def456...
```

**For Production:**

```bash
supabase secrets set RESEND_API_KEY=re_abc123def456...
```

### 3. Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

### 4. Link Your Supabase Project

```bash
# Login
supabase login

# Link project (get your PROJECT_REF from Supabase Dashboard → Settings → General)
supabase link --project-ref YOUR_PROJECT_REF
```

### 5. Deploy the Edge Function (2 minutes)

```bash
# Deploy to production
supabase functions deploy send-otp-email

# Verify deployment
supabase functions list
```

You should see:
```
send-otp-email ✓ deployed
```

### 6. Test It! (5 minutes)

1. **Start your React app:**
   ```bash
   npm run dev
   ```

2. **Try to vote on a poll**

3. **Check your email** - you should receive a beautiful email with a 6-digit code!

4. **Enter the code** and complete your vote ✅

---

## 🔍 Troubleshooting

### "Failed to send email"

Check the Edge Function logs:
```bash
supabase functions logs send-otp-email --tail
```

### Email not received

1. Check spam folder
2. Verify your API key is correct:
   ```bash
   supabase secrets list
   ```
3. Make sure you're using a valid email address

### "CORS error"

The Edge Function already has CORS headers. Make sure:
- Your Supabase URL is correct in `.env`
- You deployed the function: `supabase functions deploy send-otp-email`

---

## 📧 What Users Will Receive

Beautiful, professional emails that look like this:

```
From: UniVote <onboarding@resend.dev>
Subject: Verify Your Vote - Code Inside

🗳️ UniVote

Verify Your Vote

You're voting on: Student Council Election

Enter this verification code to confirm your vote:

┌───────────────────┐
│   8 7 9 8 4 9    │  (purple gradient box)
└───────────────────┘

⏱️ This code expires in 5 minutes

⚠️ Security Note: Never share this code with anyone.
```

---

## 🚀 Going to Production

### For Custom Domain Emails

Instead of `onboarding@resend.dev`, use your own domain:

1. Go to Resend Dashboard → **Domains** → **Add Domain**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records they provide
4. Wait for verification (5-15 minutes)
5. Update `supabase/functions/send-otp-email/index.ts`:
   ```typescript
   from: 'UniVote <vote@yourdomain.com>'  // Instead of onboarding@resend.dev
   ```
6. Redeploy:
   ```bash
   supabase functions deploy send-otp-email
   ```

---

## 🎉 You're Done!

Your production OTP system is now live! Users will receive professional emails with verification codes.

**Need more help?** See `RESEND_OTP_SETUP.md` for the complete guide.

