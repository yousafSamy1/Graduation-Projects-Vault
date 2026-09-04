# GradVault - مكتبة مشاريع التخرج

> **GradVault** is an AI-powered graduation projects library — search through past projects or compare your idea with existing ones using OpenAI Embeddings.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- [Supabase](https://supabase.com) account (free tier works)
- [OpenAI](https://platform.openai.com) API key

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Library
npm install
```

### 2. Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
ADMIN_EMAIL=admin@example.com
```

### 3. Supabase Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and run the contents of `supabase/schema.sql`
4. Go to **Storage** and create a bucket named `project-pdfs` with public access
5. Go to **Authentication > Users** and create an admin user (email/password)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js              # Root layout
│   ├── page.js                # Landing page
│   ├── globals.css            # Design system
│   ├── search/page.js         # Search projects
│   ├── compare/page.js        # AI comparison
│   ├── project/[id]/page.js   # Project details
│   ├── admin/
│   │   ├── page.js            # Admin login
│   │   └── dashboard/
│   │       ├── page.js        # Admin dashboard
│   │       └── add/page.js    # Add project
│   └── api/
│       ├── search/route.js    # Search API
│       ├── compare/route.js   # AI compare API
│       ├── projects/route.js  # CRUD API
│       ├── upload-pdf/route.js# PDF upload
│       ├── stats/route.js     # Statistics
│       └── auth/route.js      # Authentication
├── components/
│   ├── Navbar.js
│   ├── SearchBar.js
│   ├── ProjectCard.js
│   ├── SimilarityResult.js
│   ├── FileUpload.js
│   └── Footer.js
└── lib/
    ├── supabase.js            # Supabase clients
    ├── openai.js              # OpenAI + PDF parsing
    └── search.js              # Search utilities
```

## 🎨 Features

- **🔍 Smart Search** — Search in Arabic & English, filter by department/year
- **🤖 AI Comparison** — Upload PDF or paste abstract to find similar projects
- **📊 Admin Dashboard** — Add, manage, and delete projects
- **🎨 Modern Design** — Glassmorphism dark theme with smooth animations
- **📱 Responsive** — Works on mobile, tablet, and desktop
- **🌐 RTL Support** — Full Arabic language support

## 🏫 Departments

| Code | Name |
|------|------|
| MIS | Management Information Systems |
| BA | Business Analysis |
| Fintech | Financial Technology |
| Marketing Intelligence | Marketing Intelligence |

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📄 License

MIT
