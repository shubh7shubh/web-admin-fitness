# FitnessApp Web & Admin Panel

Web application and admin panel for the FitnessApp mobile app.

## Structure

```
fitness-web/
├── apps/
│   ├── web/                    # Public web app (Next.js)
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── (auth)/login/   # Login page
│   │   │   ├── (app)/dashboard/# User dashboard
│   │   │   ├── blogs/          # Blog system
│   │   │   ├── profile/        # Public profiles
│   │   │   ├── sitemap.ts      # SEO sitemap
│   │   │   └── robots.ts       # SEO robots.txt
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── marketing/      # Landing page components
│   │   └── lib/                # Supabase clients, query utils
│   │
│   └── admin/                  # Admin panel (localhost only)
│       ├── app/
│       │   ├── dashboard/      # Analytics overview
│       │   ├── challenges/     # Challenge management
│       │   ├── users/          # User management
│       │   └── content/blogs/  # Blog CMS
│       └── components/
│           └── layout/         # Sidebar navigation
│
├── shared/                     # Shared code
│   ├── utils/                  # goalCalculator
│   ├── types/                  # TypeScript types
│   └── constants/              # Theme
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
# Web app
cd apps/web
npm install

# Admin panel
cd ../admin
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` in both apps:

**Web App** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://oswlhrzarxjpyocgxgbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Admin Panel** (`apps/admin/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://oswlhrzarxjpyocgxgbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup (Required)

Run this migration in your FitnessApp Supabase project to add the blog_articles table:

```bash
cd /Users/apple/Documents/GitHub/FitnessApp
npx supabase migration new add_blog_articles_table
```

Add this SQL to the generated migration file:

```sql
CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  read_time INTEGER,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_articles_slug ON public.blog_articles(slug);
CREATE INDEX idx_blog_articles_published ON public.blog_articles(published) WHERE published = TRUE;

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.blog_articles FOR SELECT
  USING (published = TRUE);

CREATE POLICY "Admins can manage articles"
  ON public.blog_articles FOR ALL
  USING (EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));
```

Apply the migration:
```bash
npx supabase db push
```

### 4. Run Development Servers

```bash
# Web app (port 3000)
cd apps/web
npm run dev

# Admin panel (port 3001)
cd apps/admin
npm run dev -- -p 3001
```

### 5. Set Up Admin User

In Supabase Dashboard SQL Editor:
```sql
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'your-admin-email@example.com';
```

## Features

### Web App
- **Landing Page**: Hero section, features, CTAs, SEO optimized
- **Blog System**: SEO-friendly articles with categories and tags
- **Authentication**: Google OAuth (shared with mobile app)
- **Dashboard**: Read-only nutrition and weight overview
- **Public Profiles**: Shareable user profiles (/profile/username)

### Admin Panel (localhost only)
- **Dashboard**: User metrics, posts, challenges overview
- **Challenge Management**: Create, edit, activate/deactivate challenges
- **User Management**: Search, view details, ban/unban, adjust points
- **Blog CMS**: Create, edit, publish blog articles

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI Library | shadcn/ui + Tailwind CSS |
| Charts | Tremor (admin only) |
| Database | Supabase PostgreSQL (shared with mobile app) |
| Auth | Supabase Auth (Google OAuth) |
| Data Fetching | TanStack Query |
| Deployment | Vercel (web) + Localhost (admin) |

## Deployment

### Deploy Web App to Vercel

```bash
cd apps/web
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Admin Panel

The admin panel runs **locally only** for security. Do not deploy to public hosting.

## Related

- **Mobile App**: `/Users/apple/Documents/GitHub/FitnessApp/`
- **Implementation Guide**: `FitnessApp/docs/WEB_ADMIN_PANEL.md`
