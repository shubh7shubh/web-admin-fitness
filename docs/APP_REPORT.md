# FitnessApp - Complete Application Report

**Last Updated:** 2025-12-28
**Purpose:** Comprehensive reference for AI agents to understand the entire application architecture, features, and implementation patterns.
**Project Type:** Production-grade fitness tracking mobile app with gamification, social features, and premium subscriptions
**Platform:** React Native (Expo) - iOS, Android, Web

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Architecture Principles](#architecture-principles)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [Database Architecture](#database-architecture)
7. [Critical Implementation Rules](#critical-implementation-rules)
8. [Data Fetching Patterns](#data-fetching-patterns)
9. [Migration Workflow](#migration-workflow)
10. [Common Code Patterns](#common-code-patterns)
11. [Important Lessons Learned](#important-lessons-learned)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

FitnessApp is a **production-grade fitness tracking application** that combines MyFitnessPal-like functionality with gamification, social engagement, and premium subscriptions. The app features a **cloud-first architecture** powered by Supabase PostgreSQL, with real-time points-based social feeds, challenge systems, and comprehensive nutrition tracking.

### Key Differentiators
- **Gamified Engagement:** Points system with leaderboards, challenges, and automated rewards
- **Social-First Design:** Community posts ranked by user points - top performers get top visibility
- **Real-Time Features:** Live chat, instant leaderboard updates, real-time notifications
- **Production Architecture:** Direct RPC calls (not Edge Functions), materialized views, database triggers
- **Performance:** <10ms leaderboard queries, automatic caching, optimistic updates

---

## Technology Stack

### Frontend & Framework
- **React Native** with **Expo SDK 52** - Cross-platform mobile development
- **Expo Router** - File-based navigation system with native stack
- **TypeScript** - Type-safe development experience
- **NativeWind** - Tailwind CSS utility classes for React Native
- **React Native Gifted Charts** - Data visualizations
- **Inter Font Family** - Modern typography
- **Expo Image** - Optimized image handling with caching

### Data Layer (Cloud-First Architecture)
- **Supabase PostgreSQL** - Single source of truth for all data
- **TanStack Query (React Query)** - Server state management, caching, synchronization
  - 30s stale time, 5min cache time
  - Automatic request deduplication
  - Optimistic updates for instant UI feedback
- **Zustand** - Lightweight client state management
  - `useAppStore` - Authentication, global state
  - `useUserStore` - User profile, fitness goals
- **Zod** - Runtime type validation and schema definition

### Backend Services
- **Supabase Auth** - Google Sign-in and user management
- **Supabase RPC Functions** - Complex database operations with Row Level Security
- **Supabase Edge Functions** - 3rd party API integrations (payments, AI) ONLY
- **Supabase Storage** - User-generated content (profile pictures, post images)
- **Supabase Realtime** - Real-time message delivery, leaderboard updates

### Development & Quality
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hook enforcement
- **Jest** - Testing framework with jest-expo preset
- **EAS Build** - CI/CD pipeline for app deployment

---

## Architecture Principles

### Production-Grade Architecture Decision Matrix

**CRITICAL:** The app follows a carefully designed architecture for optimal performance, cost, and security:

| Use Case | Implementation | Why | Status |
|----------|----------------|-----|--------|
| **User CRUD Operations** | Supabase Client + RLS + RPC | • FREE (included in database compute)<br>• FAST (no extra network hop)<br>• OFFLINE (works with TanStack Query cache) | ✅ Posts, comments, likes, follows, diary entries |
| **Gamification Logic** | Database Triggers | • ATOMIC (prevents cheating)<br>• CHEAP (runs inside DB transaction)<br>• AUTOMATIC (no client code needed) | ✅ Points, leaderboards, challenges |
| **Feed Counts** | Cached Counts + Triggers | • PERFORMANCE (never run `SELECT COUNT(*)`)<br>• Store count and update with triggers | ✅ like_count, comment_count |
| **AI Features** | Edge Functions | • SECURITY (hide OpenAI API keys)<br>• Client cannot see secrets | ⏳ Future |
| **Payment Processing** | Edge Functions | • SECURITY (verify webhook signatures)<br>• Protect payment credentials | ⏳ Future |
| **Push Notifications** | Edge Functions | • SECURITY (protect Apple/Google master keys)<br>• Server-side sending | ⏳ Future |
| **Cron Jobs** | Edge Functions | • AUTOMATION (app can be closed)<br>• Scheduled tasks | ⏳ Future |

**Key Principle:** Edge Functions are ONLY for 3rd party API integrations (AI, payments, push notifications) and automation. ALL user data operations use direct Supabase client calls with RLS policies and RPC functions.

### Why This Architecture?

1. **Cost Efficiency:** RPC calls included in database compute, Edge Functions billed separately
2. **Performance:** No extra network hop for user data operations
3. **Security:** RLS policies enforce row-level access control
4. **Offline Support:** TanStack Query cache works when internet drops
5. **Atomicity:** Database triggers prevent race conditions and ensure data consistency

---

## Project Structure

```
FitnessApp/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx             # Login with Google
│   │   └── onboarding.tsx        # Multi-step user setup
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Home dashboard
│   │   ├── diary.tsx             # Daily nutrition logging
│   │   ├── progress.tsx          # Weight tracking, charts
│   │   └── feeds.tsx             # Social feed
│   ├── (modals)/                 # Modal screens
│   │   ├── profile.tsx           # User profile view/edit
│   │   ├── comments/[postId].tsx # Post comments
│   │   ├── conversations.tsx     # Chat conversations list
│   │   ├── chat/[id].tsx         # 1-on-1 chat screen
│   │   ├── challenges.tsx        # Challenges list
│   │   ├── full-leaderboard.tsx  # Top 100 leaderboard
│   │   └── user-profile/[id].tsx # Other users' profiles
│   ├── nutrition/                # Food logging screens
│   │   └── search.tsx            # Food database search
│   ├── blogs/                    # Articles and content
│   ├── post/[id].tsx             # Single post detail view
│   └── user/[id].tsx             # User profile with posts grid
│
├── modules/                      # Feature-based modules
│   ├── home/                     # Dashboard components
│   │   ├── components/           # HeroSection, PlansBanner, LeaderboardSection
│   │   ├── hooks/                # useTheme
│   │   └── store/                # homeStore (Zustand)
│   ├── diary/                    # Daily logging
│   │   └── components/           # DiaryEntry, MealSection
│   ├── nutrition/                # Food database
│   │   └── components/           # FoodSearchResults, QuickLogModal
│   ├── progress/                 # Weight tracking
│   │   └── components/           # WeightChart, ProgressStats
│   ├── onboarding/               # User setup
│   │   ├── components/           # OnboardingSteps
│   │   └── services/             # goalCalculator.ts (TDEE, BMR)
│   ├── feeds/                    # Social feed
│   │   └── components/           # PostCard, FeedFilters
│   ├── premium/                  # Premium subscription system
│   │   ├── components/           # PlanDashboard, DietPlanView, WorkoutPlanView, AssessmentForm
│   │   ├── hooks/                # usePremiumStatus, useDietPlan, useWorkoutPlan
│   │   └── types/                # diet.ts, workout.ts
│   └── products/                 # E-commerce (future)
│
├── components/                   # Shared UI components
│   ├── Post.tsx                  # Social post card
│   ├── Comment.tsx               # Comment component
│   └── FollowButton.tsx          # Follow/unfollow button
│
├── stores/                       # Zustand state management
│   ├── appStore.ts               # Global app state (auth, loading)
│   └── useUserStore.ts           # User profile state (goals, points)
│
├── providers/                    # React context providers
│   ├── AuthProvider.tsx          # Authentication context
│   └── ToastProvider.tsx         # Toast notifications
│
├── lib/                          # External service configurations
│   ├── supabase.ts               # Supabase client setup
│   ├── queryClient.ts            # TanStack Query configuration
│   └── queryKeys.ts              # Query key factory (centralized cache keys)
│
├── constants/                    # Theme and configuration
│   └── theme.ts                  # Color palette, typography
│
├── supabase/                     # Supabase backend layer
│   ├── migrations/               # SQL migration files (production-grade CLI workflow)
│   └── functions/                # Edge Functions (AI, payments, push - future)
│
├── docs/                         # Comprehensive documentation (27+ files)
│   ├── APP_REPORT.md             # THIS FILE - Complete app reference
│   ├── CURRENT_DATABASE_STATE.md # Complete database schema (3,000+ lines)
│   ├── CLAUDE.md                 # Primary developer guide
│   ├── README.md                 # Project overview
│   ├── TANSTACK_QUERY_GUIDE.md   # Data fetching patterns (1,098 lines)
│   ├── ARCHITECTURE_DECISIONS.md # Design rationale
│   ├── MIGRATION_WORKFLOW.md     # Database migration best practices
│   ├── FEATURE_PROMPTS.md        # Copy-paste prompts for Claude CLI
│   ├── POINTS_SYSTEM_IMPLEMENTATION_GUIDE.md # Points system spec
│   ├── PREMIUM_ADMIN_WORKFLOW.md # Premium plan creation guide
│   ├── CONCIERGE_PREMIUM_IMPLEMENTATION_GUIDE.md # Premium implementation
│   ├── SAMPLE_DIET_PLAN_INSERT.sql # Sample diet plan template
│   ├── SAMPLE_WORKOUT_PLAN_INSERT.sql # Sample workout plan template
│   ├── applied_fixes.md          # Manual changes log
│   └── [other guides]
│
├── test/                         # Jest test files
│
├── .env                          # Environment variables (not committed)
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build profiles
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

### Key Directory Patterns

- **`app/`** - File-based routing (Expo Router convention)
  - `(tabs)/` - Tab bar screens
  - `(modals)/` - Modal presentations
  - `(auth)/` - Authentication flow
  - Dynamic routes: `[id].tsx`, `[postId].tsx`

- **`modules/`** - Feature-based organization
  - Each feature has: `components/`, `hooks/`, `store/`, `services/`
  - Self-contained features for better organization

- **`supabase/migrations/`** - Production-grade migration workflow
  - Format: `YYYYMMDDHHMMSS_description.sql`
  - Applied via CLI: `npx supabase db push`
  - Automatic tracking prevents duplicate runs

---

## Core Features

### 1. Authentication & Onboarding
- **Google Sign-In:** Supabase Auth integration
- **Multi-Step Onboarding:** Collects age, gender, height, weight, goals, activity level
- **Goal Calculation:** Pure function calculates TDEE, BMR, calorie goals, macro targets
- **Auto Profile Creation:** Database trigger creates profile on signup

### 2. Daily Nutrition Tracking
- **Food Database:** Comprehensive nutrition database with full-text search
- **Diary Entries:** Log meals by type (breakfast, lunch, dinner, snacks)
- **Macro Tracking:** Calories, protein, carbs, fat, fiber
- **Daily Summary:** Real-time calculation via RPC function `get_daily_nutrition_summary`
- **Goal Progress:** Visual progress bars for calories and macros

### 3. Weight Tracking & Progress
- **Weight Logging:** Daily weight entries with timestamp
- **Historical Charts:** Line chart visualization using React Native Gifted Charts
- **Goal Monitoring:** Track progress toward weight loss/gain/maintenance goals
- **TDEE Recalculation:** Goals auto-update when weight changes

### 4. Gamified Social Feed
- **Points System:** Multi-source earning (posts, daily goals, challenges, referrals)
  - Create Post: 2 pts (max 10/day = 20 pts)
  - Daily Calorie Goal: 10 pts
  - All Macros Goal: +5 pts
  - Daily Streak: +1 to +10 pts based on consecutive days
  - Challenge Completion: 30-100 pts
  - Successful Referral: 25 pts
  - **Max Daily Routine:** ~45 pts

- **Leaderboard System:**
  - Materialized view caches top 100 users (<10ms queries)
  - Real-time rank updates via database triggers
  - User rank calculation for all users (on-demand for non-top-100)
  - Tiebreaker: Earlier account creation wins
  - Home screen preview (top 5) + full leaderboard modal (top 100)

- **Social Posts:**
  - Image uploads to Supabase Storage
  - Captions (500 char limit)
  - Like/unlike (toggle + double-tap)
  - Comments with author info
  - Save/bookmark posts
  - Edit/delete own posts
  - Rank badges on posts (gold/silver/bronze)
  - Feed sorting: Top 20 users prioritized, then by created_at DESC

- **Follow System:**
  - Follow/unfollow users
  - Cached follower/following counts
  - Feed filters: "For You" vs "Following"
  - Followers/following lists

### 5. Challenge System
- **5 Seeded Challenges:**
  - 7-Day Nutrition Streak (50 pts)
  - Macro Master (75 pts)
  - Social Butterfly (30 pts)
  - Weight Loss Warrior (100 pts)
  - Consistency King (60 pts)

- **Challenge Features:**
  - Enrollment system (user_challenges junction table)
  - Progress tracking (JSONB metadata)
  - Status: in_progress, completed, failed, expired
  - Automated point awards on completion
  - Challenge types: workout, nutrition, weight_loss, streak, social

### 6. Direct Messaging
- **1-on-1 Chat:** Real-time messaging with followers/following
- **Features:**
  - Bidirectional conversations (no duplicates)
  - Read/unread status
  - Last message preview
  - Unread count badges
  - Message history with pagination
  - Rate limiting (30 messages/minute)
  - Real-time delivery via Supabase Realtime

### 7. Premium Subscription System (Concierge Model) ✅
**Status:** FULLY IMPLEMENTED (December 2025)

**4-State Gatekeeper System:**
- **State 1 (Upsell):** Free users see marketing screen with upgrade button
- **State 2 (Needs Assessment):** Premium users redirected to 17-field assessment form
- **State 3 (Pending):** Assessment submitted, waiting for expert plan creation
- **State 4 (Active):** Plans ready, user sees full dashboard with Diet + Workout tabs

**Assessment Form (17 Fields in 3 Sections):**
- **Section 1 - General:** fitness_goals (1 field)
- **Section 2 - Nutrition:** dietary_preferences, health_conditions, activity_level, meal_frequency, favorite_foods, foods_to_avoid (6 fields)
- **Section 3 - Workout:** workout_experience, available_equipment, time_availability, workout_days_per_week, preferred_workout_split, primary_workout_goal, cardio_preference, workout_limitations, workout_environment, preferred_workout_time (10 fields)

**Expert-Created Plans:**
- **Diet Plans:** Personalized meal plans with JSONB structure (weeks/days/meals)
  - Nutrition data: calories, protein, carbs, fat per meal
  - Meal types: breakfast, lunch, dinner, snacks
  - Preparation instructions included
  - "Eat This" button logs meals directly to diary (one-tap logging)
- **Workout Plans:** Customized exercise routines with JSONB structure (weeks/days/exercises)
  - Exercise details: sets, reps, weight, rest_seconds, tempo
  - Muscle group targeting: chest, back, shoulders, legs, etc.
  - Form tips and alternative exercises
  - Estimated duration per workout

**Admin Workflow:**
- Manual plan creation via Supabase Dashboard SQL Editor
- JSON templates for consistency
- Sample INSERT scripts: `SAMPLE_DIET_PLAN_INSERT.sql`, `SAMPLE_WORKOUT_PLAN_INSERT.sql`
- Quality-first concierge approach ("do things that don't scale")

**Database Tables:**
- `premium_assessments` - 17 fields, unique active constraint per user
- `diet_plans` - JSONB plan_data, one active per user
- `workout_plans` - JSONB routine_data, one active per user

**Key RPC Functions:**
- `submit_premium_assessment()` - Submit 17-field questionnaire
- `get_user_premium_status()` - Returns gatekeeper state + plan status
- `get_active_diet_plan()` - Fetch diet plan with calculated current week/day
- `get_active_workout_plan()` - Fetch workout plan with calculated current week/day
- `log_planned_meal_v2()` - One-tap meal logging from plan to diary

**Frontend Components:**
- `PlanDashboard` - Tab switcher (Diet | Workout)
- `DietPlanView` - Meal display with "Eat This" buttons
- `WorkoutPlanView` - Exercise cards with expandable instructions
- `AssessmentForm` - 17-field form with 3 visual sections
- `AssessmentPendingView` - Waiting room UI
- `PremiumUpsellView` - Marketing screen for free users

**Documentation:** See `docs/PREMIUM_ADMIN_WORKFLOW.md` and `docs/CONCIERGE_PREMIUM_IMPLEMENTATION_GUIDE.md`

---

## Database Architecture

### Database Reference

**Complete database schema is documented in:**
👉 **`docs/CURRENT_DATABASE_STATE.md`** (1,755 lines)

This file contains:
- All 20+ table schemas with columns, indexes, constraints
- All 24+ RPC function signatures and behavior
- All database triggers
- Row Level Security (RLS) policies
- Storage bucket configurations
- Points system tables and functions (Sections 13-16)

**DO NOT duplicate database documentation here.** Always refer to `CURRENT_DATABASE_STATE.md` for:
- Table structures
- Function signatures
- Trigger definitions
- Index strategies
- RLS policies

### Database Highlights

**Core Tables:**
- `profiles` - User profiles with fitness goals, points, rank, streaks
- `foods` - Nutrition database with full-text search
- `diary_entries` - Daily food/exercise logging
- `weight_entries` - Weight tracking history
- `posts` - Social feed posts (uses `author_id`, NOT `user_id`)
- `likes`, `comments`, `follows`, `saved_posts` - Social engagement
- `conversations`, `messages` - 1-on-1 chat
- `challenges`, `user_challenges` - Challenge system
- `referrals` - Referral tracking
- `points_history` - Complete audit trail
- `leaderboard_mv` - Materialized view (top 100 users)
- `premium_assessments` - User questionnaires (17 fields in 3 sections)
- `diet_plans` - Expert-created diet plans (JSONB weeks/days/meals)
- `workout_plans` - Expert-created workout plans (JSONB weeks/days/exercises)

**Key RPC Functions:**
- `award_points()` - Central point award function
- `check_daily_goal_achievement()` - Auto nutrition goal check
- `get_leaderboard()`, `get_user_rank()` - Leaderboard queries
- `enroll_in_challenge()`, `complete_challenge()` - Challenge management
- `toggle_like()`, `toggle_follow()` - Atomic social actions
- `get_feed()` - Social feed with rank and engagement data
- `get_or_create_conversation()`, `send_message()` - Chat operations
- `submit_premium_assessment()` - Submit 17-field questionnaire
- `get_user_premium_status()` - Get gatekeeper state and plan status
- `get_active_diet_plan()` - Fetch diet plan with week/day calculation
- `get_active_workout_plan()` - Fetch workout plan with week/day calculation
- `log_planned_meal_v2()` - One-tap meal logging from plan to diary

**Database Triggers (Automation):**
- `trigger_award_post_points()` - Awards 2 pts per post (max 10/day)
- `trigger_check_daily_goal()` - Auto-checks daily nutrition goals
- `trigger_award_referral_points()` - Awards 25 pts on referral completion
- `trigger_refresh_leaderboard()` - Refreshes materialized view when points change ≥10
- `update_posts_count()` - Maintains cached posts_count
- `update_conversation_last_message()` - Updates conversation preview

---

## Critical Implementation Rules

### 1. Data Fetching - ALWAYS Use TanStack Query

**CRITICAL:** Never use `useState` + `useEffect` for data fetching. Always use TanStack Query.

```typescript
// ❌ WRONG - Manual state management
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
  fetchData().then(setData);
}, []);

// ✅ CORRECT - TanStack Query
const { data = [], isLoading, error } = useQuery({
  queryKey: queryKeys.diaryEntries(date),
  queryFn: async () => {
    const { data, error } = await supabase.rpc('get_diary_entries_for_date', {
      p_date: date
    });
    if (error) throw error;
    return data || [];
  },
});
```

**Query Keys:** Use centralized factory from `lib/queryKeys.ts`:
```typescript
queryKeys.weightHistory()
queryKeys.diaryEntries(date)
queryKeys.posts()
queryKeys.leaderboard(limit)
queryKeys.userChallenges()
```

### 2. Database Migrations - Always Use CLI

**CRITICAL:** Never run SQL directly in Dashboard without tracking.

**Production-Grade Workflow:**
```bash
# 1. Create migration
npx supabase migration new description

# 2. Write SQL in generated file
# supabase/migrations/YYYYMMDDHHMMSS_description.sql

# 3. Apply migration (automatically tracks)
npx supabase db push

# 4. Update CURRENT_DATABASE_STATE.md
```

**Benefits:**
- ✅ Automatic migration tracking (prevents duplicate runs)
- ✅ Applies migrations in correct order
- ✅ Team-ready (other devs can sync with `npx supabase db pull`)
- ✅ No manual copy/paste to SQL Editor

### 3. Function Signatures - Always DROP Before Changing

**CRITICAL:** `CREATE OR REPLACE` only works for **identical signatures**. Adding/removing parameters creates a new function (overloading).

```sql
-- ❌ WRONG - Creates overloaded version
CREATE OR REPLACE FUNCTION get_posts(limit INT, offset INT) ...

-- ✅ CORRECT - Drop old versions first
DROP FUNCTION IF EXISTS public.get_posts(INT);
DROP FUNCTION IF EXISTS public.get_posts(limit_param INT);
DROP FUNCTION IF EXISTS public.get_posts(INT, INT);

CREATE OR REPLACE FUNCTION public.get_posts(
  limit_param INT DEFAULT 20,
  offset_param INT DEFAULT 0
) ...
```

**Why:** Prevents PGRST203 errors (function name not unique).

### 4. Table Aliases - Always Use to Avoid Ambiguity

**CRITICAL:** Always use table aliases in SQL to prevent ambiguous column references.

```sql
-- ❌ WRONG - Ambiguous columns
UPDATE posts SET like_count = like_count + 1 WHERE id = post_id;

-- ✅ CORRECT - Explicit table aliases
UPDATE posts p SET like_count = p.like_count + 1 WHERE p.id = post_id;
```

### 5. Point Awards - Always Use award_points()

**CRITICAL:** Never award points directly via client. Always use `award_points()` RPC function.

```typescript
// ❌ WRONG - Direct update
await supabase
  .from('profiles')
  .update({ points: user.points + 10 })
  .eq('id', userId);

// ✅ CORRECT - award_points() RPC
await supabase.rpc('award_points', {
  p_user_id: userId,
  p_points_amount: 10,
  p_reason: 'daily_goal_achievement',
  p_metadata: { date: '2025-12-26', progress: 95.5 }
});
```

**Why:**
- Logs to points_history for audit trail
- Updates cached rank atomically
- Prevents race conditions
- Triggers leaderboard refresh

### 6. Column Names - posts.author_id NOT user_id

**CRITICAL:** The `posts` table uses `author_id`, not `user_id`.

```sql
-- ❌ WRONG
SELECT * FROM posts WHERE user_id = ...

-- ✅ CORRECT
SELECT * FROM posts p WHERE p.author_id = ...
```

**Why:** Historical naming decision. All triggers and functions use `author_id`.

### 7. Storage Policies - Must Use Dashboard UI

**CRITICAL:** Storage policies CANNOT be created via SQL Editor (permission error).

**Method:** Supabase Dashboard → Storage → Bucket → Policies → New Policy

**Required Policies:**
- INSERT: Authenticated users can upload
- SELECT: Public read access
- UPDATE: Users can update own uploads
- DELETE: Users can delete own uploads

See `docs/MANUAL_STORAGE_POLICY_SETUP.md` for step-by-step instructions.

### 8. Goal Recalculation - Use Pure Function

**CRITICAL:** Always use `calculateUserGoals()` from `goalCalculator.ts` for TDEE/BMR/macro calculations.

```typescript
import { calculateUserGoals } from '@/modules/onboarding/services/goalCalculator';

// 1. Recalculate goals
const goals = calculateUserGoals({
  dateOfBirth,
  gender,
  heightCm,
  currentWeightKg,
  goalWeightKg,
  activityLevel,
  goalType,
  goalRateKgPerWeek,
});

// 2. Update database
await supabase
  .from('profiles')
  .update(goals)
  .eq('id', userId);

// 3. Update Zustand store
useUserStore.getState().updateProfile(goals);
```

**Why:** Pure function with no database dependencies, consistent calculations, testable.

### 9. Rate Limiting - Implemented in Database

**CRITICAL:** Rate limits are enforced by database triggers, not client code.

**Examples:**
- Post creation: Max 10 posts/day earn points (trigger checks `posts_today`)
- Daily goal check: Once per day (trigger checks `last_daily_goal_check`)
- Message sending: 30 messages/minute (RPC function validation)

**Why:** Prevents gaming, can't be bypassed by client, atomic enforcement.

### 10. Never SELECT COUNT(*) on Large Tables

**CRITICAL:** Always use cached counts or materialized views.

```sql
-- ❌ WRONG - Slow on large tables
SELECT COUNT(*) FROM posts WHERE author_id = user_id;

-- ✅ CORRECT - Use cached count
SELECT posts_count FROM profiles WHERE id = user_id;
```

**Pattern:**
1. Add count column to table (e.g., `posts_count`, `follower_count`)
2. Update via trigger on INSERT/DELETE
3. Use `GREATEST(0, count - 1)` to prevent negative counts

---

## Data Fetching Patterns

### Query Pattern (useQuery)

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { supabase } from '@/lib/supabase';

const { data = [], isLoading, error, refetch } = useQuery({
  queryKey: queryKeys.diaryEntries(dateString),
  queryFn: async () => {
    const { data, error } = await supabase.rpc('get_diary_entries_for_date', {
      p_date: dateString
    });
    if (error) throw error;
    return data || [];
  },
  enabled: !!dateString, // Optional: conditional fetching
});
```

### Mutation Pattern (useMutation)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const { mutate: logWeight, isPending } = useMutation({
  mutationFn: async (weightKg: number) => {
    const { data, error } = await supabase.rpc('log_or_update_weight', {
      p_weight_kg: weightKg
    });
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    // Invalidate related queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: queryKeys.weightHistory() });
  },
});
```

### Optimistic Update Pattern

```typescript
const { mutate: toggleLike } = useMutation({
  mutationFn: async () => {
    const { data, error } = await supabase.rpc('toggle_like', {
      post_id_to_toggle: post_id
    });
    if (error) throw error;
    return data;
  },
  onMutate: async () => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.posts() });

    // Snapshot previous value
    const previousData = queryClient.getQueryData(queryKeys.posts());

    // Optimistically update UI
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    return { previousData };
  },
  onError: (error, variables, context) => {
    // Rollback on error
    if (context) {
      setIsLiked(!isLiked);
      setLikeCount(context.previousLikeCount);
    }
  },
  onSuccess: () => {
    // Invalidate to get server truth
    queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
  },
});
```

### Pull-to-Refresh Pattern

```typescript
const onRefresh = useCallback(async () => {
  setRefreshing(true);
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.diaryEntries(date) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.nutritionSummary(date) }),
  ]);
  setRefreshing(false);
}, [date, queryClient]);
```

---

## Migration Workflow

### Creating New Migration

```bash
# 1. Create migration file
npx supabase migration new add_feature_name

