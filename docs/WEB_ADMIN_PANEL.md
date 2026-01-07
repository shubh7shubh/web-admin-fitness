# Web App + Admin Panel - Phased Implementation Guide
**Last Updated**: January 2, 2026
**Expo App Location**: `/Users/apple/Documents/GitHub/FitnessApp/`
**Web/Admin Location**: `/Users/apple/Documents/GitHub/fitness-web/`
**Build Strategy**: Web App First → Admin Panel Second
**Code Sharing**: Copy for now, Monorepo migration later

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Summary](#architecture-summary)
3. [Phase 1: Project Setup](#phase-1-project-setup)
4. [Phase 2: Web App - Landing Page & SEO](#phase-2-web-app---landing-page--seo)
5. [Phase 3: Web App - Authentication](#phase-3-web-app---authentication)
6. [Phase 4: Web App - Blog System](#phase-4-web-app---blog-system)
7. [Phase 5: Web App - Limited Dashboard](#phase-5-web-app---limited-dashboard)
8. [Phase 6: Web App - Public Profiles](#phase-6-web-app---public-profiles)
9. [Phase 7: Admin Panel - Infrastructure](#phase-7-admin-panel---infrastructure)
10. [Phase 8: Admin Panel - Content Management](#phase-8-admin-panel---content-management)
11. [Phase 9: Admin Panel - User Management](#phase-9-admin-panel---user-management)
12. [Phase 10: Admin Panel - Analytics Dashboard](#phase-10-admin-panel---analytics-dashboard)
13. [Phase 11: SEO & Performance Optimization](#phase-11-seo--performance-optimization)
14. [Phase 12: Final Testing & Deployment](#phase-12-final-testing--deployment)
15. [Manual End-to-End Testing Checklist](#manual-end-to-end-testing-checklist)

---

## Overview

### What We're Building

**Web App** (`/Users/apple/Documents/GitHub/fitness-web/apps/web/`):
- Public-facing website for user acquisition and SEO
- Landing page with hero section and download CTAs
- Blog system for organic traffic
- Public user profiles (shareable links like `yourapp.com/profile/username`)
- Limited dashboard (read-only nutrition, weight charts, feed browsing)
- Authentication (Google OAuth, same as Expo app)
- **Purpose**: Drive downloads, improve SEO, provide web access to basic features

**Admin Panel** (`/Users/apple/Documents/GitHub/fitness-web/apps/admin/`):
- Localhost-only content management system
- Challenges management (create, edit, activate/deactivate)
- User management (view, search, ban/unban, adjust points)
- Analytics dashboard (users, engagement, revenue metrics)
- Blog CMS (create, edit, publish articles)
- **Purpose**: Simplify content management, no SQL required

### Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | SSR/SSG for SEO, file-based routing |
| UI Library | shadcn/ui + Tailwind CSS | Copy-paste components, accessible, dark mode |
| Database | Supabase PostgreSQL | Shared with Expo app, same RPC functions |
| Authentication | Supabase Auth | Shared auth system, Google OAuth |
| Data Fetching | TanStack Query | Same patterns as Expo app |
| Deployment | Vercel (web) + Localhost (admin) | Zero-config, global CDN, no hosting costs for admin |
| Analytics UI | Tremor (admin only) | Beautiful pre-built analytics charts |

### Repository Structure

```
/Users/apple/Documents/GitHub/
├── FitnessApp/                    # Expo mobile app (existing)
│   ├── app/
│   ├── modules/
│   ├── supabase/
│   └── ...
│
└── fitness-web/                   # New web/admin repo
    ├── apps/
    │   ├── web/                   # Public web app
    │   │   ├── app/               # Next.js App Router
    │   │   │   ├── (marketing)/  # Landing, about, pricing
    │   │   │   ├── (auth)/        # Login, signup, callback
    │   │   │   ├── (app)/         # Dashboard, feed, profile
    │   │   │   ├── blogs/         # Blog index & articles
    │   │   │   ├── api/           # API routes
    │   │   │   ├── layout.tsx     # Root layout
    │   │   │   ├── sitemap.ts     # Sitemap generation
    │   │   │   └── robots.ts      # robots.txt
    │   │   ├── components/
    │   │   │   ├── ui/            # shadcn/ui components
    │   │   │   ├── marketing/     # Landing page components
    │   │   │   └── dashboard/     # Dashboard components
    │   │   ├── lib/
    │   │   │   ├── supabase-browser.ts
    │   │   │   ├── supabase-server.ts
    │   │   │   ├── queryClient.ts
    │   │   │   ├── queryKeys.ts
    │   │   │   └── utils.ts
    │   │   ├── public/
    │   │   ├── middleware.ts      # Auth middleware
    │   │   ├── next.config.js
    │   │   ├── tailwind.config.ts
    │   │   └── package.json
    │   │
    │   └── admin/                 # Admin panel
    │       ├── app/
    │       │   ├── login/
    │       │   ├── dashboard/     # Analytics overview
    │       │   ├── challenges/    # Manage challenges
    │       │   ├── users/         # User management
    │       │   ├── content/       # Blog CMS
    │       │   ├── layout.tsx     # Admin layout with sidebar
    │       │   └── unauthorized/
    │       ├── components/
    │       │   ├── ui/            # shadcn/ui
    │       │   ├── analytics/     # Tremor charts
    │       │   └── forms/
    │       ├── lib/
    │       │   ├── supabase.ts
    │       │   └── utils.ts
    │       ├── middleware.ts      # Admin auth guard
    │       ├── next.config.js
    │       └── package.json
    │
    ├── shared/                    # Shared code (copied from Expo)
    │   ├── utils/
    │   │   └── goalCalculator.ts  # Business logic
    │   ├── types/
    │   │   ├── user.ts
    │   │   ├── diary.ts
    │   │   └── index.ts
    │   └── constants/
    │       └── theme.ts
    │
    ├── package.json               # Workspace root
    ├── turbo.json                 # Turborepo config (optional)
    └── README.md
```

### Shared Backend Strategy

**IMPORTANT**: Both Web and Admin apps use the **SAME Supabase instance** as the Expo app:
- Same database tables (profiles, posts, foods, diary_entries, etc.)
- Same RPC functions (get_posts, toggle_like, award_points, etc.)
- Same RLS policies
- **New Admin RPC Functions** will be added via migration in Expo app's `supabase/migrations/` folder

---

## Phase 1: Project Setup

**Goal**: Create new repository structure and basic Next.js apps
**Duration**: 2-3 hours
**Prerequisites**: Node.js 18+, npm

### Checklist

#### 1.1 Create Repository Structure
- [ ] Create directory: `mkdir -p /Users/apple/Documents/GitHub/fitness-web`
- [ ] Navigate: `cd /Users/apple/Documents/GitHub/fitness-web`
- [ ] Initialize: `npm init -y`
- [ ] Create directories:
  ```bash
  mkdir -p apps/web apps/admin shared/utils shared/types shared/constants
  ```
- [ ] Initialize Git:
  ```bash
  git init
  echo "node_modules/" > .gitignore
  echo ".next/" >> .gitignore
  echo ".env*" >> .gitignore
  echo "!.env.example" >> .gitignore
  ```

#### 1.2 Set Up Web App (Next.js)
- [ ] Create web app:
  ```bash
  cd apps
  npx create-next-app@latest web --typescript --tailwind --app --src-dir=false --import-alias="@/*"
  ```
  - Use App Router: Yes
  - TypeScript: Yes
  - Tailwind CSS: Yes
  - `src/` directory: No
  - Import alias: @/*

- [ ] Install dependencies:
  ```bash
  cd web
  npm install @supabase/ssr @supabase/supabase-js @tanstack/react-query zod
  ```

- [ ] Install shadcn/ui:
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input textarea select dialog table
  ```

#### 1.3 Set Up Admin Panel (Next.js)
- [ ] Create admin app:
  ```bash
  cd ../
  npx create-next-app@latest admin --typescript --tailwind --app --src-dir=false --import-alias="@/*"
  ```

- [ ] Install dependencies:
  ```bash
  cd admin
  npm install @supabase/ssr @supabase/supabase-js @tanstack/react-query zod @tremor/react
  ```

- [ ] Install shadcn/ui:
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input textarea select dialog table
  ```

#### 1.4 Copy Shared Code from Expo App
- [ ] Copy goalCalculator:
  ```bash
  cp /Users/apple/Documents/GitHub/FitnessApp/modules/onboarding/services/goalCalculator.ts \
     /Users/apple/Documents/GitHub/fitness-web/shared/utils/
  ```

- [ ] Create shared types (copy from Expo app):
  - [ ] `shared/types/user.ts` (from Expo app stores/useUserStore.ts)
  - [ ] `shared/types/diary.ts` (from Expo app modules/diary/)
  - [ ] `shared/types/post.ts` (from Expo app modules/feeds/)
  - [ ] `shared/types/index.ts` (export all)

- [ ] Create shared constants:
  ```bash
  cp /Users/apple/Documents/GitHub/FitnessApp/constants/theme.ts \
     /Users/apple/Documents/GitHub/fitness-web/shared/constants/
  ```

#### 1.5 Configure Environment Variables

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

- [ ] Copy `.env.local` from Expo app: `/Users/apple/Documents/GitHub/FitnessApp/.env`
- [ ] Create `.env.example` files in both apps (without actual keys)

#### 1.6 Verify Setup
- [ ] Test web app:
  ```bash
  cd apps/web
  npm run dev
  ```
  - [ ] Open http://localhost:3000 - should see Next.js default page

- [ ] Test admin panel:
  ```bash
  cd apps/admin
  npm run dev -- -p 3001
  ```
  - [ ] Open http://localhost:3001 - should see Next.js default page

**Phase 1 Complete** ✅

---

## Phase 2: Web App - Landing Page & SEO

**Goal**: Build SEO-optimized landing page with hero section
**Duration**: 4-6 hours
**Key Files**: `apps/web/app/page.tsx`, `apps/web/app/layout.tsx`

### Checklist

#### 2.1 Set Up Root Layout
- [ ] Create `apps/web/app/layout.tsx`:
  ```typescript
  import type { Metadata } from 'next';
  import { Inter } from 'next/font/google';
  import './globals.css';

  const inter = Inter({ subsets: ['latin'] });

  export const metadata: Metadata = {
    title: 'FitnessApp - Track Nutrition, Join Challenges, Get Fit',
    description: 'Gamified fitness tracking app with social features.',
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }
  ```

#### 2.2 Create Landing Page (Hero Section)
- [ ] Create `apps/web/app/page.tsx` with:
  - [ ] Hero section with headline
  - [ ] Value proposition (3-4 bullet points)
  - [ ] Download CTA buttons (Android + iOS)
  - [ ] Features showcase section
  - [ ] Social proof section (placeholder stats)
  - [ ] Final CTA section

#### 2.3 Add SEO Metadata
- [ ] Update `apps/web/app/page.tsx` metadata:
  - [ ] `title` - descriptive title with keywords
  - [ ] `description` - 150-160 characters
  - [ ] `keywords` - fitness tracker, calorie counter, etc.
  - [ ] `openGraph` - og:title, og:description, og:image (placeholder)
  - [ ] `twitter` - card, title, description, image
  - [ ] `robots` - index: true, follow: true

#### 2.4 Create Navigation Header
- [ ] Create `apps/web/components/marketing/Header.tsx`:
  - [ ] Logo (placeholder)
  - [ ] Navigation links (Home, About, Blog, Login)
  - [ ] Mobile responsive menu

#### 2.5 Create Footer
- [ ] Create `apps/web/components/marketing/Footer.tsx`:
  - [ ] Company info
  - [ ] Quick links (About, Privacy, Terms)
  - [ ] Social media links (placeholders)

#### 2.6 Add Structured Data (JSON-LD)
- [ ] Add to `apps/web/app/page.tsx`:
  ```typescript
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        name: 'FitnessApp',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }),
    }}
  />
  ```

#### 2.7 Create Placeholder Images
- [ ] Create `apps/web/public/images/`:
  - [ ] `hero-screenshot.png` (placeholder or actual screenshot)
  - [ ] `og-image.png` (1200x630 for social sharing)
  - [ ] `logo.png` (app logo)

#### 2.8 Verify Landing Page
- [ ] Run `npm run dev` in `apps/web/`
- [ ] Check http://localhost:3000
  - [ ] Hero section displays correctly
  - [ ] CTA buttons visible
  - [ ] Features section readable
  - [ ] Mobile responsive (test with DevTools)
  - [ ] No console errors

**Phase 2 Complete** ✅

---

## Phase 3: Web App - Authentication

**Goal**: Implement Google OAuth authentication (same as Expo app)
**Duration**: 3-4 hours
**Key Files**: `apps/web/lib/supabase-*.ts`, `apps/web/app/(auth)/`

### Checklist

#### 3.1 Set Up Supabase Clients
- [ ] Create `apps/web/lib/supabase-browser.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr';

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```

- [ ] Create `apps/web/lib/supabase-server.ts`:
  ```typescript
  import { createServerClient, type CookieOptions } from '@supabase/ssr';
  import { cookies } from 'next/headers';

  export function createClient() {
    const cookieStore = cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Server component cannot set cookies
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Server component cannot remove cookies
            }
          },
        },
      }
    );
  }
  ```

#### 3.2 Create Login Page
- [ ] Create `apps/web/app/(auth)/login/page.tsx`:
  - [ ] Google OAuth button (primary)
  - [ ] Email/password form (optional)
  - [ ] "Sign up" link
  - [ ] Error handling

- [ ] Implement Google OAuth flow:
  ```typescript
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };
  ```

#### 3.3 Create OAuth Callback Handler
- [ ] Create `apps/web/app/auth/callback/route.ts`:
  ```typescript
  import { createClient } from '@/lib/supabase-server';
  import { NextResponse } from 'next/server';

  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      const supabase = createClient();
      await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  ```

#### 3.4 Create Middleware for Protected Routes
- [ ] Create `apps/web/middleware.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr';
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }

  export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
  };
  ```

#### 3.5 Create Signup Page (Optional)
- [ ] Create `apps/web/app/(auth)/signup/page.tsx`:
  - [ ] Similar to login page
  - [ ] Redirect to onboarding (or dashboard)

#### 3.6 Verify Authentication
- [ ] Test login flow:
  - [ ] Navigate to http://localhost:3000/login
  - [ ] Click "Sign in with Google"
  - [ ] Should redirect to Google OAuth consent screen
  - [ ] After consent, should redirect to /dashboard
  - [ ] Session should persist on page refresh

- [ ] Test protected routes:
  - [ ] Try accessing /dashboard without login → redirects to /login
  - [ ] After login, can access /dashboard

**Phase 3 Complete** ✅

---

## Phase 4: Web App - Blog System

**Goal**: Create blog system with CMS-ready structure
**Duration**: 4-5 hours
**Key Files**: `apps/web/app/blogs/`, Supabase migration for `blog_articles` table

### Checklist

#### 4.1 Create Blog Articles Table (Supabase Migration)
- [ ] Navigate to Expo app: `cd /Users/apple/Documents/GitHub/FitnessApp`
- [ ] Create migration:
  ```bash
  npx supabase migration new add_blog_articles_table
  ```

- [ ] Add SQL to generated file:
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
    read_time INTEGER, -- minutes
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_blog_articles_slug ON public.blog_articles(slug);
  CREATE INDEX idx_blog_articles_published ON public.blog_articles(published) WHERE published = TRUE;

  -- RLS Policies
  ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Anyone can view published articles"
    ON public.blog_articles FOR SELECT
    USING (published = TRUE);

  CREATE POLICY "Admins can manage articles"
    ON public.blog_articles FOR ALL
    USING (
      EXISTS(SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
    );
  ```

- [ ] Apply migration:
  ```bash
  npx supabase db push
  ```

#### 4.2 Create Blog Index Page
- [ ] Create `apps/web/app/blogs/page.tsx`:
  - [ ] Server-side fetch published articles from Supabase
  - [ ] Display as grid/list with:
    - [ ] Featured image
    - [ ] Title
    - [ ] Excerpt
    - [ ] Read time
    - [ ] Publish date
    - [ ] Author name
  - [ ] Link to individual article pages
  - [ ] SEO metadata (title, description)

#### 4.3 Create Individual Blog Article Page
- [ ] Create `apps/web/app/blogs/[slug]/page.tsx`:
  - [ ] `generateStaticParams()` - fetch all published article slugs
  - [ ] `generateMetadata()` - dynamic SEO for each article
  - [ ] Fetch article by slug
  - [ ] Display full article content
  - [ ] Add JSON-LD structured data (BlogPosting)

- [ ] Example structure:
  ```typescript
  export async function generateStaticParams() {
    const supabase = createClient();
    const { data: articles } = await supabase
      .from('blog_articles')
      .select('slug')
      .eq('published', true);
    return articles?.map((article) => ({ slug: article.slug })) || [];
  }

  export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabase = createClient();
    const { data: article } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', params.slug)
      .single();

    return {
      title: `${article.title} | FitnessApp Blog`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [article.featured_image],
        type: 'article',
      },
    };
  }
  ```

#### 4.4 Create Shared Blog Types
- [ ] Create `shared/types/blog.ts`:
  ```typescript
  export interface BlogArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    author_id?: string;
    author_name?: string;
    published: boolean;
    published_at?: string;
    read_time?: number;
    category?: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
  }
  ```

- [ ] Export in `shared/types/index.ts`

#### 4.5 Add Blog Link to Navigation
- [ ] Update `apps/web/components/marketing/Header.tsx`:
  - [ ] Add "Blog" link → `/blogs`

#### 4.6 Create Sample Blog Article (Manual Insert)
- [ ] In Supabase Dashboard SQL Editor, insert sample article:
  ```sql
  INSERT INTO public.blog_articles (
    title,
    slug,
    excerpt,
    content,
    author_name,
    published,
    published_at,
    read_time,
    category
  ) VALUES (
    '5 Tips for Effective Meal Tracking',
    '5-tips-effective-meal-tracking',
    'Learn how to track your meals accurately and consistently to reach your fitness goals.',
    '<h2>Tip 1: Be Consistent</h2><p>Track every meal, even small snacks...</p>',
    'FitnessApp Team',
    TRUE,
    NOW(),
    5,
    'Nutrition'
  );
  ```

#### 4.7 Verify Blog System
- [ ] Navigate to http://localhost:3000/blogs
  - [ ] Should see sample article in list
  - [ ] Click article → should see full content
  - [ ] Check meta tags in browser DevTools (og:image, description)
  - [ ] Verify SEO metadata is correct

**Phase 4 Complete** ✅

---

## Phase 5: Web App - Limited Dashboard

**Goal**: Build read-only dashboard showing nutrition, weight, feed
**Duration**: 6-8 hours
**Key Files**: `apps/web/app/(app)/dashboard/`, TanStack Query setup

### Checklist

#### 5.1 Set Up TanStack Query
- [ ] Create `apps/web/lib/queryClient.ts`:
  ```typescript
  import { QueryClient } from '@tanstack/react-query';

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds
        cacheTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
  ```

- [ ] Create `apps/web/lib/queryKeys.ts`:
  ```typescript
  export const queryKeys = {
    diaryEntries: (date: string) => ['diary-entries', date] as const,
    nutritionSummary: (date: string) => ['nutrition-summary', date] as const,
    weightHistory: () => ['weight-history'] as const,
    posts: () => ['posts'] as const,
  };
  ```

- [ ] Wrap app with QueryClientProvider in `apps/web/app/layout.tsx`:
  ```typescript
  'use client';
  import { QueryClientProvider } from '@tanstack/react-query';
  import { queryClient } from '@/lib/queryClient';

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html>
        <body>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </body>
      </html>
    );
  }
  ```

#### 5.2 Create Dashboard Layout
- [ ] Create `apps/web/app/(app)/layout.tsx`:
  - [ ] Authenticated layout with sidebar/header
  - [ ] User profile dropdown (logout button)
  - [ ] Navigation links (Dashboard, Profile)

#### 5.3 Create Dashboard Page
- [ ] Create `apps/web/app/(app)/dashboard/page.tsx`:
  - [ ] Fetch user profile from Supabase
  - [ ] Display welcome message
  - [ ] Show 3 cards:
    1. Today's Nutrition (read-only)
    2. Weight Progress (chart)
    3. Recent Feed Posts (browse only)
  - [ ] Prominent "Download App" CTA for full features

#### 5.4 Build Nutrition Summary Component
- [ ] Create `apps/web/components/dashboard/NutritionCard.tsx`:
  - [ ] Fetch today's diary entries using TanStack Query
  - [ ] Calculate totals: calories, protein, carbs, fat
  - [ ] Display progress bars for each macro
  - [ ] Show "Log More" button → links to app store (can't edit on web)

- [ ] Example query:
  ```typescript
  const { data: entries = [] } = useQuery({
    queryKey: queryKeys.diaryEntries(today),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_diary_entries_for_date', {
        p_date: today,
      });
      if (error) throw error;
      return data || [];
    },
  });
  ```

#### 5.5 Build Weight Chart Component
- [ ] Install chart library:
  ```bash
  cd apps/web
  npm install recharts
  ```

- [ ] Create `apps/web/components/dashboard/WeightChart.tsx`:
  - [ ] Fetch weight history using TanStack Query
  - [ ] Display line chart with dates and weights
  - [ ] Show "Log Weight" button → links to app

#### 5.6 Build Feed Preview Component
- [ ] Create `apps/web/components/dashboard/FeedPreview.tsx`:
  - [ ] Fetch recent posts (limit 5) using TanStack Query
  - [ ] Display post cards (author, content, like count)
  - [ ] Read-only (no like/comment buttons)
  - [ ] "View Full Feed in App" CTA

#### 5.7 Add Download App CTAs
- [ ] Create `apps/web/components/dashboard/DownloadCTA.tsx`:
  - [ ] Alert banner: "Limited features on web. Download app for full experience."
  - [ ] Buttons: Download for Android | iOS

#### 5.8 Verify Dashboard
- [ ] Log in to http://localhost:3000/dashboard
  - [ ] Nutrition card shows today's totals
  - [ ] Weight chart displays (if data exists)
  - [ ] Feed preview shows recent posts
  - [ ] All data is read-only
  - [ ] CTAs are prominent
  - [ ] No console errors

**Phase 5 Complete** ✅

---

## Phase 6: Web App - Public Profiles

**Goal**: Create shareable public user profile pages
**Duration**: 3-4 hours
**Key Files**: `apps/web/app/profile/[username]/page.tsx`

### Checklist

#### 6.1 Create Public Profile Page
- [ ] Create `apps/web/app/profile/[username]/page.tsx`:
  - [ ] Fetch user by username from Supabase `profiles` table
  - [ ] Display:
    - [ ] Avatar
    - [ ] Username
    - [ ] Bio (if exists)
    - [ ] Points and rank
    - [ ] Follower/following count
    - [ ] Recent posts (public only)
  - [ ] SEO metadata with username

- [ ] Example structure:
  ```typescript
  export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, bio, avatar_url')
      .eq('username', params.username)
      .single();

    return {
      title: `${profile.username} | FitnessApp`,
      description: profile.bio || `Check out ${profile.username}'s fitness journey`,
      openGraph: {
        images: [profile.avatar_url || '/default-avatar.png'],
      },
    };
  }
  ```

#### 6.2 Create Profile Components
- [ ] Create `apps/web/components/profile/ProfileHeader.tsx`:
  - [ ] Avatar, username, bio
  - [ ] Points, rank badges
  - [ ] Follower/following counts (read-only, no follow button on web)

- [ ] Create `apps/web/components/profile/ProfilePosts.tsx`:
  - [ ] Fetch user's public posts
  - [ ] Display in feed format (read-only)
  - [ ] "Download app to interact" message

#### 6.3 Add Share Functionality
- [ ] Create share button:
  - [ ] Copy URL to clipboard
  - [ ] Share via Web Share API (mobile)
  - [ ] Example: `yourapp.com/profile/johndoe`

#### 6.4 Verify Public Profiles
- [ ] Create test user in Supabase (if not exists)
- [ ] Navigate to http://localhost:3000/profile/testuser
  - [ ] Profile displays correctly
  - [ ] Posts are visible
  - [ ] Share button works
  - [ ] SEO meta tags correct

**Phase 6 Complete** ✅

---

## Phase 7: Admin Panel - Infrastructure

**Goal**: Set up admin authentication and basic dashboard
**Duration**: 4-5 hours
**Key Files**: `apps/admin/middleware.ts`, `apps/admin/app/dashboard/`

### Checklist

#### 7.1 Add Admin System to Database (Supabase Migration)
- [ ] Navigate to Expo app: `cd /Users/apple/Documents/GitHub/FitnessApp`
- [ ] Create migration:
  ```bash
  npx supabase migration new add_admin_system
  ```

- [ ] Add SQL (from WEB_APP_ADMIN_PANEL_ARCHITECTURE.md lines 552-861):
  - [ ] Add `is_admin` column to `profiles` table
  - [ ] Create `is_admin()` helper function
  - [ ] Create admin RPC functions:
    - `admin_create_challenge(...)`
    - `admin_update_challenge(...)`
    - `admin_get_analytics()`
    - `admin_adjust_user_points(...)`
    - `admin_toggle_user_ban(...)`
  - [ ] Add `is_banned` column to `profiles`
  - [ ] Update RLS policy to prevent banned users from posting

- [ ] Apply migration:
  ```bash
  npx supabase db push
  ```

#### 7.2 Promote Admin User
- [ ] In Supabase Dashboard SQL Editor:
  ```sql
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE email = 'your-admin-email@example.com';
  ```

- [ ] Verify:
  ```sql
  SELECT id, email, username, is_admin FROM public.profiles WHERE is_admin = TRUE;
  ```

#### 7.3 Set Up Admin Supabase Client
- [ ] Create `apps/admin/lib/supabase.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr';

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```

#### 7.4 Create Admin Middleware (Two-Tier Security)
- [ ] Create `apps/admin/middleware.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr';
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  export async function middleware(request: NextRequest) {
    let response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return response;
  }

  export const config = {
    matcher: [
      '/dashboard/:path*',
      '/challenges/:path*',
      '/users/:path*',
      '/content/:path*',
    ],
  };
  ```

#### 7.5 Create Admin Login Page
- [ ] Create `apps/admin/app/login/page.tsx`:
  - [ ] Google OAuth button
  - [ ] Email/password form
  - [ ] Error handling
  - [ ] Redirect to /dashboard after login

#### 7.6 Create Unauthorized Page
- [ ] Create `apps/admin/app/unauthorized/page.tsx`:
  - [ ] "You are not authorized to access this panel" message
  - [ ] Logout button

#### 7.7 Create Admin Dashboard Layout
- [ ] Create `apps/admin/app/layout.tsx`:
  - [ ] Sidebar navigation:
    - Dashboard
    - Challenges
    - Users
    - Content (Blog CMS)
  - [ ] Header with user profile and logout

#### 7.8 Create Admin Dashboard Page
- [ ] Create `apps/admin/app/dashboard/page.tsx`:
  - [ ] Fetch analytics using `admin_get_analytics()` RPC
  - [ ] Display key metrics (placeholder cards):
    - Total Users
    - Active Users (30d)
    - Premium Subscribers
    - Total Posts
  - [ ] Use Tremor components for charts

#### 7.9 Verify Admin Panel
- [ ] Run admin panel: `cd apps/admin && npm run dev -- -p 3001`
- [ ] Navigate to http://localhost:3001/login
  - [ ] Log in with admin account
  - [ ] Should redirect to /dashboard
  - [ ] Dashboard shows analytics cards
  - [ ] Sidebar navigation works
  - [ ] Non-admin user redirects to /unauthorized

**Phase 7 Complete** ✅

---

## Phase 8: Admin Panel - Content Management

**Goal**: Build blog CMS and challenge management
**Duration**: 6-8 hours
**Key Files**: `apps/admin/app/content/`, `apps/admin/app/challenges/`

### Checklist

#### 8.1 Create Blog CMS - List View
- [ ] Create `apps/admin/app/content/blogs/page.tsx`:
  - [ ] Fetch all blog articles (published + drafts) from `blog_articles` table
  - [ ] Display in table:
    - Title
    - Status (published/draft)
    - Published date
    - Actions (Edit, Delete)
  - [ ] "New Article" button

#### 8.2 Create Blog CMS - Create Form
- [ ] Create `apps/admin/app/content/blogs/new/page.tsx`:
  - [ ] Form fields:
    - [ ] Title (text input)
    - [ ] Slug (auto-generated from title, editable)
    - [ ] Excerpt (textarea)
    - [ ] Content (textarea - rich text editor optional)
    - [ ] Featured Image URL (text input)
    - [ ] Category (select)
    - [ ] Tags (text input, comma-separated)
    - [ ] Read Time (number input)
    - [ ] Published (checkbox)
  - [ ] "Create" button → INSERT into `blog_articles` table

#### 8.3 Create Blog CMS - Edit Form
- [ ] Create `apps/admin/app/content/blogs/[id]/edit/page.tsx`:
  - [ ] Fetch article by ID
  - [ ] Pre-populate form (same fields as create)
  - [ ] "Update" button → UPDATE `blog_articles` table
  - [ ] "Delete" button → DELETE from `blog_articles`

#### 8.4 Create Challenge Management - List View
- [ ] Create `apps/admin/app/challenges/page.tsx`:
  - [ ] Fetch all challenges from `challenges` table
  - [ ] Display in table:
    - Title
    - Type
    - Points Reward
    - Status (active/inactive)
    - Start/End Dates
    - Actions (Edit, Toggle Active)
  - [ ] "New Challenge" button

#### 8.5 Create Challenge Management - Create Form
- [ ] Create `apps/admin/app/challenges/new/page.tsx`:
  - [ ] Form fields:
    - [ ] Title
    - [ ] Description
    - [ ] Type (select: nutrition, workout, weight_loss, streak, social)
    - [ ] Points Reward (number)
    - [ ] Start Date (datetime-local)
    - [ ] End Date (datetime-local)
    - [ ] Requirements (JSON textarea - optional)
  - [ ] "Create" button → Call `admin_create_challenge()` RPC

- [ ] Example mutation:
  ```typescript
  const { mutate: createChallenge, isPending } = useMutation({
    mutationFn: async (formData) => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('admin_create_challenge', {
        p_title: formData.title,
        p_description: formData.description,
        p_type: formData.type,
        p_points_reward: formData.points_reward,
        p_start_date: formData.start_date,
        p_end_date: formData.end_date,
        p_requirements: formData.requirements || {},
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      router.push('/challenges');
    },
  });
  ```

#### 8.6 Create Challenge Management - Edit Form
- [ ] Create `apps/admin/app/challenges/[id]/edit/page.tsx`:
  - [ ] Fetch challenge by ID
  - [ ] Pre-populate form
  - [ ] "Update" button → Call `admin_update_challenge()` RPC
  - [ ] Toggle active/inactive button

#### 8.7 Verify Content Management
- [ ] Test Blog CMS:
  - [ ] Create new blog article
  - [ ] Edit existing article
  - [ ] Publish/unpublish article
  - [ ] Delete article
  - [ ] Verify article appears on web app `/blogs`

- [ ] Test Challenge Management:
  - [ ] Create new challenge
  - [ ] Edit challenge details
  - [ ] Activate/deactivate challenge
  - [ ] Verify challenge appears in Expo app

**Phase 8 Complete** ✅

---

## Phase 9: Admin Panel - User Management

**Goal**: Build user management tools (ban/unban, points adjustment)
**Duration**: 4-5 hours
**Key Files**: `apps/admin/app/users/`

### Checklist

#### 9.1 Create User List View
- [ ] Create `apps/admin/app/users/page.tsx`:
  - [ ] Fetch all users from `profiles` table
  - [ ] Display in table:
    - Avatar
    - Username
    - Email
    - Points
    - Rank
    - Status (banned/active)
    - Actions (View, Ban/Unban, Adjust Points)
  - [ ] Search bar (filter by username or email)
  - [ ] Pagination (50 users per page)

#### 9.2 Create User Search Functionality
- [ ] Add search input with debounce
- [ ] Filter users client-side or server-side
- [ ] Example:
  ```typescript
  const { data: users = [] } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from('profiles').select('*');
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    },
  });
  ```

#### 9.3 Create User Detail View
- [ ] Create `apps/admin/app/users/[id]/page.tsx`:
  - [ ] Fetch user by ID
  - [ ] Display full profile:
    - [ ] Basic info (username, email, joined date)
    - [ ] Fitness stats (weight, height, goals)
    - [ ] Points and rank
    - [ ] Ban status
    - [ ] Recent activity (posts, challenges)
  - [ ] Actions:
    - [ ] Ban/Unban button
    - [ ] Adjust Points form

#### 9.4 Create Ban/Unban Functionality
- [ ] Add ban/unban button in user detail view
- [ ] Call `admin_toggle_user_ban()` RPC
- [ ] Example:
  ```typescript
  const { mutate: toggleBan, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('admin_toggle_user_ban', {
        p_user_id: userId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });
  ```

- [ ] Show confirmation dialog before banning

#### 9.5 Create Points Adjustment Form
- [ ] Add form in user detail view:
  - [ ] Points delta (number input - can be positive or negative)
  - [ ] Reason (text input)
  - [ ] "Adjust Points" button

- [ ] Call `admin_adjust_user_points()` RPC:
  ```typescript
  const { mutate: adjustPoints, isPending } = useMutation({
    mutationFn: async ({ userId, delta, reason }) => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('admin_adjust_user_points', {
        p_user_id: userId,
        p_points_delta: delta,
        p_reason: reason,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });
  ```

#### 9.6 Verify User Management
- [ ] Test user search:
  - [ ] Search by username
  - [ ] Search by email
  - [ ] Pagination works

- [ ] Test ban/unban:
  - [ ] Ban user → `is_banned` = true in database
  - [ ] Verify banned user cannot create posts in Expo app
  - [ ] Unban user → can post again

- [ ] Test points adjustment:
  - [ ] Add points → points increase
  - [ ] Subtract points → points decrease
  - [ ] Verify points_history table has entry
  - [ ] Rank updates correctly

**Phase 9 Complete** ✅

---

## Phase 10: Admin Panel - Analytics Dashboard

**Goal**: Build analytics dashboard with Tremor charts
**Duration**: 5-6 hours
**Key Files**: `apps/admin/app/dashboard/page.tsx`, Tremor components

### Checklist

#### 10.1 Install Tremor
- [ ] Already installed in Phase 1 (verify):
  ```bash
  cd apps/admin
  npm list @tremor/react
  ```

#### 10.2 Fetch Analytics Data
- [ ] Update `apps/admin/app/dashboard/page.tsx`:
  - [ ] Call `admin_get_analytics()` RPC
  - [ ] Store in state or use TanStack Query

- [ ] Example:
  ```typescript
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('admin_get_analytics');
      if (error) throw error;
      return data?.[0]; // Returns single row
    },
  });
  ```

#### 10.3 Create Key Metrics Cards (Tremor)
- [ ] Use Tremor `Card`, `Metric`, `Text` components
- [ ] Display:
  - [ ] Total Users
  - [ ] Active Users (30d)
  - [ ] Premium Subscribers
  - [ ] Total Posts
  - [ ] Total Challenges
  - [ ] Active Challenges
  - [ ] Total Points Awarded
  - [ ] Avg Points Per User

- [ ] Example:
  ```typescript
  import { Card, Metric, Text, Grid } from '@tremor/react';

  <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
    <Card>
      <Text>Total Users</Text>
      <Metric>{analytics.total_users.toLocaleString()}</Metric>
    </Card>
    <Card>
      <Text>Active Users (30d)</Text>
      <Metric>{analytics.active_users_30d.toLocaleString()}</Metric>
    </Card>
    {/* ... more cards */}
  </Grid>
  ```

#### 10.4 Create Engagement Chart (Bar Chart)
- [ ] Use Tremor `BarChart` component
- [ ] Display engagement metrics:
  - Posts
  - Challenges
  - Active Challenges

- [ ] Example:
  ```typescript
  import { BarChart } from '@tremor/react';

  const engagementData = [
    { name: 'Posts', value: analytics.total_posts },
    { name: 'Challenges', value: analytics.total_challenges },
    { name: 'Active Challenges', value: analytics.active_challenges },
  ];

  <BarChart
    data={engagementData}
    index="name"
    categories={['value']}
    colors={['blue']}
    className="mt-6"
  />
  ```

#### 10.5 Create User Distribution Chart (Donut Chart)
- [ ] Use Tremor `DonutChart` component
- [ ] Show free vs premium users

- [ ] Example:
  ```typescript
  import { DonutChart } from '@tremor/react';

  const userDistribution = [
    { name: 'Free Users', value: analytics.total_users - analytics.premium_subscribers },
    { name: 'Premium Users', value: analytics.premium_subscribers },
  ];

  <DonutChart
    data={userDistribution}
    category="value"
    index="name"
    colors={['gray', 'green']}
    className="mt-6"
  />
  ```

#### 10.6 Add Refresh Button
- [ ] Add "Refresh" button to dashboard
- [ ] Invalidate analytics query on click
- [ ] Show loading state

#### 10.7 Verify Analytics Dashboard
- [ ] Navigate to http://localhost:3001/dashboard
  - [ ] All metric cards display correctly
  - [ ] Bar chart shows engagement metrics
  - [ ] Donut chart shows user distribution
  - [ ] Refresh button works
  - [ ] No console errors

**Phase 10 Complete** ✅

---

## Phase 11: SEO & Performance Optimization

**Goal**: Optimize web app for search engines and performance
**Duration**: 4-5 hours
**Key Files**: `apps/web/app/sitemap.ts`, `apps/web/app/robots.ts`, `next.config.js`

### Checklist

#### 11.1 Generate Sitemap
- [ ] Create `apps/web/app/sitemap.ts`:
  ```typescript
  import { MetadataRoute } from 'next';
  import { createClient } from '@/lib/supabase-server';

  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient();

    // Fetch all published blog articles
    const { data: articles } = await supabase
      .from('blog_articles')
      .select('slug, updated_at')
      .eq('published', true);

    const blogUrls =
      articles?.map((article) => ({
        url: `https://yourapp.com/blogs/${article.slug}`,
        lastModified: new Date(article.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) || [];

    return [
      {
        url: 'https://yourapp.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://yourapp.com/blogs',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...blogUrls,
    ];
  }
  ```

#### 11.2 Generate robots.txt
- [ ] Create `apps/web/app/robots.ts`:
  ```typescript
  import { MetadataRoute } from 'next';

  export default function robots(): MetadataRoute.Robots {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/dashboard/', '/_next/'],
        },
      ],
      sitemap: 'https://yourapp.com/sitemap.xml',
    };
  }
  ```

#### 11.3 Optimize Images
- [ ] Replace all `<img>` tags with Next.js `<Image>` component
- [ ] Example:
  ```typescript
  import Image from 'next/image';

  <Image
    src="/hero-screenshot.png"
    alt="FitnessApp Dashboard"
    width={800}
    height={600}
    priority
  />
  ```

- [ ] Optimize images:
  - [ ] Compress images (TinyPNG or similar)
  - [ ] Convert to WebP format
  - [ ] Use appropriate sizes (no larger than displayed)

#### 11.4 Add Loading States
- [ ] Create `apps/web/app/loading.tsx` (global loading)
- [ ] Create `apps/web/app/(app)/dashboard/loading.tsx` (dashboard loading)
- [ ] Use Suspense for blog pages

#### 11.5 Optimize Bundle Size
- [ ] Update `apps/web/next.config.js`:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      domains: ['yourapp.com', 'oswlhrzarxjpyocgxgbr.supabase.co'],
    },
    experimental: {
      optimizeCss: true,
    },
  };

  module.exports = nextConfig;
  ```

#### 11.6 Run Lighthouse Audit
- [ ] Open http://localhost:3000 in Chrome
- [ ] Open DevTools → Lighthouse
- [ ] Run audit for:
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO

- [ ] Target scores:
  - [ ] Performance: >90
  - [ ] Accessibility: >90
  - [ ] Best Practices: >90
  - [ ] SEO: >90

#### 11.7 Fix Lighthouse Issues
- [ ] Address any issues flagged by Lighthouse
- [ ] Common fixes:
  - [ ] Add alt text to images
  - [ ] Improve color contrast
  - [ ] Add meta descriptions
  - [ ] Lazy load images below the fold
  - [ ] Remove unused CSS/JS

#### 11.8 Set Up Google Analytics (Optional)
- [ ] Create Google Analytics 4 property
- [ ] Add tracking code to `apps/web/app/layout.tsx`
- [ ] Example:
  ```typescript
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
    strategy="afterInteractive"
  />
  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `}
  </Script>
  ```

#### 11.9 Verify SEO Optimization
- [ ] Check sitemap: http://localhost:3000/sitemap.xml
- [ ] Check robots.txt: http://localhost:3000/robots.txt
- [ ] Verify meta tags in browser DevTools
- [ ] Test image loading (Network tab)
- [ ] Lighthouse scores meet targets

**Phase 11 Complete** ✅

---

## Phase 12: Final Testing & Deployment

**Goal**: Deploy web app to Vercel, final testing
**Duration**: 3-4 hours
**Key Files**: Vercel configuration

### Checklist

#### 12.1 Deploy Web App to Vercel

**Install Vercel CLI**:
- [ ] Install: `npm i -g vercel`

**Link Project**:
- [ ] Navigate: `cd /Users/apple/Documents/GitHub/fitness-web/apps/web`
- [ ] Link: `vercel link`
- [ ] Select or create project

**Set Environment Variables**:
- [ ] Add environment variables in Vercel dashboard:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = https://oswlhrzarxjpyocgxgbr.supabase.co
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [your-anon-key]
  - [ ] `NEXT_PUBLIC_SITE_URL` = https://yourapp.com (or Vercel URL)

**Deploy to Production**:
- [ ] Deploy: `vercel --prod`
- [ ] Wait for deployment to complete
- [ ] Note deployment URL

#### 12.2 Configure Custom Domain (Optional)
- [ ] Go to Vercel dashboard → Settings → Domains
- [ ] Add custom domain (e.g., `yourapp.com`)
- [ ] Update DNS records with your provider:
  - Type: `A` | Name: `@` | Value: `76.76.21.21`
  - Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (5-10 minutes)
- [ ] Vercel automatically provisions SSL certificate

#### 12.3 Update Supabase OAuth Redirect URLs
- [ ] Go to Supabase Dashboard → Authentication → URL Configuration
- [ ] Add redirect URLs:
  - [ ] `http://localhost:3000/auth/callback` (local)
  - [ ] `https://yourapp.com/auth/callback` (production)

#### 12.4 Verify Deployment
- [ ] Visit production URL: https://yourapp.com (or Vercel URL)
  - [ ] Landing page loads correctly
  - [ ] Images display
  - [ ] Navigation works
  - [ ] Blog pages load
  - [ ] Authentication works (Google OAuth)
  - [ ] Dashboard displays data
  - [ ] Public profiles accessible
  - [ ] No console errors

#### 12.5 Test on Mobile Devices
- [ ] Test on iOS Safari:
  - [ ] Landing page
  - [ ] Blog articles
  - [ ] Login flow
  - [ ] Dashboard

- [ ] Test on Android Chrome:
  - [ ] Same as above

#### 12.6 Submit Sitemap to Google Search Console
- [ ] Go to https://search.google.com/search-console
- [ ] Add property: https://yourapp.com
- [ ] Verify ownership (DNS or HTML file)
- [ ] Submit sitemap: https://yourapp.com/sitemap.xml
- [ ] Request indexing for key pages (landing, blog index)

#### 12.7 Final Admin Panel Check
- [ ] Ensure admin panel is NOT deployed to Vercel (localhost only)
- [ ] Test admin panel locally:
  - [ ] `cd /Users/apple/Documents/GitHub/fitness-web/apps/admin`
  - [ ] `npm run dev -- -p 3001`
  - [ ] Test all admin functions (challenges, users, blog CMS, analytics)

**Phase 12 Complete** ✅

---

## Manual End-to-End Testing Checklist

**Purpose**: Comprehensive manual testing after all phases complete
**Tester**: You or a team member
**Duration**: 2-3 hours

### Web App Testing

#### Landing Page
- [ ] Navigate to homepage (https://yourapp.com)
- [ ] Hero section displays correctly
- [ ] Download CTA buttons visible and prominent
- [ ] Features showcase section readable
- [ ] Footer links work
- [ ] Navigation header functional
- [ ] Mobile responsive (test on phone or DevTools)
- [ ] No JavaScript errors in console
- [ ] Lighthouse SEO score >90

#### Blog System
- [ ] Navigate to /blogs
- [ ] Blog index page displays all published articles
- [ ] Article cards show featured image, title, excerpt
- [ ] Click article → loads individual article page
- [ ] Article content displays correctly
- [ ] Author name and publish date visible
- [ ] Read time estimate shown
- [ ] Related articles section (if implemented)
- [ ] Social share buttons work (if implemented)
- [ ] SEO meta tags present (check DevTools)
- [ ] Mobile responsive

#### Authentication
- [ ] Click "Login" in header → redirects to /login
- [ ] Google OAuth button visible
- [ ] Click "Sign in with Google"
- [ ] Google consent screen appears
- [ ] After consent, redirects to /dashboard
- [ ] Session persists on page refresh
- [ ] Logout button works (clears session)
- [ ] Protected routes redirect to /login when not authenticated

#### Dashboard
- [ ] After login, dashboard displays
- [ ] Welcome message with username
- [ ] Nutrition card shows today's totals (calories, macros)
- [ ] Progress bars display correctly
- [ ] Weight chart displays (if data exists)
- [ ] Feed preview shows recent posts
- [ ] All data is read-only (no edit buttons)
- [ ] "Download App" CTAs prominent
- [ ] Mobile responsive
- [ ] No console errors

#### Public Profiles
- [ ] Navigate to /profile/[username]
- [ ] Profile header displays (avatar, username, bio)
- [ ] Points and rank badges visible
- [ ] Follower/following counts shown
- [ ] User's posts displayed
- [ ] Share button copies URL to clipboard
- [ ] SEO meta tags include username
- [ ] Mobile responsive

#### Cross-Browser Testing
- [ ] Test in Chrome (desktop + mobile)
- [ ] Test in Safari (desktop + mobile)
- [ ] Test in Firefox (desktop)
- [ ] Verify consistent behavior across browsers

### Admin Panel Testing

#### Admin Authentication
- [ ] Navigate to http://localhost:3001/login
- [ ] Log in with admin account
- [ ] Redirects to /dashboard
- [ ] Non-admin user redirects to /unauthorized
- [ ] Logout works

#### Analytics Dashboard
- [ ] Dashboard displays key metrics:
  - [ ] Total Users
  - [ ] Active Users (30d)
  - [ ] Premium Subscribers
  - [ ] Total Posts
  - [ ] Total Challenges
  - [ ] Active Challenges
- [ ] Bar chart shows engagement metrics
- [ ] Donut chart shows user distribution
- [ ] Refresh button updates data
- [ ] No console errors

#### Challenge Management
- [ ] Navigate to /challenges
- [ ] List of all challenges displays
- [ ] Click "New Challenge"
- [ ] Fill out form (title, description, type, points, dates)
- [ ] Click "Create" → challenge created
- [ ] Verify challenge appears in list
- [ ] Click "Edit" on existing challenge
- [ ] Update challenge details
- [ ] Click "Update" → changes saved
- [ ] Toggle active/inactive → status updates
- [ ] Verify challenge appears in Expo app

#### User Management
- [ ] Navigate to /users
- [ ] List of all users displays
- [ ] Search by username → filters results
- [ ] Search by email → filters results
- [ ] Click user → loads detail view
- [ ] User profile displays correctly
- [ ] Click "Ban User" → confirmation dialog
- [ ] Confirm → user banned (`is_banned` = true)
- [ ] Verify banned user cannot create posts in Expo app
- [ ] Click "Unban User" → user unbanned
- [ ] Points adjustment form visible
- [ ] Enter points delta (e.g., +50)
- [ ] Enter reason (e.g., "Bonus for testing")
- [ ] Click "Adjust Points" → points updated
- [ ] Verify points_history table has entry
- [ ] Verify rank updates correctly

#### Blog CMS
- [ ] Navigate to /content/blogs
- [ ] List of all blog articles displays (published + drafts)
- [ ] Click "New Article"
- [ ] Fill out form (title, slug, excerpt, content, featured image URL, category, tags, read time)
- [ ] Check "Published" checkbox
- [ ] Click "Create" → article created
- [ ] Verify article appears in web app /blogs
- [ ] Click "Edit" on existing article
- [ ] Update article details
- [ ] Click "Update" → changes saved
- [ ] Verify changes reflected on web app
- [ ] Click "Delete" → confirmation dialog
- [ ] Confirm → article deleted

### Data Consistency Testing

#### Shared Database
- [ ] Create post in Expo app → appears in web app feed preview
- [ ] Update user profile in Expo app → reflected in web app dashboard
- [ ] Ban user in admin panel → cannot post in Expo app
- [ ] Create challenge in admin panel → appears in Expo app challenges screen
- [ ] Adjust points in admin panel → reflected in Expo app leaderboard
- [ ] Publish blog article in admin → appears on web app /blogs

### Performance Testing

#### Load Times
- [ ] Landing page loads <2 seconds
- [ ] Blog index page loads <2 seconds
- [ ] Individual article page loads <2 seconds
- [ ] Dashboard loads <3 seconds (with data fetching)
- [ ] Admin dashboard loads <3 seconds

#### Lighthouse Audits
- [ ] Run Lighthouse on landing page:
  - [ ] Performance >90
  - [ ] Accessibility >90
  - [ ] Best Practices >90
  - [ ] SEO >90

- [ ] Run Lighthouse on blog article page:
  - [ ] All scores >90

### Security Testing

#### Authentication
- [ ] Cannot access /dashboard without login
- [ ] Cannot access admin panel without admin role
- [ ] Session expires after logout
- [ ] CSRF protection enabled (Supabase Auth handles this)

#### RLS Policies
- [ ] Non-admin cannot call admin RPC functions (test in browser console)
- [ ] Banned users cannot create posts (test via Expo app)
- [ ] Users can only view published blog articles (test unpublished article URL)

### Final Checks

#### Documentation
- [ ] README.md exists in `fitness-web/` repo
- [ ] Installation instructions clear
- [ ] Environment variables documented
- [ ] Deployment guide included

#### Code Quality
- [ ] No TypeScript errors: `npm run build` (web and admin)
- [ ] No ESLint errors: `npm run lint` (web and admin)
- [ ] No unused dependencies
- [ ] .env.example files created

#### Git Repository
- [ ] All code committed to Git
- [ ] Descriptive commit messages
- [ ] .gitignore includes `.env*`, `node_modules/`, `.next/`
- [ ] Pushed to remote repository (GitHub, GitLab, etc.)

---

## Summary

### What We Built

**Web App** (`apps/web/`):
- ✅ Landing page with SEO optimization
- ✅ Blog system with CMS-ready structure
- ✅ Public user profiles (shareable links)
- ✅ Limited dashboard (read-only nutrition, weight, feed)
- ✅ Google OAuth authentication
- ✅ Deployed to Vercel

**Admin Panel** (`apps/admin/`):
- ✅ Localhost-only (maximum security)
- ✅ Analytics dashboard with Tremor charts
- ✅ Challenge management (create, edit, activate/deactivate)
- ✅ User management (ban/unban, points adjustment)
- ✅ Blog CMS (create, edit, publish articles)

### Key Files Created

```
fitness-web/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── page.tsx (Landing)
│   │   │   ├── (auth)/login/page.tsx
│   │   │   ├── (app)/dashboard/page.tsx
│   │   │   ├── blogs/page.tsx
│   │   │   ├── blogs/[slug]/page.tsx
│   │   │   ├── profile/[username]/page.tsx
│   │   │   ├── sitemap.ts
│   │   │   └── robots.ts
│   │   ├── lib/
│   │   │   ├── supabase-browser.ts
│   │   │   ├── supabase-server.ts
│   │   │   ├── queryClient.ts
│   │   │   └── queryKeys.ts
│   │   └── middleware.ts
│   │
│   └── admin/
│       ├── app/
│       │   ├── dashboard/page.tsx
│       │   ├── challenges/page.tsx
│       │   ├── challenges/new/page.tsx
│       │   ├── users/page.tsx
│       │   ├── users/[id]/page.tsx
│       │   └── content/blogs/page.tsx
│       └── middleware.ts
│
└── shared/
    ├── utils/goalCalculator.ts
    ├── types/user.ts
    └── constants/theme.ts
```

### Database Changes (Applied via Supabase Migrations)

**Migration 1: Blog Articles Table**
- Table: `blog_articles`
- RLS policies for public viewing and admin management

**Migration 2: Admin System**
- Column: `profiles.is_admin`
- Column: `profiles.is_banned`
- RPC functions: `admin_create_challenge`, `admin_update_challenge`, `admin_get_analytics`, `admin_adjust_user_points`, `admin_toggle_user_ban`
- Updated RLS policy: Banned users cannot create posts

### Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| UI Library | shadcn/ui + Tailwind CSS |
| Charts | Tremor (admin only) |
| Database | Supabase PostgreSQL (shared) |
| Auth | Supabase Auth (Google OAuth) |
| Data Fetching | TanStack Query |
| Deployment | Vercel (web) + Localhost (admin) |

### Next Steps (Future Enhancements)

**Monorepo Migration** (Optional):
- Use Turborepo or npm workspaces
- Share code between Expo, Web, and Admin
- Unified TypeScript configuration

**Additional Features**:
- Email/password authentication (in addition to Google)
- Rich text editor for blog CMS (TipTap or Lexical)
- Image upload for blog featured images (Supabase Storage)
- Advanced analytics (user retention, revenue tracking)
- A/B testing for landing page

### Maintenance

**Regular Tasks**:
- Update dependencies: `npm update` (monthly)
- Review Lighthouse scores (quarterly)
- Monitor Vercel analytics
- Backup Supabase database (automated via Supabase)
- Review and moderate blog comments (if implemented)

---

**Implementation Complete** ✅

This guide provides a comprehensive, phase-by-phase roadmap for building the web app and admin panel. Each phase includes detailed checklists to ensure nothing is missed. The manual testing checklist at the end ensures production-ready quality.
