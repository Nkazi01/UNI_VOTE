# 🗳️ UniVote

**Secure, anonymous voting platform for universities**

Built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

---

## ✨ Features

- 🔐 **Secure Authentication** - Email/password with optional 2FA
- 🗳️ **Multiple Poll Types** - Single choice, multiple choice, party/SRC elections
- 📊 **Real-time Results** - Live vote counting and visualization
- 📸 **Image Support** - Upload party logos and candidate photos
- 🌙 **Dark Mode** - Beautiful UI with dark theme support
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 👨‍💼 **Admin Dashboard** - Create and manage polls
- 🔒 **Anonymous Voting** - Votes are not linked to users
- ⏰ **Scheduled Polls** - Set start and end dates
- 📧 **Email Verification** - Optional email confirmation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/univote.git
cd univote

# Install dependencies
npm install

# Create environment file
cp .env.local.template .env.local

# Add your Supabase credentials to .env.local
# Get them from https://supabase.com/dashboard
```

### Development

```bash
# Start development server
npm run dev

# App runs at http://localhost:5173
```

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 📚 Documentation

- **[Deployment Guide](DEPLOYMENT_QUICK_START.md)** - Deploy to Vercel or GitHub Pages
- **[Vercel Deployment](DEPLOY_TO_VERCEL.md)** - Step-by-step Vercel setup (recommended)
- **[GitHub Pages Deployment](DEPLOY_TO_GITHUB_PAGES.md)** - GitHub Pages setup
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[Supabase Setup](SUPABASE_STORAGE_SETUP.md)** - Configure Supabase Storage
- **[Image Upload Guide](IMAGE_UPLOAD_TROUBLESHOOTING.md)** - Fix image upload issues
- **[Email Verification](EMAIL_VERIFICATION_GUIDE.md)** - Email verification UX
- **[Registration UX](REGISTRATION_UX_IMPROVEMENTS.md)** - Registration improvements

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Row Level Security
  - Real-time subscriptions

---

## 📁 Project Structure

```
univote/
├── src/
│   ├── api/              # API client functions
│   ├── components/       # React components
│   │   └── ui/          # UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── routes/          # Route protection
│   ├── screens/         # Page components
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── public/              # Static assets
├── supabase/            # Supabase functions
└── docs/                # Documentation
```

---

## 🔐 Environment Variables

Required environment variables in `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard.

---

## 🗄️ Database Schema

### Tables
- **polls** - Poll information and options
- **votes** - Anonymous vote records
- **invites** - User invitation system

### Security
- Row Level Security (RLS) enabled on all tables
- Admin-only access for poll creation
- Public read access for published polls
- Authenticated users can vote

---

## 🎨 Features in Detail

### For Students
- View all active polls
- Cast votes anonymously
- View real-time results
- Dark mode support
- Mobile-friendly interface

### For Administrators
- Create and manage polls
- Upload party logos and candidate photos
- Set poll schedules
- View detailed analytics
- Manage user invitations

---

## 🚀 Deployment

### Recommended: Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

**See [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for detailed instructions.**

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Poll creation (admin)
- [ ] Image upload
- [ ] Casting votes
- [ ] Viewing results
- [ ] Mobile responsiveness
- [ ] Dark mode

---

## 🔧 Configuration

### Supabase Setup Required

1. Create project on Supabase
2. Run database migration (`supabase_migration.sql`)
3. Create storage bucket (`poll-images`)
4. Set up storage policies
5. Configure authentication settings
6. Update URL configurations after deployment

See [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md) for details.

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🐛 Known Issues & Solutions

### Image Uploads Not Working
- Ensure you're logged in
- Check Supabase Storage policies
- Verify storage bucket is public
- See [IMAGE_UPLOAD_TROUBLESHOOTING.md](IMAGE_UPLOAD_TROUBLESHOOTING.md)

### Routes Give 404
- Check React Router basename configuration
- Verify deployment platform settings

### Email Verification Issues
- Configure email templates in Supabase
- Update redirect URLs in Supabase settings

---

## 🤝 Contributing

This is a university project. If you'd like to use it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use for your university!

---

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Open an issue on GitHub
- **Questions**: Contact the development team

---

## 🎓 Built for Universities

UniVote is designed specifically for university elections and polls:
- Student Representative Council elections
- Faculty polls
- Campus surveys
- Event voting
- Budget allocation polls

---

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Vercel** - Hosting platform
- **Tailwind CSS** - UI framework
- **React Community** - Amazing ecosystem

---

## 📊 Stats

- 🎨 **Modern UI** with dark mode
- 📱 **Fully responsive** design
- 🔐 **Secure** with RLS and authentication
- ⚡ **Fast** with Vite and React 18
- 🌍 **Production ready** with TypeScript

---

## 🚀 Get Started

1. **Read [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md)**
2. **Follow [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md)**
3. **Use [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)**

**Your voting platform will be live in 15 minutes!** 🎉

---

Made with ❤️ for universities

