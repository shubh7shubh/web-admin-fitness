# Implementation Status - January 2026

> **Last Updated:** January 15, 2026
> **Purpose:** Track actual vs planned implementation status for web admin panel and premium features

## Summary

This document tracks what has been **actually implemented** vs what is documented in planning docs like `WEB_ADMIN_PANEL.md` and `WEB_PREMIUM_IMPLEMENTATION_GUIDE.md`.

---

## Database Schema - Actual vs Documented

### ✅ profiles Table (ACTUAL)

**Current schema in production:**
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  follower_count INTEGER DEFAULT 0 NOT NULL,
  following_count INTEGER DEFAULT 0 NOT NULL,
  posts_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Fields that exist:**
- ✅ `id, username, avatar_url, bio, points`
- ✅ `follower_count, following_count, posts_count`
- ✅ `created_at, updated_at`

**Fields documented but NOT implemented:**
- ❌ `is_admin` - Not in production schema
- ❌ `is_banned` - Not in production schema
- ❌ `rank` - Not in production schema
- ❌ `email` - Stored in auth.users table only
- ❌ `full_name` - Not in production schema
- ❌ `subscription_tier` - Not in profiles table (see note below)

**Note on subscription_tier:**
- Was added to profiles table for premium features
- Not confirmed in CURRENT_DATABASE_STATE.md profiles schema
- Used in get_user_premium_status RPC function
- Actual location needs verification

---

## Premium Features - Implementation Status

### ✅ Premium Assessment Form

**Implemented fields (17 total):**

**Base Fields (10):**
1. ✅ fitness_goals
2. ✅ dietary_preferences
3. ✅ health_conditions
4. ✅ activity_level
5. ✅ meal_frequency
6. ✅ favorite_foods
7. ✅ foods_to_avoid
8. ✅ workout_experience
9. ✅ available_equipment
10. ✅ time_availability

**Workout-Specific Fields (7):**
11. ✅ workout_days_per_week
12. ✅ preferred_workout_split
13. ✅ primary_workout_goal (REQUIRED)
14. ✅ cardio_preference (REQUIRED)
15. ✅ workout_limitations
16. ✅ workout_environment (REQUIRED)
17. ✅ preferred_workout_time

**Fields removed (were in old docs but NOT in DB):**
- ❌ age
- ❌ gender
- ❌ current_weight_kg
- ❌ target_weight_kg
- ❌ preferred_workout_type (replaced with preferred_workout_split)
- ❌ injuries_limitations (replaced with workout_limitations)

### ✅ Diet Plans & Workout Plans

**diet_plans table:**
```sql
CREATE TABLE public.diet_plans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,         -- ✅ REQUIRED
  start_date DATE NOT NULL,         -- ✅ REQUIRED
  duration_weeks INTEGER NOT NULL,  -- ✅ REQUIRED
  plan_data JSONB NOT NULL,         -- ✅ Correct field name
  is_active BOOLEAN NOT NULL,       -- ✅ REQUIRED
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**workout_plans table:**
```sql
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,         -- ✅ REQUIRED
  start_date DATE NOT NULL,         -- ✅ REQUIRED
  duration_weeks INTEGER NOT NULL,  -- ✅ REQUIRED
  routine_data JSONB NOT NULL,      -- ✅ Correct field name (NOT plan_data)
  is_active BOOLEAN NOT NULL,       -- ✅ REQUIRED
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Unique Constraints:**
- ❌ NO unique constraint on `user_id` alone
- ✅ Partial unique index: `idx_one_active_diet_plan_per_user` on `(user_id) WHERE is_active = true`
- ✅ Partial unique index: `idx_one_active_workout_plan_per_user` on `(user_id) WHERE is_active = true`

**Implementation notes:**
- Cannot use `.upsert({ ... }, { onConflict: "user_id" })` - will fail
- Must use deactivate-then-insert pattern:
  1. UPDATE existing plans SET is_active = false
  2. INSERT new plan with is_active = true

### ✅ RPC Functions

**Implemented and working:**
1. ✅ `submit_premium_assessment(10 params)` - Creates/updates assessment
2. ✅ `get_user_premium_status()` - Returns 4-state gatekeeper logic
3. ✅ `get_active_diet_plan()` - Returns diet plan with plan_data
4. ✅ `get_active_workout_plan()` - Returns workout plan with routine_data

**Note:** Web app uses RPC functions directly (matches Expo app implementation)

---

## Admin Panel - Implementation Status

### ✅ Premium Testing Panel

**Implemented:**
- ✅ User search by username
- ✅ 4-state testing (upsell, needs_assessment, pending, active)
- ✅ Manual diet plan creation
- ✅ Manual workout plan creation
- ✅ Delete plans functionality
- ✅ Set user premium state

**Files:**
- ✅ `apps/admin/app/premium-testing/page.tsx`
- ✅ `apps/admin/app/premium-testing/[userId]/page.tsx`
- ✅ `apps/admin/app/api/premium-testing/get-user-status/route.ts`
- ✅ `apps/admin/app/api/premium-testing/set-user-state/route.ts`
- ✅ `apps/admin/app/api/premium-testing/create-diet-plan/route.ts`
- ✅ `apps/admin/app/api/premium-testing/create-workout-plan/route.ts`
- ✅ `apps/admin/app/api/premium-testing/delete-plans/route.ts`

### ✅ Users Section

**Implemented:**
- ✅ List all users (100 limit)
- ✅ Search by username
- ✅ Click-to-copy usernames
- ✅ Display: username, points, followers, posts
- ✅ View user details (links to /users/[id])

