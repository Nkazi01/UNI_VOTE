# 📧 Supabase OTP Email Configuration Guide

## Overview

This guide will help you configure Supabase to send **real OTP emails** for the 2FA voting system.

---

## 🎯 Quick Summary

By default, Supabase uses their email service, but you can:
1. Use **Supabase's default SMTP** (easiest - free tier)
2. Configure **custom SMTP** (Gmail, SendGrid, etc.)
3. Use **custom email templates**

---

## 📋 Prerequisites

- ✅ Supabase project created
- ✅ Supabase project URL and Anon Key in `.env.local`
- ✅ Admin access to Supabase dashboard

---

## 🚀 Option 1: Use Supabase Default Email (Easiest)

Supabase includes **built-in email** service on all plans (including free tier).

### Step 1: Enable Email Auth

1. Go to **Supabase Dashboard** → https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** (left sidebar)
4. Click **Settings** tab
5. Scroll to **Auth Providers**
6. Ensure **Email** is **enabled** ✅

### Step 2: Configure Site URL

1. Still in **Authentication** → **Settings**
2. Find **Site URL** field
3. Set to your app URL:
   - **Development**: `http://localhost:5173`
   - **Production**: `https://yourdomain.com`
4. Click **Save**

### Step 3: Configure Redirect URLs (Optional)

1. Find **Redirect URLs** section
2. Add your app URLs:
   ```
   http://localhost:5173/**
   https://yourdomain.com/**
   ```
3. Click **Save**

### Step 4: Test Default Email

**That's it!** Supabase will now send emails using their default service.

**Limitations:**
- ⚠️ Default "from" address: `noreply@mail.app.supabase.io`
- ⚠️ May end up in spam folder
- ⚠️ Limited customization
- ✅ Works immediately
- ✅ No configuration needed
- ✅ Good for development

---

## 🔧 Option 2: Custom SMTP (Recommended for Production)

For better deliverability and custom "from" address, use custom SMTP.

### Popular SMTP Providers

1. **SendGrid** (12,000 free emails/month)
2. **Mailgun** (5,000 free emails/month)
3. **AWS SES** (Pay-as-you-go, very cheap)
4. **Gmail** (Free, 500 emails/day)
5. **Postmark** (100 free emails/month)

---

## 📧 Setup Guide: SendGrid (Recommended)

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com
2. Click **Start for Free**
3. Sign up (free tier: 100 emails/day forever)
4. Verify your email

### Step 2: Verify Sender Email

1. In SendGrid dashboard → **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - **From Name**: UniVote
   - **From Email**: noreply@yourdomain.com (or your email)
   - **Reply To**: support@yourdomain.com
4. Click **Create**
5. **Check your email** and verify

### Step 3: Create API Key

