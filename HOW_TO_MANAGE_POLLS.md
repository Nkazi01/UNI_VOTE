# 📋 How to Manage & Close Polls - Complete Guide

## 🎯 Quick Answer: How to Close a Poll

### Option 1: Automatic Closing ⏰
Polls **automatically close** when their scheduled end time (`endsAt`) passes.
- No action needed
- Voting stops automatically
- Results become available for viewing

### Option 2: Manual Closing (Early) 🔒
**As an Admin**, you can close a poll early:

1. Go to **Polls** page
2. Click on the poll you want to close
3. Scroll down to **"Admin Controls"**
4. Click **"🔒 Close Poll Now"**
5. Confirm the action

**What happens:**
- Voting ends immediately
- Poll status changes to "Closed"
- Voters can no longer submit votes
- Results are ready to be published

---

## 📊 Poll Management Workflow

### Step 1: Create a Poll
- Go to **Admin Dashboard** → **Create Poll**
- Fill in details, add options/parties
- Set start and end dates
- Submit

### Step 2: While Poll is Active ✅
**Voters can:**
- View the poll
- Cast their votes
- See poll details

**Admins can:**
- View live vote counts (unpublished results)
- Close poll early if needed
- Delete poll if there's a mistake

### Step 3: After Poll Closes 🔒
**Automatically happens when:**
- Current time passes the `endsAt` date/time
- Or admin clicks "Close Poll Now"

**What voters see:**
- "Poll Closed" message
- Cannot vote anymore
- "Results not yet available" (until published)

**What admins see:**
- "📢 Publish Results" button
- Vote tallies
- Delete option

### Step 4: Publish Results 📢
**As Admin:**
1. Go to the closed poll
2. Review the results
3. Click **"📢 Publish Results"**
4. Results become visible to everyone

**What happens:**
- All voters can now see results
- Results page shows vote counts
- Charts and statistics are displayed

---

## 🛠️ Admin Control Panel Features

When you view a poll as an admin, you'll see an **"Admin Controls"** section with:

### While Poll is Active:
- **🔒 Close Poll Now** - Ends voting immediately
- **🗑️ Delete Poll** - Removes the poll completely

### After Poll Closes:
- **📢 Publish Results** - Makes results visible to voters
- **🗑️ Delete Poll** - Removes the poll completely

---

## 📱 Where to Find Poll Management

### From Admin Dashboard:
1. Login as admin
2. Go to **Admin** page (from navigation)
3. See all polls listed
4. Click any poll to manage it

### From Polls Page:
1. Go to **Polls** tab
2. Click on any poll
3. If you're an admin, you'll see admin controls

### Direct Links:
- Admin Dashboard: `/admin`
- Create Poll: `/admin/create`
- Poll Details: `/polls/{poll-id}`
- Results: `/results?poll={poll-id}`

---

## ⚙️ Poll States & Statuses

### 1. **Active** ✅
- Current time is between `startsAt` and `endsAt`
- Voters can cast votes
- Results are hidden from voters
- Admin can close early or delete

### 2. **Closed** 🔒
- Current time is past `endsAt`
- Or admin closed it manually
- Voting is disabled
- Results are still hidden until published
- Admin can publish results or delete

### 3. **Published** 📢
- Poll is closed
- Results are visible to everyone
- Results update in real-time if votes are still being tallied
- Admin can still delete

---

## 🎛️ API Functions (For Reference)

```typescript
// Close a poll (set endsAt to now)
await closePoll(pollId)

// Publish results (make visible to voters)
await setPollPublished(pollId, true)

// Delete a poll permanently
await deletePoll(pollId)
```

---

## 💡 Best Practices

### ✅ DO:
- **Review results** before publishing them
- **Close polls on time** (or let them close automatically)
- **Publish results promptly** after verification
- **Test with small polls** first before major elections
- **Keep poll descriptions clear** about closing time

### ❌ DON'T:
- Don't delete polls that have votes (unless absolutely necessary)
- Don't publish results before poll closes
- Don't close polls too early without warning voters
- Don't reuse poll IDs (system prevents this anyway)

---

## 🔧 Troubleshooting

### "I can't find the Close Poll button"
- Make sure you're logged in as **admin**
- The poll must be **active** (not already closed)
- Check if you're on the poll detail page

### "Publish Results button doesn't appear"
- Poll must be **closed** first
- Make sure you're an **admin**
- Results may already be published

### "Poll won't close"
- Check your internet connection
- Make sure you confirmed the action
- Try refreshing the page
- Check console for errors (F12)

---

## 📞 Quick Reference

| Action | When Available | Location |
|--------|---------------|----------|
| Create Poll | Anytime | Admin Dashboard |
| Close Poll Early | While active | Poll Detail (Admin) |
| Publish Results | After closed | Poll Detail (Admin) |
| Delete Poll | Anytime | Poll Detail (Admin) |
| View Results | After published | Results Page |

---

**Happy Poll Management! 🎉**

For more help, check the console logs (F12) or contact your system administrator.