# 2. Edit generated SQL file
# supabase/migrations/YYYYMMDDHHMMSS_add_feature_name.sql

# 3. Apply migration
npx supabase db push

# 4. Update documentation
# Edit docs/CURRENT_DATABASE_STATE.md
```

### Migration File Template

```sql
-- =====================================================
-- MIGRATION: Add Feature Name
-- =====================================================
-- Purpose: [What this migration does]
-- Applied: YYYY-MM-DD

-- [1] Drop existing functions if changing signatures
DROP FUNCTION IF EXISTS public.function_name(UUID);
DROP FUNCTION IF EXISTS public.function_name(UUID, INT);

-- [2] Create or replace function
CREATE OR REPLACE FUNCTION public.function_name(
  p_param1 UUID,
  p_param2 INTEGER DEFAULT 0
)
RETURNS TABLE (
  result_column TYPE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_variable TYPE;
BEGIN
  -- Function logic with table aliases
  SELECT col INTO v_variable FROM table_name t WHERE t.id = p_param1;

  RETURN QUERY SELECT ...;
END;
$$;

-- [3] Add comment
COMMENT ON FUNCTION public.function_name(UUID, INTEGER) IS
  'Description of what this function does';
```

### Common Migration Patterns

**Add Column:**
```sql
ALTER TABLE public.profiles
  ADD COLUMN new_column TEXT DEFAULT 'value';
```

**Create Index:**
```sql
CREATE INDEX idx_table_column ON public.table_name(column_name);
```

**Create Trigger:**
```sql
CREATE TRIGGER trigger_name
  AFTER INSERT ON public.table_name
  FOR EACH ROW
  EXECUTE FUNCTION trigger_function_name();
```

---

## Common Code Patterns

### 1. Navigation with Expo Router

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/(modals)/profile');

// Navigate with params
router.push(`/post/${postId}`);
router.push(`/user/${userId}`);

// Go back
router.back();
```

### 2. Single-Tap vs Double-Tap Detection

```typescript
const navigationTimeout = React.useRef<NodeJS.Timeout | null>(null);

// Single tap - navigate after 300ms
const handleSingleTap = () => {
  navigationTimeout.current = setTimeout(() => {
    router.push(`/post/${postId}`);
  }, 300);
};

// Double tap - like and cancel navigation
const handleDoubleTap = () => {
  if (navigationTimeout.current) {
    clearTimeout(navigationTimeout.current);
    navigationTimeout.current = null;
  }
  // Trigger like
  toggleLike();
};
```

### 3. Supabase RPC Call Pattern

```typescript
const { data, error } = await supabase.rpc('function_name', {
  p_param1: value1,
  p_param2: value2,
});

if (error) {
  console.error('Error:', error);
  throw error;
}

return data || [];
```

### 4. Conditional Rendering with Loading States

```typescript
if (isLoading) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#10B981" />
      <Text className="text-gray-400 mt-2">Loading...</Text>
    </View>
  );
}

if (error) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-red-500 text-center">{error.message}</Text>
    </View>
  );
}

// Render data
return <View>...</View>;
```

### 5. Theme-Aware Styling

```typescript
import { useColorScheme } from 'nativewind';

const { colorScheme } = useColorScheme();
const isDark = colorScheme === 'dark';

<View className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
  <Text className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
    Content
  </Text>
</View>
```

---

## Important Lessons Learned

### From `applied_fixes.md`:

**1. Function Overloading (PGRST203 Error)**
- **Problem:** `CREATE OR REPLACE` doesn't work when changing function signatures
- **Solution:** Always `DROP FUNCTION IF EXISTS` before creating functions with new signatures
- **Prevention:** Add DROP statements to migration files

**2. Column Name Consistency**
- **Problem:** `posts` table uses `author_id` but triggers tried to use `user_id`
- **Solution:** Verify column names in existing schema before writing triggers
- **Prevention:** Reference `CURRENT_DATABASE_STATE.md` before writing SQL

**3. Storage Policies Require Dashboard UI**
- **Problem:** SQL Editor lacks permissions on `storage.objects` table
- **Solution:** Create policies via Supabase Dashboard UI
- **Documentation:** `MANUAL_STORAGE_POLICY_SETUP.md` for step-by-step

**4. Profile Auto-Creation**
- **Problem:** Users created before trigger existed lacked profiles
- **Solution:** Created `handle_new_user()` trigger + backfilled existing users
- **Prevention:** All new users automatically get profiles

**5. Migration Timestamps**
- **Problem:** Manual timestamps caused duplicate key errors
- **Solution:** Always use `npx supabase migration new` to generate unique timestamps
- **Prevention:** Never manually create migration files

**6. Rate Limiting in Triggers**
- **Problem:** Users could game points by creating unlimited posts
- **Solution:** Trigger checks `posts_today` before awarding points (max 10/day)
- **Pattern:** Rate limiting belongs in database, not client code

**7. COMMENT ON FUNCTION Signatures**
- **Problem:** Function comments need exact signature including parameter types
- **Solution:** `COMMENT ON FUNCTION func(UUID, INTEGER) IS 'Description';`
- **Prevention:** Always specify full signature when commenting

**8. Instagram-Like UX**
- **Problem:** Follow button on post headers confused users
- **Solution:** Follow button only on profile pages, not post headers
- **Pattern:** Match user expectations from familiar apps

---

## Future Enhancements

### Version 2 Features (Documented in `FEATURE_PROMPTS.md` Section 2.4)

**Tier 1: Quick Wins (1-3 days each)**
1. **Badges & Achievement System** - Visual rewards for milestones
2. **Points Redemption Store** - Redeem points for premium features
3. **Weekly/Monthly Competitions** - Time-limited leaderboards
4. **Profile Points History UI** - Transaction log visualization

**Tier 2: Medium Effort (3-7 days each)**
5. **User-Created Challenges** - Community-generated challenges
6. **Team Challenges** - Group competitions
7. **Workout Tracking with Points** - Exercise logging
8. **Advanced Analytics Dashboard** - Premium feature
9. **Push Notifications** - Milestone celebrations
10. **Referral System Enhancements** - Viral growth features

**Tier 3: Advanced Features (7+ days each)**
11. **AI-Powered Challenges** - Personalized recommendations
12. **Seasonal Events** - Limited-time offers
13. **Premium Subscription Integration** - Multi-tier monetization
14. **Social Challenge Marketplace** - Bet points on challenges
15. **Fitness Coach Integration** - 1-on-1 coaching

### Recommended Next 3 Features
1. **Badges & Achievement System** (2-3 days)
2. **Points Redemption Store** (3-4 days)
3. **Weekly Competitions** (2-3 days)

See `docs/FEATURE_PROMPTS.md` for copy-paste prompts to implement each feature.

---

## Success Metrics

Track these to measure app performance:
- **Daily Active Users (DAU)** - Target: 20-30% increase post-gamification
- **Retention Rate** - Day 7, Day 30 retention
- **Average Session Length** - Should increase with engagement features
- **Points Earned Per User** - Engagement metric
- **Challenge Completion Rate** - Quality metric
- **Leaderboard Query Performance** - Target: <10ms (materialized view)
- **Revenue** - From point purchases, premium subscriptions (future)

---

## Quick Reference Commands

### Development
```bash
npm start                    # Start Expo dev server
npm run android             # Run on Android
npm run ios                 # Run on iOS
npm run test                # Run Jest tests
npm run lint                # Run ESLint
```

### Database
```bash
npx supabase migration new description  # Create migration
npx supabase db push                   # Apply migrations
npx supabase db pull                   # Pull remote changes
```

### Building
```bash
eas build --platform android  # Build Android APK
eas build --platform ios      # Build iOS IPA
eas build --platform all      # Build both
```

---

## Essential Documentation Files

**Start here for AI agents:**
1. **APP_REPORT.md** (this file) - Complete app overview
2. **CURRENT_DATABASE_STATE.md** - Full database schema (1,755 lines)
3. **CLAUDE.md** - Developer guide with rules and patterns
4. **README.md** - Project overview and getting started

**Implementation guides:**
5. **TANSTACK_QUERY_GUIDE.md** - Data fetching patterns (1,098 lines)
6. **MIGRATION_WORKFLOW.md** - Database migration workflow
7. **FEATURE_PROMPTS.md** - Copy-paste prompts for new features
8. **ARCHITECTURE_DECISIONS.md** - Design rationale

**Reference:**
9. **applied_fixes.md** - Manual changes and lessons learned
10. **POINTS_SYSTEM_IMPLEMENTATION_GUIDE.md** - Points system spec

---

## Contact & Support

**Project:** FitnessApp (Production)
**Supabase Project ID:** `oswlhrzarxjpyocgxgbr`
**Platform:** React Native (Expo SDK 52)
**Database:** Supabase PostgreSQL

**For Questions:**
- Review this APP_REPORT.md first
- Check CURRENT_DATABASE_STATE.md for database schema
- Consult CLAUDE.md for implementation rules
- Reference applied_fixes.md for common issues

---

**End of Report**

This document provides complete context for AI agents to understand the FitnessApp architecture, features, and implementation patterns. Always refer to linked documentation files for detailed specifications.