1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `UniVote OTP`
4. Permissions: **Full Access** (or Mail Send only)
5. Click **Create & View**
6. **Copy the API key** (you won't see it again!)

### Step 4: Configure in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **Project Settings** (gear icon, bottom left)
3. Click **Authentication**
4. Scroll to **SMTP Settings**
5. Click **Enable Custom SMTP**
6. Fill in SendGrid details:

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: <Your SendGrid API Key>
Sender email: noreply@yourdomain.com
Sender name: UniVote
```

7. Click **Save**

### Step 5: Test Email

Your OTP emails will now be sent via SendGrid! ✅

---

## 📧 Setup Guide: Gmail SMTP

**Note**: Gmail has daily limits (500 emails/day) - good for small testing.

### Step 1: Enable 2-Step Verification

1. Go to https://myaccount.google.com
2. Click **Security**
3. Enable **2-Step Verification**

### Step 2: Create App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** and **Other (Custom name)**
3. Name it: `UniVote`
4. Click **Generate**
5. **Copy the 16-character password**

### Step 3: Configure in Supabase

```
Host: smtp.gmail.com
Port: 587
Username: your.email@gmail.com
Password: <16-character app password>
Sender email: your.email@gmail.com
Sender name: UniVote
```

### Step 4: Save

Click **Save** in Supabase.

**Limitations:**
- ⚠️ 500 emails/day limit
- ⚠️ May be blocked for automated emails
- ✅ Free
- ✅ Easy setup
- ✅ Good for testing

---

## 🎨 Customize Email Templates

### Step 1: Access Email Templates

1. Go to **Supabase Dashboard** → Your Project
2. Click **Authentication** → **Email Templates**
3. You'll see templates for:
   - Confirm signup
   - **Magic Link** (Used for OTP)
   - Change email
   - Reset password

### Step 2: Edit Magic Link Template

The **Magic Link** template is used for OTP emails.

**Default Template:**
```html
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p><a href="{{ .ConfirmationURL }}">Log In</a></p>
```

**Custom OTP Template:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin-top: 20px; }
    .otp-code { font-size: 32px; font-weight: bold; text-align: center; 
                 letter-spacing: 10px; background: white; padding: 20px; 
                 margin: 20px 0; border-radius: 8px; border: 2px solid #6366f1; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗳️ UniVote Verification</h1>
    </div>
    <div class="content">
      <h2>Your Voting Verification Code</h2>
      <p>Hello!</p>
      <p>You requested to vote on <strong>{{ .Data.poll_title }}</strong>.</p>
      <p>Enter this verification code to complete your vote:</p>
      
      <div class="otp-code">{{ .Token }}</div>
      
      <p><strong>Important:</strong></p>
      <ul>
        <li>This code expires in <strong>5 minutes</strong></li>
        <li>Do not share this code with anyone</li>
        <li>Your vote is completely anonymous</li>
      </ul>
      
      <p>If you didn't request this code, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>Secure, Anonymous Voting with UniVote</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
```

### Step 3: Available Variables

You can use these in your template:
- `{{ .Token }}` - The OTP code
- `{{ .ConfirmationURL }}` - Magic link URL (if using links)
- `{{ .Data.poll_title }}` - Poll title (if you pass it)
- `{{ .Data.poll_id }}` - Poll ID (if you pass it)
- `{{ .Email }}` - User's email
- `{{ .SiteURL }}` - Your site URL

### Step 4: Save Template

1. Paste your custom HTML
2. Click **Save**
3. Test by voting!

---

## 🧪 Testing Email Configuration

### Test 1: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Invite User**
3. Enter your test email
4. Check if email arrives

### Test 2: Via Your App

1. Login to your app
2. Go to an active poll
3. Start voting process
4. Proceed to Step 3 (2FA)
5. Check your email for OTP code

### Check Email Arrival

✅ **Inbox** - Perfect!
⚠️ **Spam folder** - Update sender authentication
❌ **Not received** - Check SMTP settings

---

## 🐛 Troubleshooting

### Emails Go to Spam

**Solutions:**
1. **Verify sender domain** (SPF, DKIM records)
2. Use **custom SMTP** instead of default
3. **Warm up** your sending domain gradually
4. Add proper **email headers**

**For SendGrid:**
1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow DNS record instructions
4. Wait for DNS propagation (24-48 hours)

### Emails Not Sending

**Check:**
1. ✅ SMTP settings are correct
2. ✅ API key is valid
3. ✅ Sender email is verified
4. ✅ Port 587 is not blocked
5. ✅ Check Supabase logs (Settings → Logs)

**Common Issues:**
- Wrong API key format
- Port blocked by firewall
- Unverified sender email
- Daily limit reached

### "Invalid API Key" Error

**Solution:**
- For SendGrid: Username must be exactly `apikey`
- Password is the actual API key
- No extra spaces in password field

### Gmail "Less Secure Apps" Error

**Solution:**
- Use App Password, not regular password
- Enable 2-Step Verification first
- Generate app-specific password

### Rate Limiting

**Solutions:**
- Upgrade SendGrid plan
- Use AWS SES (no limits, pay-per-email)
- Implement email queue

---

## 📊 Production Best Practices

### 1. Domain Authentication

For best deliverability:
- ✅ Use **custom domain** (not @gmail.com)
- ✅ Set up **SPF record**
- ✅ Set up **DKIM record**
- ✅ Set up **DMARC record**

### 2. Email Content

- ✅ Clear subject line: "Your UniVote Verification Code"
- ✅ Prominent OTP code display
- ✅ Expiration warning
- ✅ Security reminder (don't share)
- ✅ Unsubscribe link (not needed for transactional)

### 3. Monitoring

- ✅ Track delivery rates
- ✅ Monitor spam complaints
- ✅ Check bounce rates
- ✅ Set up alerts for failures

### 4. Scalability

**Free Tier Limits:**
- SendGrid: 100 emails/day
- Gmail: 500 emails/day
- Mailgun: 5,000 emails/month

**For Large Elections:**
- Upgrade to paid plan
- Use AWS SES (cheapest for volume)
- Implement email queue

---

## 💰 Cost Comparison

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **SendGrid** | 100/day forever | $15/mo (40k/mo) | Medium volume |
| **Mailgun** | 5,000/mo | $35/mo (50k/mo) | High volume |
| **AWS SES** | 0 free | $0.10 per 1k | Highest volume |
| **Gmail** | 500/day | N/A | Testing only |
| **Postmark** | 100/mo | $10/mo (10k/mo) | Transactional |

---

## ✅ Recommended Setup

### For Development/Testing
```
Provider: Supabase Default or Gmail
Cost: Free
Setup Time: 5 minutes
Deliverability: Fair
```

### For Small-Medium Elections (< 1000 voters)
```
Provider: SendGrid Free Tier
Cost: Free (100 emails/day)
Setup Time: 15 minutes
Deliverability: Excellent
```

### For Large Elections (1000+ voters)
```
Provider: SendGrid or AWS SES
Cost: ~$15-50/month
Setup Time: 30 minutes
Deliverability: Excellent
Features: Analytics, webhooks
```

---

## 🔗 Quick Links

### Supabase Resources
- [Supabase SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

### SMTP Provider Signup
- [SendGrid](https://signup.sendgrid.com)
- [Mailgun](https://signup.mailgun.com)
- [AWS SES](https://aws.amazon.com/ses/)
- [Postmark](https://postmarkapp.com)

### Testing Tools
- [Mail-Tester](https://www.mail-tester.com) - Test spam score
- [MXToolbox](https://mxtoolbox.com) - Check DNS records

---

## 🎉 Summary

### Quickest Setup (5 minutes)
1. ✅ Use Supabase default email
2. ✅ No configuration needed
3. ✅ Works for testing

### Best Setup (20 minutes)
1. ✅ Sign up for SendGrid
2. ✅ Verify sender email
3. ✅ Create API key
4. ✅ Configure in Supabase
5. ✅ Customize email template

**Your OTP emails will be professional and reliable!** 📧✨

---

## 📞 Need Help?

**Common Questions:**
- Q: Do I need a custom domain?
  - A: No, you can use any email for sender
  
- Q: How many emails can I send?
  - A: SendGrid free = 100/day, paid = unlimited
  
- Q: Will it work without SMTP?
  - A: Yes, Supabase default works (may go to spam)
  
- Q: How do I test?
  - A: Vote in your app and check email!

---

**Ready to send professional OTP emails!** 🚀📧




