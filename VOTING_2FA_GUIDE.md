# 🔐 Two-Factor Authentication (2FA) for Voting

## Overview

UniVote now requires **Two-Factor Authentication (2FA)** for all votes to ensure:
- ✅ **Security** - Only verified users can vote
- ✅ **Integrity** - Prevents unauthorized voting
- ✅ **Accountability** - Confirms voter identity
- ✅ **Anonymity** - Vote remains anonymous after verification

---

## 🎯 How It Works

### Voting Flow with 2FA

```
Step 1: Select Choice
   ↓
Step 2: Review Selection
   ↓
Step 3: 2FA Verification ← NEW! OTP sent to email
   ↓
Step 4: Submit Vote
   ↓
Complete ✅
```

---

## 📧 For Voters

### Voting Process

1. **Login to UniVote**
   - Use your registered email and password

2. **Navigate to Active Poll**
   - View active polls on homepage or polls page
   - Click "View Details" on the poll you want to vote on

3. **Step 1: Make Your Selection**
   - Select your choice(s)
   - For party votes: Select one party
   - For single choice: Select one option
   - For multiple choice: Select one or more options
   - Click "Next"

4. **Step 2: Review Your Selection**
   - Verify your choices are correct
   - Remember: Your vote is anonymous
   - Click "Confirm" to proceed

5. **Step 3: 2FA Verification** 🔐
   - **OTP is automatically sent** to your email
   - Check your email for a **6-digit code**
   - **Demo Mode**: Code appears in toast notification (top-right)
   - Enter the 6-digit code
   - Code expires in **5 minutes**
   - Click "Verify"

6. **Step 4: Submit Vote**
   - Final confirmation
   - Click "Submit" to cast your vote
   - Vote is recorded anonymously ✅

---

## 🔑 OTP (One-Time Password) Details

### What is OTP?
A **6-digit code** sent to your email that you must enter to verify your identity before voting.

### OTP Features
- ⏱️ **5-minute expiration** - Use code quickly
- 🔄 **Resend option** - Request new code if needed
- 🔒 **One-time use** - Code becomes invalid after use
- 📧 **Email delivery** - Sent to your registered email
- 🎯 **Poll-specific** - Code only valid for specific poll

### Demo Mode
In demo/testing mode:
- OTP appears in **toast notification** (top-right corner)
- Shows for **30 seconds**
- No real email sent
- Perfect for testing!

### Production Mode
When Supabase email is configured:
- OTP sent via **real email**
- Check inbox (and spam folder)
- Email subject: "Your UniVote Verification Code"
- Contains 6-digit code

---

## 🎨 User Interface

### Step 3: Two-Factor Verification Screen

```
┌─────────────────────────────────────────┐
│  Two-Factor Authentication              │
│  Enter the 6-digit code we sent to      │
│  your email. For demo, check the toast. │
│                                          │
│  ┌───┬───┬───┬───┬───┬───┐             │
│  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │  ← OTP Input│
│  └───┴───┴───┴───┴───┴───┘             │
│                                          │
│  Expires in 04:32     [Resend code]     │
│                                          │
│  ████████████░░░░░░░░░░░  (Timer bar)  │
│  [          Verify          ]           │
│                                          │
│  Your vote and identity are kept        │
│  separate to ensure anonymous voting.   │
└─────────────────────────────────────────┘
```

### Demo Mode Toast

```
🔵 Demo Mode: OTP Code
Your verification code is: 123456
```

---

## ⚙️ Technical Implementation

### Components

1. **`otpApi.ts`** - OTP API
   - `sendVoteOTP()` - Send OTP to email
   - `verifyVoteOTP()` - Verify code
   - `cleanupExpiredOTPs()` - Cleanup expired codes

2. **`VoteFlowScreen.tsx`** - Voting flow
   - Sends OTP on reaching step 3
   - Handles verification
   - Handles resend

3. **`TwoFactorChallenge.tsx`** - UI component
   - 6-digit OTP input
   - Timer display
   - Resend button with cooldown
   - Progress bar

### OTP Storage

**Demo/Fallback Mode:**
- Stored in **memory** (`Map<string, OTPData>`)
- Expires in 5 minutes
- Automatically cleaned up

**Production Mode:**
- Uses **Supabase Auth OTP**
- Stored in Supabase database
- Email sent via Supabase email service

### Security Features

1. **Time-Limited**
   - 5-minute expiration
   - Visible countdown timer

2. **Single-Use**
   - Code deleted after successful verification
   - Cannot reuse same code

