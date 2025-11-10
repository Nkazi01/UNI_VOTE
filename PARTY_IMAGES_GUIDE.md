# 🎨 SRC Party Ballot with Images - Feature Guide

## ✅ What's New

Your SRC election ballots now support beautiful images for:
- **Party Logo** - Display the party's official logo
- **President Candidate Photo** - Show the presidential candidate's photo
- **Deputy President Candidate Photo** - Show the deputy presidential candidate's photo

## 📸 How to Add Images When Creating a Poll

1. **Go to Admin → Create Poll**
2. **Select "Party (SRC)" as the poll type**
3. **For each party, you'll now see fields for:**
   - Party Name (required)
   - **Party Logo URL** (optional)
   - President Candidate Name (required)
   - **President Photo URL** (optional)
   - Deputy President Candidate Name (required)
   - **Deputy President Photo URL** (optional)

4. **Image URLs:**
   - You can use any publicly accessible image URL
   - Supported formats: JPG, PNG, GIF, WebP
   - **Example URLs you can use for testing:**
     - `https://i.pravatar.cc/150?img=1` (random avatar)
     - `https://picsum.photos/200` (random image)
     - Or upload images to Imgur, Google Drive (public), etc.

5. **Preview:**
   - As you paste URLs, you'll see live previews
   - If an image fails to load, a placeholder will show instead
   - All images are optional - the ballot works without them too!

## 🎨 Design Features

### Party Cards Now Display:
- **Large party logo** (or icon if no logo provided)
- **Circular candidate photos** (64x64px) with borders
- **Two-column layout** on larger screens (president and deputy side-by-side)
- **Hover effects** for better UX
- **Selected state** with blue ring and highlight
- **Fallback icons** (👤) for missing photos

### Responsive Design:
- Desktop: Side-by-side candidate display
- Mobile: Stacked vertical layout
- All images are optimized and rounded

## 🖼️ Image Recommendations

### Party Logo:
- **Recommended size:** 128x128px or larger
- **Format:** PNG with transparent background (best)
- **Aspect ratio:** Square (1:1)

### Candidate Photos:
- **Recommended size:** 200x200px or larger
- **Format:** JPG or PNG
- **Aspect ratio:** Square (1:1) - will be displayed as circle
- **Framing:** Head and shoulders portrait

## 🔒 Security Note

- Images are loaded from URLs you provide
- No file uploads to your database (keeps it lightweight)
- If image URL is broken/deleted, a placeholder shows
- All images respect dark mode themes

## 🚀 Quick Test

Want to test it quickly? Use these sample URLs:

```
Party Logo: https://api.dicebear.com/7.x/shapes/svg?seed=party1
President Photo: https://i.pravatar.cc/150?img=12
Deputy Photo: https://i.pravatar.cc/150?img=43
```

## 💡 Pro Tips

1. **Use Imgur** for free image hosting: imgur.com
2. **Optimize images** before uploading (use tinypng.com)
3. **Test URLs** in browser before pasting (make sure they're public)
4. **Consistent sizing** looks best - use same dimensions for all photos
5. **Professional photos** create better voter confidence

## 🎯 Next Steps (Optional Enhancements)

If you want to add actual file upload functionality later:
1. Set up Supabase Storage buckets
2. Add file upload UI components
3. Upload images to Supabase and get URLs automatically

For now, the URL-based approach keeps things simple and fast!

---

**Enjoy your enhanced SRC elections! 🗳️**