**NOT Implemented:**
- ❌ Admin management (no is_admin column)
- ❌ Ban/unban users (no is_banned column)
- ❌ Email display (not in profiles table)

**Actual columns displayed:**
- Username (with avatar, click-to-copy)
- Points
- Followers (follower_count)
- Posts (posts_count)

**Files:**
- ✅ `apps/admin/app/users/page.tsx` - User list
- ⚠️ `apps/admin/app/users/[id]/page.tsx` - User detail (may reference non-existent fields)

---

## Web App - Premium Implementation

### ✅ Premium Assessment

**File:** `apps/web/app/(app)/premium/assessment/page.tsx`

**Status:** ✅ Fully implemented with correct 17 fields
- Calls `submit_premium_assessment()` RPC directly
- Validates using Zod schema with correct field types
- Redirects to `/premium` after submission

### ✅ Premium Gatekeeper

**File:** `apps/web/app/(app)/premium/page.tsx`

**Status:** ✅ Fully implemented with 4 states
1. **Upsell** - Free users (subscription_tier = 'free')
2. **Needs Assessment** - Premium users without assessment
3. **Pending** - Assessment submitted, plans being created
4. **Active** - Full access to diet/workout plans

### ✅ Diet Plan View

**File:** `apps/web/components/premium/DietPlanView.tsx`

**Status:** ✅ Implemented
- Uses `get_active_diet_plan()` RPC
- Displays weeks/days/meals from `plan_data` JSONB

### ✅ Workout Plan View

**File:** `apps/web/components/premium/WorkoutPlanView.tsx`

**Status:** ✅ Fixed (Jan 15, 2026)
- Uses `get_active_workout_plan()` RPC
- **IMPORTANT:** Accesses `routine_data` field (NOT `plan_data`)
- Displays weeks/days/exercises

---

## Known Issues & Limitations

### ❌ Admin Features Not Implemented

The following features are documented in `WEB_ADMIN_PANEL.md` but NOT implemented:

1. **Admin Role Management**
   - No `is_admin` column in profiles table
   - No admin authentication check
   - No admin-only RLS policies
   - Admin panel is accessible to anyone with the URL

2. **User Banning**
   - No `is_banned` column in profiles table
   - Cannot ban/unban users from admin panel

3. **Blog CMS**
   - No `blog_articles` table
   - No blog management interface
   - Documented in WEB_ADMIN_PANEL.md but not implemented

### ⚠️ Documentation Discrepancies

**Files that need updates:**
1. `WEB_ADMIN_PANEL.md` - References is_admin, is_banned columns that don't exist
2. `WEB_PREMIUM_IMPLEMENTATION_GUIDE.md` - May have outdated field references

**Recommended action:**
- Add disclaimers that is_admin/is_banned are planned but not implemented
- OR remove these sections entirely if not planned
- Update schema examples to match actual production schema

---

## Deployment Checklist

### Before deploying premium features:

- [x] ✅ Verify all 17 assessment fields exist in database
- [x] ✅ Test all 4 premium states (upsell, needs_assessment, pending, active)
- [x] ✅ Verify RPC functions work correctly
- [x] ✅ Test diet plan creation with required fields
- [x] ✅ Test workout plan creation with required fields
- [x] ✅ Verify WorkoutPlanView uses routine_data field
- [x] ✅ Verify DietPlanView uses plan_data field
- [ ] ⚠️ Add admin authentication (currently open to anyone)
- [ ] ⚠️ Implement is_admin column if admin features needed
- [ ] ⚠️ Implement is_banned column if user banning needed

---

## File Locations - Quick Reference

### Admin Panel
```
apps/admin/
├── app/
│   ├── premium-testing/           ✅ Implemented
│   │   ├── page.tsx
│   │   ├── [userId]/page.tsx
│   │   └── components/
│   ├── users/                     ✅ Implemented (basic)
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── api/
│       └── premium-testing/       ✅ All routes working
│           ├── get-user-status/
│           ├── set-user-state/
│           ├── create-diet-plan/
│           ├── create-workout-plan/
│           └── delete-plans/
```

### Web App Premium
```
apps/web/
├── app/(app)/premium/
│   ├── page.tsx                   ✅ Gatekeeper logic
│   └── assessment/
│       └── page.tsx               ✅ 17-field form
├── components/premium/
│   ├── DietPlanView.tsx          ✅ Uses plan_data
│   ├── WorkoutPlanView.tsx       ✅ Uses routine_data
│   └── PlanDashboard.tsx         ✅ Tab switcher
├── lib/hooks/
│   ├── usePremiumStatus.ts       ✅ RPC call
│   ├── useDietPlan.ts            ✅ RPC call
│   └── useWorkoutPlan.ts         ✅ RPC call
└── shared/
    ├── types/premium.ts           ✅ Updated types
    └── validation/
        └── premiumAssessment.ts   ✅ 17 fields
```

---

## Next Steps

### High Priority
1. Add authentication to admin panel
2. Implement is_admin column if admin features needed
3. Update WEB_ADMIN_PANEL.md to reflect actual implementation

### Medium Priority
1. Add user rank calculation (currently null)
2. Implement user banning if needed
3. Add email display in admin (requires auth.users join)

### Low Priority
1. Blog CMS implementation (if needed)
2. Additional admin features from WEB_ADMIN_PANEL.md

---

**Last verified:** January 15, 2026
**Next review:** When adding new features or before major deployment
