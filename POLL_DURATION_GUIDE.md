# 📅 Poll Duration Configuration Guide

## Overview

Admins can now fully configure when polls start and end, giving complete control over election timing.

---

## ✨ New Features

### 1. **Custom Start & End Date/Time**
- Set exact start date and time for the poll
- Set exact end date and time for the poll
- Polls can be scheduled to start in the future
- Real-time duration calculator shows total poll length

### 2. **Quick Duration Presets**
Convenient one-click buttons for common durations:
- ⚡ **1 Day** - Quick polls or surveys
- 📊 **3 Days** - Standard voting period
- 🗳️ **1 Week** (7 days) - Default SRC elections
- 📆 **2 Weeks** - Extended voting periods

### 3. **Smart Validation**
- ✅ End time must be after start time
- ✅ Start time cannot be in the past (1-minute tolerance)
- ✅ Clear error messages for invalid configurations

---

## 🎯 How to Use

### Creating a New Poll

1. **Navigate to Create Poll**
   - Admin Dashboard → "Create New Poll"
   - Or: `/admin/create`

2. **Enter Basic Info**
   - Title, description, poll type

3. **Configure Duration** ⏰
   
   **Option A: Use Quick Presets**
   - Click one of the preset buttons (1 Day, 3 Days, 1 Week, 2 Weeks)
   - Automatically sets start to now and end to future

   **Option B: Manual Configuration**
   - **Start Date & Time**: Select when voting begins
   - **End Date & Time**: Select when voting closes
   - See live duration calculation below the inputs

4. **Duration Display**
   - Blue info box shows: "📊 Poll will run for X days Y hours"
   - Updates automatically as you change dates

5. **Complete Poll Setup**
   - Add options/parties as usual
   - Submit to create

---

## 📋 Example Scenarios

### Scenario 1: SRC Elections (1 Week)
```
Start: Monday, Nov 11, 2025 @ 08:00 AM
End:   Monday, Nov 18, 2025 @ 05:00 PM
Duration: 7 days 9 hours
```
**Use**: Click "1 Week" preset, then adjust times manually

### Scenario 2: Quick Class Survey (1 Day)
```
Start: Today @ 09:00 AM
End:   Tomorrow @ 09:00 AM
Duration: 1 day
```
**Use**: Click "1 Day" preset

### Scenario 3: Department Election (2 Weeks)
```
Start: Nov 15, 2025 @ 00:00 (midnight)
End:   Nov 29, 2025 @ 23:59 (11:59 PM)
Duration: 14 days
```
**Use**: Click "2 Weeks" preset, then adjust times

### Scenario 4: Scheduled Future Poll
```
Start: Dec 1, 2025 @ 08:00 AM (Future date)
End:   Dec 8, 2025 @ 05:00 PM
Duration: 7 days 9 hours
```
**Use**: Manually set future start date

---

## ⚠️ Important Notes

### Poll Status
- **Active**: Current time is between start and end
- **Scheduled**: Start time is in the future
- **Closed**: End time has passed

### Voting Rules
- Voters can only vote during **active** period
- Polls show as "Active" or "Closed" based on current time
- Results are visible based on admin settings (publish button)

### Time Zone
- All times are in your **local browser timezone**
- Database stores in UTC (universal time)
- Times display correctly for all users worldwide

### Editing Duration
- Currently, duration can only be set at creation
- To change duration: Use admin "Close Poll" button to end early
- Future update may add duration editing for unpublished polls

---

## 🎨 UI Elements

### Poll Creation Form

```
⏰ Poll Duration
┌─────────────────────────────────────────────────┐
│ Start Date & Time     End Date & Time           │
│ [Nov 11, 2025 08:00] [Nov 18, 2025 17:00]      │
└─────────────────────────────────────────────────┘

📊 Poll will run for 7 days 9h

Quick presets: [1 Day] [3 Days] [1 Week] [2 Weeks]
```

### Validation Errors

**❌ End time must be after start time**
- Shown when end ≤ start

**❌ Start time cannot be in the past**
- Shown when start < now (with 1-minute tolerance)

---

## 🔧 Technical Details

### Default Behavior
If you don't change anything:
- **Start**: Current date/time (now)
- **End**: 7 days in the future
- **Duration**: 1 week

### Date Format
- Browser-native `datetime-local` input
- Format: `YYYY-MM-DDTHH:mm`
- Example: `2025-11-15T14:30`

### Storage
- Stored in database as ISO 8601 strings
- Example: `2025-11-15T14:30:00.000Z`

---

## 💡 Best Practices

### For SRC Elections
- ✅ Use **1 Week** or **2 Weeks** duration
- ✅ Start on a Monday morning (8 AM)
- ✅ End on a Monday evening (5 PM)
- ✅ Allow enough time for all students to vote

### For Quick Surveys
- ✅ Use **1 Day** or **3 Days**
- ✅ Consider class schedules
- ✅ Don't end on weekends for urgent polls

### For Department Polls
- ✅ Use **1 Week** minimum
- ✅ Avoid exam periods
- ✅ Consider holidays and breaks

### Scheduling Future Polls
- ✅ Schedule in advance for planned elections
- ✅ Announce poll timing to students beforehand
- ✅ Use consistent timing (e.g., always 8 AM - 5 PM)

---

## 🐛 Troubleshooting

### "Start time cannot be in the past"
**Solution**: Select current or future date/time

### "End time must be after start time"
**Solution**: Make sure end is later than start

### Duration shows negative or weird numbers
**Solution**: Check that end > start, refresh page if needed

### Preset buttons not working
**Solution**: Check console for errors, ensure JavaScript is enabled

---

## 🎉 Summary

Admins now have complete control over poll timing:
- ⏰ Set exact start/end times
- ⚡ Use quick presets for common durations
- 📊 See live duration calculations
- ✅ Smart validation prevents mistakes

**Perfect for flexible election management!** 🗳️✨

