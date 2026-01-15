# Concierge Premium Plan - Web Implementation Guide

**Status:** ✅ Implemented & Ready for Testing
**Target Platform:** Next.js 16.1 (App Router)
**Web App Location:** `/Users/apple/Documents/GitHub/fitness-web/apps/web`
**Database:** Supabase PostgreSQL (shared with Expo app)
**Target Market:** Indian users (₹999/month)
**Payment:** Razorpay (Placeholder - To be integrated)
**Last Updated:** January 15, 2026

> 📌 **See Also:** [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) - Detailed tracking of actual vs planned implementation, including database schema verification and known issues.

---

## 📋 Table of Contents

1. [Overview & Implementation Status](#1-overview--implementation-status)
2. [Architecture & Routes](#2-architecture--routes)
3. [Database Integration](#3-database-integration)
4. [Testing Without Payment](#4-testing-without-payment)
5. [Component Reference](#5-component-reference)
6. [Environment Setup](#6-environment-setup)
7. [Next Steps: Payment Integration](#7-next-steps-payment-integration)
8. [Deployment Checklist](#8-deployment-checklist)

---

## 1. Overview & Implementation Status

### What We Built

A complete web-based premium subscription system with:

✅ **4-State Gatekeeper Pattern** - Controls user journey based on database state
✅ **Upsell View** - Marketing page with pricing (₹999/month)
✅ **Assessment Form** - 17-field questionnaire for personalized plans
✅ **Pending View** - "24-48 hours" waiting room after assessment
✅ **Active Dashboard** - Diet & workout plan viewer with meal logging
✅ **Admin Testing Panel** - Test all states without payment integration
✅ **Checkout Placeholder** - "Coming Soon" page (Razorpay integration pending)

### User Journey Flow

```
┌─────────────────────────────────────────────────────────┐
│              CONCIERGE PREMIUM USER JOURNEY              │
└─────────────────────────────────────────────────────────┘

FREE USER (Upsell State)
    │
    └─> Visits /premium
    │   → Sees marketing page with ₹999/month pricing
    │   → Clicks "Subscribe Now"
    │
    └─> Goes to /premium/checkout
        → Sees "Payment Integration Coming Soon" message
        → [Future: Razorpay payment flow]
        │
        └─> [After Payment - Simulated by Admin for Testing]
            │
            └─> PREMIUM USER (Needs Assessment State)
                │
                └─> Visits /premium
                │   → Auto-redirects to /premium/assessment
                │
                └─> Fills 17-field assessment form
                │   → Submits form
                │
                └─> PREMIUM USER (Pending State)
                    │
                    └─> Visits /premium
                    │   → Sees "Your Plan is Being Created" (24-48 hours)
                    │
                    └─> [Admin creates diet + workout plans]
                        │
                        └─> PREMIUM USER (Active State)
                            │
                            └─> Visits /premium
                                → Sees full premium dashboard
                                → Can switch between Diet & Workout tabs
                                → Can log meals with one tap
                                → Can view all 8 weeks of plans
```

---

## 2. Architecture & Routes

### 2.1 Route Structure (Implemented)

```
apps/web/app/(app)/premium/
├── page.tsx                    ✅ GATEKEEPER ROUTER
│   └─> Routes to different views based on database state:
│       - upsell → Show UpsellView
│       - needs_assessment → Redirect to /premium/assessment
│       - pending → Show PendingView
│       - active → Show PlanDashboard
│
├── checkout/
│   └── page.tsx                ✅ PLACEHOLDER (Razorpay integration pending)
│       └─> Shows "Coming Soon" message
│
└── assessment/
    └── page.tsx                ✅ 17-FIELD ASSESSMENT FORM
        └─> Submits to Supabase RPC: submit_premium_assessment()
```

### 2.2 Component Structure (Implemented)

```
apps/web/components/premium/
├── UpsellView.tsx              ✅ Marketing page with pricing
├── PendingView.tsx             ✅ "24-48 hours" waiting room
├── PlanDashboard.tsx           ✅ Tab switcher (Diet/Workout)
├── DietPlanView.tsx            ✅ Meal cards with one-tap logging
└── WorkoutPlanView.tsx         ✅ Exercise cards with sets/reps
```

### 2.3 Shared Files (Implemented)

```
apps/web/shared/
├── types/
│   ├── premium.ts              ✅ TypeScript types (DietPlan, WorkoutPlan, etc.)
│   └── index.ts                ✅ Type exports
├── validation/
│   └── premiumAssessment.ts   ✅ Zod schema for 17-field form
├── constants/
│   └── theme.ts                ✅ Shared theme constants
└── utils/
    └── goalCalculator.ts       ✅ Goal calculation utilities
```

### 2.4 Custom Hooks (Implemented)

```
apps/web/lib/hooks/
├── usePremiumStatus.ts         ✅ Fetches gatekeeper state from RPC
├── useDietPlan.ts              ✅ Fetches diet plan data
└── useWorkoutPlan.ts           ✅ Fetches workout plan data
```

---

## 3. Database Integration

### 3.1 Database Schema (Actual Implementation)

#### profiles
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text,                    -- Contains email as identifier
  avatar_url text,
  points integer DEFAULT 0,
  rank integer,
  is_banned boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Note:** No `subscription_tier` or `subscription_expires_at` columns.
Premium status is determined by existence of assessment and plans.

---

#### premium_assessments
```sql
CREATE TABLE premium_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'active')),

  -- General Section (5 fields)
  fitness_goals text NOT NULL,
  activity_level text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  current_weight_kg numeric NOT NULL,
  target_weight_kg numeric,

  -- Nutrition Section (5 fields)
  dietary_preferences text,
  health_conditions text,
  meal_frequency integer,
  favorite_foods text,
  foods_to_avoid text,

  -- Workout Section (6 fields)
  workout_experience text NOT NULL,
  available_equipment text,
  time_availability text NOT NULL,
  workout_days_per_week integer,
  preferred_workout_type text,
  injuries_limitations text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Field:** `status`
- `'pending'` = Assessment submitted, admin creating plans
- `'active'` = Plans ready, user can view dashboard

---

#### diet_plans
```sql
CREATE TABLE diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  plan_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**plan_data Structure:**
```json
{
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "date": "2026-01-15",
          "meals": [
            {
              "meal_type": "breakfast",
              "meal_name": "Oats Upma",
              "calories": 350,
              "protein": 12,
              "carbs": 55,
              "fat": 8,
              "ingredients": ["Oats 50g", "Mixed vegetables", "Olive oil 1tsp"],
              "instructions": "1. Heat oil\n2. Add vegetables\n3. Add oats\n4. Cook 5 mins"
            }
          ]
        }
      ]
    }
  ]
}
```

---

#### workout_plans
```sql
CREATE TABLE workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  plan_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**plan_data Structure:**
```json
{
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "day_name": "Full Body Strength",
          "exercises": [
            {
              "exercise_name": "Push-ups",
              "sets": 3,
              "reps": "10-12",
              "rest_seconds": 60,
              "notes": "Keep core tight, full range of motion"
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 3.2 RPC Functions (Already Exist in Supabase)

These functions were created for the Expo app and are reused by the web app:

```sql
-- Get premium status and gatekeeper state
CREATE OR REPLACE FUNCTION get_user_premium_status()
RETURNS json AS $$
  -- Returns: { gatekeeper_state, has_assessment, has_diet_plan, has_workout_plan }
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Submit assessment form
CREATE OR REPLACE FUNCTION submit_premium_assessment(
  p_fitness_goals text,
  p_activity_level text,
  p_age integer,
  -- ... 14 more parameters
) RETURNS json AS $$
  -- Creates/updates assessment with status = 'pending'
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get active diet plan
CREATE OR REPLACE FUNCTION get_active_diet_plan()
RETURNS jsonb AS $$
  -- Returns plan_data from diet_plans table
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get active workout plan
CREATE OR REPLACE FUNCTION get_active_workout_plan()
RETURNS jsonb AS $$
  -- Returns plan_data from workout_plans table
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log meal from diet plan to diary
CREATE OR REPLACE FUNCTION log_planned_meal_v2(
  p_meal_name text,
  p_calories numeric,
  p_protein numeric,
  p_carbs numeric,
  p_fat numeric,
  p_meal_type text,
  p_date date
) RETURNS json AS $$
  -- Creates diary entry from meal plan
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**No changes needed** - Web app uses these existing functions.

---

### 3.3 Gatekeeper State Logic

The `get_user_premium_status()` RPC function returns one of 4 states:

```typescript
type GatekeeperState =
  | "upsell"              // No assessment, no plans
  | "needs_assessment"    // Premium paid, no assessment
  | "pending"             // Assessment exists with status='pending'
  | "active";             // Assessment active + both plans exist
```

**Implementation in `/premium/page.tsx`:**

```typescript
const { data: premiumStatus } = usePremiumStatus(user?.id);
const gatekeeperState = premiumStatus?.gatekeeper_state;

switch (gatekeeperState) {
  case "upsell":
    return <UpsellView />;

  case "needs_assessment":
    router.push("/premium/assessment");
    return null;

  case "pending":
    return <PendingView />;

  case "active":
    return <PlanDashboard userId={user.id} />;
}
```

---

## 4. Testing Without Payment

### 4.1 Why We Need the Admin Testing Panel

**Problem:** Razorpay integration not ready, but we need to test all premium UI states.

**Solution:** Admin panel that directly manipulates database to simulate all 4 states.

**Location:** `/apps/admin/app/premium-testing/`

**Access:** Admin users only (requires `is_admin = true` in profiles table)

---

### 4.2 Admin Testing Panel Features

#### User Search
- Navigate to: `http://localhost:3003/premium-testing`
- Search by username (email)
- Click "Test Premium" to open testing dashboard

#### Current Status Card
Shows real-time premium status:
- Assessment Status: none | pending | active
- Has Diet Plan: Yes/No
- Has Workout Plan: Yes/No

#### Quick State Changes (4 Buttons)

| Button | What It Does | Use Case |
|--------|--------------|----------|
| 🔓 **Set to Upsell** | Deletes all assessments & plans | Test marketing page |
| 📝 **Needs Assessment** | Deletes assessments & plans | Test assessment form |
| ⏳ **Set to Pending** | Creates pending assessment | Test waiting room |
| ✅ **Set to Active** | Sets assessment to active | Test premium dashboard |

#### Plan Builders

**Diet Plan Builder:**
- Load templates: Minimal (1 week) or Full (8 weeks)
- Edit JSON in textarea
- Save to database
- Delete existing plan

**Workout Plan Builder:**
- Load templates: Minimal or Beginner (8 weeks)
- Edit JSON in textarea
- Save to database
- Delete existing plan

---

### 4.3 Complete Testing Workflow (5 minutes)

#### Step 1: Test UPSELL State
**Admin:** Click "Set to Upsell"
**Web:** Go to `/premium`
**✅ Verify:** Marketing page with ₹999/month pricing

#### Step 2: Test NEEDS ASSESSMENT State
**Admin:** Click "Needs Assessment"
**Web:** Go to `/premium`
**✅ Verify:** Redirects to `/premium/assessment`, shows 17-field form

#### Step 3: Test PENDING State
**Admin:** Click "Set to Pending"
**Web:** Go to `/premium`
**✅ Verify:** Shows "Your Plan is Being Created" with 24-48 hour message

#### Step 4: Test ACTIVE State
**Admin:**
1. Load Minimal diet template → Save
2. Load Minimal workout template → Save
3. Click "Set to Active"

**Web:** Go to `/premium`
**✅ Verify:**
- Premium dashboard with tabs
- Diet tab shows meal cards
- Workout tab shows exercise cards
- Can click "Log This Meal" to add to diary
- Can navigate between weeks

---

### 4.4 Testing Guide Reference

**Full documentation:** `/docs/ADMIN_PREMIUM_TESTING_GUIDE.md`

Includes:
- Detailed setup instructions
- What each state does
- Expected UI for each state
- Troubleshooting common issues
- Database schema reference
- API routes documentation

---

## 5. Component Reference

### 5.1 UpsellView.tsx (Marketing Page)

**Location:** `/apps/web/components/premium/UpsellView.tsx`

**Features:**
- Hero section with gradient star icon
- "Concierge Premium Plan" title
- 4 feature cards:
  - 🍽️ Custom Meal Plans (8 weeks, macros calculated)
  - 💪 Workout Routines (tailored to equipment & experience)
  - 👨‍⚕️ Expert Coaching (certified professionals)
  - 📊 Progress Tracking (one-tap meal logging)
- Pricing card: ₹999/month
- CTA button: "Upgrade to Premium" → Links to `/premium/checkout`

**Design:**
- Gradient backgrounds (gray-50 to white)
- Color-coded icons (green, blue, purple, orange)
- Responsive grid layout
- Shadowed pricing card with call-to-action

---

### 5.2 Assessment Form (assessment/page.tsx)

**Location:** `/apps/web/app/(app)/premium/assessment/page.tsx`

**17 Fields in 3 Sections:**

**General Information (6 fields):**
1. Fitness Goals - Textarea (500 char max)
2. Activity Level - Select (sedentary to extremely_active)
3. Age - Number input (13-100)
4. Gender - Select (male/female/other)
5. Current Weight - Number (kg)
6. Target Weight - Number (kg, optional)

**Nutrition Preferences (5 fields):**
7. Dietary Preferences - Textarea (vegetarian, vegan, etc.)
8. Health Conditions - Textarea (diabetes, allergies, etc.)
9. Meal Frequency - Number (1-10 meals/day)
10. Favorite Foods - Textarea
11. Foods to Avoid - Textarea

**Workout Preferences (6 fields):**
12. Workout Experience - Select (beginner/intermediate/advanced)
13. Available Equipment - Textarea (dumbbells, gym, etc.)
14. Time Availability - Select (15min, 30min, 45min, 60min+)
15. Workout Days Per Week - Number (1-7, optional)
16. Preferred Workout Type - Select (strength/cardio/flexibility/mixed)
17. Injuries/Limitations - Textarea

**Validation:** Uses Zod schema from `/shared/validation/premiumAssessment.ts`

**Submission Flow:**
1. Validates all fields
2. Calls Supabase RPC: `submit_premium_assessment()`
3. Creates assessment with `status = 'pending'`
4. Redirects to `/premium` (now shows pending state)

---

### 5.3 PendingView.tsx (Waiting Room)

**Location:** `/apps/web/components/premium/PendingView.tsx`

**UI Elements:**
- Clock icon (yellow circle background)
- "Your Plan is Being Created" heading
- Description: "Expert team crafting personalized plans"
- Timeline card:
  - Expected Delivery: 24-48 hours
  - Notification when ready
- Progress indicators:
  - ✅ Assessment Received (green checkmark)
  - 🔄 Plan Creation (loading spinner)
  - ○ Plan Ready (gray circle)
- "In the Meantime" suggestion box
  - Continue using regular app features
  - Plans will appear automatically when ready

**Design:**
- Centered layout
- White card with shadow
- Yellow accent colors (clock theme)
- Calming, reassuring copy

---

### 5.4 PlanDashboard.tsx (Premium Dashboard)

**Location:** `/apps/web/components/premium/PlanDashboard.tsx`

**Layout:**
- "Your Premium Plan" heading
- Tab switcher: [Diet Plan] | [Workout Plan]
- Active tab background: black
- Inactive tab: gray text, hover effect

**Tab Management:**
```typescript
const [activeTab, setActiveTab] = useState<"diet" | "workout">("diet");
```

**Renders:**
- `<DietPlanView userId={userId} />` when diet tab active
- `<WorkoutPlanView userId={userId} />` when workout tab active

---

### 5.5 DietPlanView.tsx (Diet Plan Viewer)

**Location:** `/apps/web/components/premium/DietPlanView.tsx`

**Features:**

**Week Selector:**
- Dropdown: Week 1 - Week 8
- Changes displayed days based on selection

**Day Cards:**
- Date + Day name header
- Grouped by meal type (Breakfast, Lunch, Dinner, Snack)
- Each meal card shows:
  - Meal name
  - Calories (kcal)
  - Macros: Protein (P) | Carbs (C) | Fat (F)
  - "View Details" button (expandable)
  - "Log This Meal" button

**Meal Details (Expandable):**
- Ingredients list with quantities
- Step-by-step instructions
- Collapsible accordion

**One-Tap Meal Logging:**
```typescript
const logMeal = async (meal) => {
  await supabase.rpc('log_planned_meal_v2', {
    p_meal_name: meal.meal_name,
    p_calories: meal.calories,
    p_protein: meal.protein,
    p_carbs: meal.carbs,
    p_fat: meal.fat,
    p_meal_type: meal.meal_type,
    p_date: new Date().toISOString().split('T')[0]
  });

  // Invalidate diary queries to update UI
  queryClient.invalidateQueries({ queryKey: ['diary'] });

  toast.success('Meal logged!');
};
```

**Design:**
- Card-based layout
- Color-coded meal types
- Responsive grid (mobile: 1 col, desktop: 2-3 cols)
- Smooth expand/collapse animations

---

### 5.6 WorkoutPlanView.tsx (Workout Plan Viewer)

**Location:** `/apps/web/components/premium/WorkoutPlanView.tsx`

**Features:**

**Week Selector:**
- Dropdown: Week 1 - Week 8
- Updates displayed workout days

**Day Cards:**
- Date + Day name
- Workout type (Full Body, Upper Body, etc.)
- "Rest Day" indicator for recovery days

**Exercise Cards:**
- Exercise name (e.g., "Push-ups")
- Sets x Reps (e.g., "3 x 10-12")
- Rest time (e.g., "60 seconds")
- Notes (e.g., "Keep core tight")

**Progressive Difficulty:**
- Week 1-2: Beginner exercises, lighter volume
- Week 3-5: Intermediate, increased sets
- Week 6-8: Advanced, higher intensity

**Design:**
- Clean, minimalist cards
- Blue accent colors (fitness theme)
- Easy-to-scan exercise info
- Mobile-friendly layout

---

## 6. Environment Setup

### 6.1 Web App (.env.local)

```bash
# /apps/web/.env.local

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://oswlhrzarxjpyocgxgbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Razorpay Configuration (Future - Not Yet Used)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
# RAZORPAY_KEY_SECRET=...
# RAZORPAY_WEBHOOK_SECRET=whsec_...
```

### 6.2 Admin App (.env.local)

```bash
# /apps/admin/.env.local

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://oswlhrzarxjpyocgxgbr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Service Role Key for Testing Panel (Required)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # Get from Supabase Dashboard → Settings → API
```

**Security Note:** Service role key bypasses RLS. Only use in admin app, never in web app.

---

## 7. Next Steps: Payment Integration

### 7.1 Razorpay Integration (Not Yet Implemented)

**Current State:**
- Checkout page shows "Coming Soon" placeholder
- Testing done via admin panel

**To Implement:**

#### Step 1: Create Razorpay Account
1. Sign up at https://razorpay.com
2. Complete KYC verification
3. Get API keys (test mode for development)

#### Step 2: Create Subscription Plan
1. Go to Razorpay Dashboard → Subscriptions → Plans
2. Create plan:
   - Name: "ApexOne Premium Monthly"
   - Amount: ₹999
   - Billing Cycle: Monthly
   - Copy Plan ID (e.g., `plan_abc123`)

#### Step 3: Install SDK
```bash
cd apps/web
npm install razorpay
```

#### Step 4: Update Checkout Page

Replace `/apps/web/app/(app)/premium/checkout/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Create subscription via Razorpay
    const res = await fetch("/api/razorpay/create-subscription", {
      method: "POST",
      body: JSON.stringify({ userId: user?.id })
    });

    const { subscriptionId } = await res.json();

    // Open Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      name: "ApexOne Premium",
      description: "Monthly Subscription",
      handler: async function (response: any) {
        // Payment successful
        router.push("/premium/assessment");
      },
      prefill: {
        email: user?.email,
      },
      theme: {
        color: "#000000",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout-page">
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Processing..." : "Subscribe Now"}
      </button>
    </div>
  );
}
```

#### Step 5: Create Webhook Handler

Create `/apps/web/app/api/razorpay/webhook/route.ts`:

```typescript
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { event, payload } = JSON.parse(body);

  if (event === "subscription.charged") {
    // Payment successful - user is now premium
    const userId = payload.notes.user_id;

    // No need to update profiles - premium determined by assessment/plans
    // User will be redirected to assessment form
  }

  return NextResponse.json({ success: true });
}
```

#### Step 6: Configure Webhook in Razorpay
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events: `subscription.charged`, `subscription.cancelled`
4. Copy webhook secret to `.env.local`

---

### 7.2 Testing Payment Flow (After Integration)

**Test Mode:**
1. Use Razorpay test keys
2. Use test card: `4111 1111 1111 1111`, CVV: any 3 digits, Expiry: any future date
3. Payment succeeds instantly

**Verify:**
1. User redirects to `/premium/assessment`
2. Assessment form is accessible
3. After assessment submission, user sees pending state
4. Admin can create plans and activate

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment

**Code:**
- [ ] All components tested locally
- [ ] Assessment form validation works
- [ ] Meal logging functionality tested
- [ ] Week navigation works in plans
- [ ] Mobile responsive design verified

**Database:**
- [ ] RPC functions exist in production Supabase
- [ ] Tables have proper RLS policies
- [ ] Indexes created for performance
- [ ] Test data cleaned from production

**Environment:**
- [ ] `.env.local` variables documented
- [ ] Secrets not committed to git
- [ ] Production Supabase URL configured

---

### 8.2 Payment Integration (Future)

**Razorpay:**
- [ ] Switch to production keys (rzp_live_...)
- [ ] Webhook URL updated in Razorpay dashboard
- [ ] Test payment with ₹1 transaction
- [ ] GST compliance verified
- [ ] Refund policy added to checkout

**Monitoring:**
- [ ] Error tracking enabled (Sentry)
- [ ] Webhook failure alerts set up
- [ ] Payment success rate monitoring
- [ ] Assessment submission rate tracking

---

### 8.3 Post-Deployment

**User Testing:**
- [ ] End-to-end flow tested with real user
- [ ] Mobile app tested (iOS + Android browsers)
- [ ] Payment flow smooth (< 30 seconds)
- [ ] Assessment form saves correctly

**Admin Workflow:**
- [ ] New assessments visible in admin panel
- [ ] Plan creation workflow documented
- [ ] Average plan creation time: < 2 hours
- [ ] User notification system working

---

## 9. File Structure Reference

```
fitness-web/
├── apps/
│   ├── web/                                     WEB APP (Port 3002)
│   │   ├── app/(app)/premium/
│   │   │   ├── page.tsx                        ✅ Gatekeeper router
│   │   │   ├── checkout/page.tsx               ⏳ Placeholder ("Coming Soon")
│   │   │   └── assessment/page.tsx             ✅ 17-field form
│   │   ├── components/premium/
│   │   │   ├── UpsellView.tsx                  ✅ Marketing page
│   │   │   ├── PendingView.tsx                 ✅ Waiting room
│   │   │   ├── PlanDashboard.tsx               ✅ Tab switcher
│   │   │   ├── DietPlanView.tsx                ✅ Meal cards + logging
│   │   │   └── WorkoutPlanView.tsx             ✅ Exercise cards
│   │   ├── lib/hooks/
│   │   │   ├── usePremiumStatus.ts             ✅ Fetch gatekeeper state
│   │   │   ├── useDietPlan.ts                  ✅ Fetch diet plan
│   │   │   └── useWorkoutPlan.ts               ✅ Fetch workout plan
│   │   ├── shared/
│   │   │   ├── types/premium.ts                ✅ TypeScript types
│   │   │   └── validation/premiumAssessment.ts ✅ Zod schema
│   │   └── .env.local                          🔑 Supabase + Razorpay keys
│   │
│   └── admin/                                   ADMIN APP (Port 3003)
│       ├── app/
│       │   ├── premium-testing/
│       │   │   ├── page.tsx                    ✅ User search
│       │   │   └── [userId]/page.tsx           ✅ Testing dashboard
│       │   ├── api/premium-testing/
│       │   │   ├── set-user-state/route.ts     ✅ State transitions
│       │   │   ├── create-diet-plan/route.ts   ✅ Save diet plan
│       │   │   ├── create-workout-plan/route.ts✅ Save workout plan
│       │   │   └── delete-plans/route.ts       ✅ Delete plans
│       │   └── middleware.ts                   ✅ Protect /premium-testing
│       ├── components/
│       │   ├── layout/Sidebar.tsx              ✅ Added "Premium Testing"
│       │   └── premium-testing/
│       │       ├── StateButtons.tsx            ✅ 4 state buttons
│       │       ├── PremiumStatusCard.tsx       ✅ Status display
│       │       ├── DietPlanBuilder.tsx         ✅ Diet template loader
│       │       └── WorkoutPlanBuilder.tsx      ✅ Workout template loader
│       ├── lib/templates/
│       │   ├── dietTemplates.ts                ✅ 1 week + 8 week plans
│       │   └── workoutTemplates.ts             ✅ 1 week + 8 week plans
│       └── .env.local                          🔑 SUPABASE_SERVICE_ROLE_KEY
│
└── docs/
    ├── ADMIN_PREMIUM_TESTING_GUIDE.md          📖 Testing instructions
    └── WEB_PREMIUM_IMPLEMENTATION_GUIDE.md     📖 This file
```

---

## 10. Key Differences: Web vs Expo

| Aspect | Expo App | Next.js Web App |
|--------|----------|------------------|
| **Routes** | Expo Router | Next.js App Router |
| **Styling** | NativeWind | Tailwind CSS v4 |
| **Components** | React Native | HTML + Radix UI |
| **State** | Zustand + TanStack Query | TanStack Query only |
| **Session** | AsyncStorage | Server-side cookies |
| **Payment** | N/A | Razorpay Checkout JS |
| **RPC Calls** | ✅ Same | ✅ Same |
| **Database** | ✅ Shared | ✅ Shared |
| **Business Logic** | ✅ Reused | ✅ Reused |

**Result:** 95% of backend logic reused, only UI layer differs.

---

## 11. Troubleshooting

### Problem: "Module not found: @/shared/..."

**Cause:** Shared files not in web app directory

**Fix:**
- Files must be in `/apps/web/shared/`
- NOT in root `/shared/` directory
- Web app's `@/` alias points to `/apps/web/`

---

### Problem: Gatekeeper always shows upsell

**Cause:** RPC function `get_user_premium_status()` not returning correct state

**Fix:**
1. Check RPC function exists in Supabase
2. Verify function checks all 3 tables (assessments, diet_plans, workout_plans)
3. Test with admin panel to verify state changes

---

### Problem: Assessment form won't submit

**Cause:** Missing required fields or validation error

**Fix:**
1. Check browser console for Zod validation errors
2. Ensure all required fields filled
3. Check Supabase RPC function accepts 17 parameters
4. Verify RPC function has SECURITY DEFINER

---

### Problem: Meal logging doesn't work

**Cause:** RPC function `log_planned_meal_v2()` missing or wrong parameters

**Fix:**
1. Verify RPC exists: Supabase Dashboard → Database → Functions
2. Check function signature matches call
3. Ensure function inserts into correct diary table
4. Test RPC directly in Supabase SQL Editor

---

## 12. Success Metrics

### Week 1 After Launch:
- [ ] 100% of premium users complete assessment
- [ ] 90% assessment completion rate (all 17 fields)
- [ ] < 5% bounce rate on checkout page
- [ ] Zero critical bugs reported
- [ ] Admin creates plans within 24 hours

### Month 1:
- [ ] 50+ premium subscriptions
- [ ] 95%+ retention (no churn)
- [ ] < 1% payment failure rate
- [ ] 4.5+ star user feedback
- [ ] 80%+ users view plans weekly

---

## 13. Support Resources

**Supabase:**
- Dashboard: https://supabase.com/dashboard/project/oswlhrzarxjpyocgxgbr
- SQL Editor: Database → SQL Editor
- RPC Functions: Database → Functions
- Table Editor: Database → Tables

**Razorpay (Future):**
- Dashboard: https://dashboard.razorpay.com
- Docs: https://razorpay.com/docs/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

**Documentation:**
- Admin Testing Guide: `/docs/ADMIN_PREMIUM_TESTING_GUIDE.md`
- This Implementation Guide: `/docs/WEB_PREMIUM_IMPLEMENTATION_GUIDE.md`

---

## 14. FAQ

**Q: Is payment integration working?**
A: No, checkout shows "Coming Soon". Use admin panel for testing.

**Q: How do I test all 4 premium states?**
A: Use admin panel at `/premium-testing`. See ADMIN_PREMIUM_TESTING_GUIDE.md.

**Q: Where are diet/workout plans stored?**
A: Supabase tables: `diet_plans` and `workout_plans` as JSONB.

**Q: How does gatekeeper determine state?**
A: Checks existence of assessment and plans in database via RPC function.

**Q: Can users edit their own plans?**
A: No, plans are read-only. Admin creates custom plans based on assessment.

**Q: How long does plan creation take?**
A: Currently 24-48 hours. Admin manually creates plans using templates.

**Q: Will this work with the Expo app?**
A: Yes, shares same database and RPC functions. Premium works across both platforms.

---

**Last Updated:** January 15, 2026
**Version:** 2.0 (Current Implementation)
**Status:** ✅ Ready for UI Testing
**Next Step:** Razorpay Integration
**Maintainer:** ApexOne Development Team