3. **Poll-Specific**
   - Code tied to specific poll ID
   - Prevents cross-poll usage

4. **Rate Limiting**
   - 30-second cooldown between resends
   - Prevents spam

5. **Anonymous Voting**
   - OTP verifies identity
   - Vote stored separately
   - No link between voter and vote

---

## 🔧 Configuration

### For Demo/Testing (Current Setup)

No configuration needed! Works out of the box:
- OTP codes shown in toast
- Stored in memory
- Perfect for development

### For Production (Email Sending)

To enable real email sending:

1. **Configure Supabase Email** (Already done if using Supabase Auth)
   - Email templates configured in Supabase dashboard
   - SMTP settings configured

2. **No Code Changes Needed!**
   - System automatically uses Supabase OTP
   - Falls back to demo mode if email fails

3. **Custom Email Template** (Optional)
   - Go to Supabase Dashboard → Authentication → Email Templates
   - Edit "Magic Link" template
   - Customize subject and body

Example email template:
```
Subject: Your UniVote Verification Code

Hi,

Your verification code for voting on "{{.PollTitle}}" is:

{{.Token}}

This code will expire in 5 minutes.

Vote securely and anonymously with UniVote!
```

---

## 🐛 Troubleshooting

### "No OTP found. Please request a new code."
**Cause**: Code expired or not generated
**Solution**: Click "Resend code"

### "OTP has expired. Please request a new code."
**Cause**: More than 5 minutes passed
**Solution**: Click "Resend code" to get new code

### "Invalid code. Please check and try again."
**Cause**: Wrong code entered
**Solution**: 
- Check email for correct code
- In demo mode, check toast notification
- Try "Resend code" if needed

### "OTP is for a different poll."
**Cause**: Using code from different poll
**Solution**: Request new code for current poll

### Can't find OTP email
**Solutions**:
- Check **spam folder**
- Wait 30 seconds and click **Resend code**
- In demo mode, code appears in **toast notification**
- Verify email address is correct in profile

### Resend button disabled
**Cause**: 30-second cooldown active
**Solution**: Wait for countdown to finish

---

## 📊 Statistics & Monitoring

### Admin View
Admins can see:
- Total votes submitted
- No individual vote details (anonymous)
- Poll results after closing

### What Admins DON'T See
- ❌ Who voted for whom
- ❌ Individual OTP codes
- ❌ Voter identity linked to votes

---

## 🎯 Best Practices

### For Voters
✅ **Check email before starting** - Ensure you can receive emails
✅ **Complete voting quickly** - OTP expires in 5 minutes
✅ **Keep code private** - Don't share your OTP
✅ **One device at a time** - Complete voting on one device

### For Admins
✅ **Test 2FA before elections** - Verify email sending works
✅ **Announce 2FA requirement** - Tell voters to check email
✅ **Provide support** - Help voters with OTP issues
✅ **Monitor email delivery** - Check Supabase email logs

---

## 🚀 Advantages

### Security
- 🔐 Prevents unauthorized voting
- 🎯 Confirms voter identity
- 🔒 Protects election integrity

### User Experience
- 📱 Familiar OTP flow
- ⏱️ Quick verification (< 1 minute)
- 🔄 Easy resend option
- 👁️ Visual timer and progress

### Anonymity
- 🔏 Vote and identity stored separately
- 🔐 No traceability after verification
- ✅ Complete voter privacy

---

## 📈 Future Enhancements

Potential improvements:
- 📱 SMS OTP option
- 🔔 Push notifications
- 🌐 Multi-language support
- 📊 OTP analytics dashboard
- ⚡ Faster email delivery

---

## 🎉 Summary

**2FA for voting is now active!** Every vote requires:
1. ✅ Login authentication
2. ✅ **OTP email verification** ← NEW!
3. ✅ Final vote submission

**Result**: Secure, verified, and anonymous voting! 🗳️🔐

---

## 📞 Support

### For Voters
If you have issues with 2FA:
1. Check spam folder for OTP email
2. Try resend code button
3. Contact admin if problem persists

### For Admins
Technical issues:
1. Check Supabase email configuration
2. Verify SMTP settings
3. Check browser console for errors
4. System automatically falls back to demo mode

---

## 🔗 Related Documentation

- `prevent_duplicate_votes.sql` - One vote per user
- `POLL_DURATION_GUIDE.md` - Poll timing
- `HOW_TO_MANAGE_POLLS.md` - Admin controls
- `PARTY_IMAGES_GUIDE.md` - SRC election setup

---

**Secure voting with 2FA is now live!** 🎉🔐✨

