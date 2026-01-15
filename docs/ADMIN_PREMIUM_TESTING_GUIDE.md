# Admin Premium Testing Guide

> **Purpose:** Test all 4 premium gatekeeper states and create diet/workout plans without Razorpay integration for rapid UI development and testing.

---

## Quick Start (5 Minute Setup)

### Step 1: Set Up Admin Access

1. **Make Your Account Admin:**
   ```sql
   -- Run in Supabase SQL Editor
   UPDATE profiles
   SET is_admin = true
   WHERE username = 'your-username-here';
   ```

2. **Get Supabase Service Role Key:**
   - Go to [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/oswlhrzarxjpyocgxgbr/settings/api)
   - Copy the `service_role` secret (NOT the anon key)

3. **Add to Admin .env.local:**
   ```bash
   # Add this line to /apps/admin/.env.local
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

4. **Restart Admin Dev Server:**
   ```bash
   cd apps/admin
   npm run dev
   ```

5. **Navigate to Testing Panel:**
   - Open `http://localhost:3003/premium-testing` (admin runs on port 3003)
   - Search for a test user by username
   - Start testing!

---

## Understanding the 4 Premium States

The premium system uses a **gatekeeper pattern** with 4 distinct states. Each state is determined by database conditions and controls what the user sees in the web app.

### State Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     PREMIUM USER JOURNEY                      │
└──────────────────────────────────────────────────────────────┘

[1] UPSELL STATE (Free User)
    ↓ User clicks "Subscribe Now"
    ↓ Goes to /premium/checkout
    ↓ Sees "Coming Soon" message
    ↓ Admin sets state to "needs_assessment"

[2] NEEDS ASSESSMENT STATE (Premium, No Assessment)
    ↓ Web app redirects to /premium/assessment
    ↓ User fills 17-field form
    ↓ User clicks "Submit Assessment"
    ↓ Auto-transitions to...

[3] PENDING STATE (Assessment Submitted, No Plans)
    ↓ User sees "24-48 hours" message
    ↓ Admin creates diet + workout plans
    ↓ Admin clicks "Set to Active"

[4] ACTIVE STATE (Full Premium with Plans)
    ↓ User sees diet/workout dashboard
    ↓ Can log meals with one tap
    ↓ Can view all 8 weeks of plans
```

---

## The 4 States Explained

### 🔓 State 1: UPSELL (Free User)

**Database Conditions:**
- No `premium_assessments` record
- No `diet_plans` record
- No `workout_plans` record

**What User Sees:**
- **Route:** `/premium`
- **UI:** Marketing page with pricing card (₹999/month)
- **Features list:** Diet plans, workout plans, coaching, meal logging
- **CTA Button:** "Subscribe Now" → Goes to `/premium/checkout`

**When to Use for Testing:**
- Testing the premium marketing page UI
- Verifying pricing and features display correctly
- Testing the "Subscribe Now" flow

**Admin Action to Set:**
- Click "Set to Upsell" button in testing panel
- This deletes all assessment and plan data

---

### 📝 State 2: NEEDS ASSESSMENT (Premium, No Assessment)

**Database Conditions:**
- No `premium_assessments` record (or assessment deleted)
- User has paid (simulated by admin for testing)

**What User Sees:**
- **Route:** `/premium` → Automatically redirects to `/premium/assessment`
- **UI:** 17-field assessment form in 3 sections
  - **General:** Fitness goals, age, gender, weight, activity level
  - **Nutrition:** Diet preferences, health conditions, meal frequency
  - **Workout:** Experience level, equipment, time availability
- **Submit Button:** Creates assessment and transitions to pending state

**When to Use for Testing:**
- Testing the assessment form UI and validation
- Verifying all 17 fields work correctly
- Testing form submission and redirect

**Admin Action to Set:**
- Click "Needs Assessment" button in testing panel
- This deletes assessment and plans (simulating paid user without assessment)

---

### ⏳ State 3: PENDING (Assessment Submitted, Plans Not Ready)

**Database Conditions:**
- `premium_assessments` record exists with `status = 'pending'`
- No `diet_plans` record
- No `workout_plans` record

**What User Sees:**
- **Route:** `/premium`
- **UI:** Waiting room with:
  - Clock icon
  - "Your Plan is Being Created" message
  - "24-48 hours" delivery timeline
  - Progress indicators (Assessment ✓, Creation 🔄, Ready ○)
  - "In the meantime" suggestion to use regular app features

**When to Use for Testing:**
- Testing the pending/waiting state UI
- Verifying the message displays correctly
- Testing what users see after submitting assessment

**Admin Action to Set:**
- Click "Set to Pending" button in testing panel
- This creates a pending assessment record

**Real-World Flow:**
- User submits assessment form → Auto-transitions to this state
- Admin reviews assessment and creates plans (takes 24-48 hours)
- Admin then sets to "active" state

---

### ✅ State 4: ACTIVE (Full Premium with Plans)

**Database Conditions:**
- `premium_assessments` record exists with `status = 'active'`
- `diet_plans` record exists
- `workout_plans` record exists

**What User Sees:**
- **Route:** `/premium`
- **UI:** Full premium dashboard with:
  - Tab switcher (Diet Plan / Workout Plan)
  - Week selector (Week 1 - Week 8)
  - **Diet Tab:**
    - Daily meal cards organized by date
    - Each meal shows: name, calories, macros (P/C/F)
    - "View Details" → Shows ingredients & instructions
    - "Log This Meal" button → One-tap meal logging to diary
  - **Workout Tab:**
    - Daily workout cards
    - Each exercise shows: name, sets, reps, rest time, notes
    - Rest days clearly indicated

**When to Use for Testing:**
- Testing the full premium dashboard UI
- Verifying week navigation works
- Testing meal logging functionality
- Testing workout plan display

**Admin Action to Set:**
1. Load diet template → Click "Load Minimal (1 week)" or "Load Full (8 weeks)"
2. Click "Save Diet Plan"
3. Load workout template → Click "Load Minimal" or "Load Beginner"
4. Click "Save Workout Plan"
5. Click "Set to Active"

**Real-World Flow:**
- Admin creates custom plans based on user's assessment
- Admin clicks "Set to Active"
- User can now access full premium features

---

## Step-by-Step Testing Workflow

### Complete Test Cycle (5-10 minutes)

#### 🎯 Setup: Find Your Test User

1. Navigate to `/premium-testing` in admin panel
2. Search for user by username (e.g., `pranjalai777@gmail.com`)
3. Click "Test Premium" button
4. You'll see the user testing dashboard with 4 state buttons

---

#### Test 1: UPSELL State (Free User Experience)

**Admin Steps:**
1. Click "Set to Upsell" button (🔓 icon)
2. Wait for "State changed" confirmation

**Web App Verification:**
1. Open web app at `http://localhost:3002/premium`
2. ✅ Should see marketing page with:
   - "Concierge Premium Plan" title
   - 4 feature cards (meal plans, workouts, coaching, tracking)
   - Pricing: ₹999/month
   - "Upgrade to Premium" button

**What This Tests:**
- Marketing page renders correctly
- Pricing displays properly
- Feature descriptions are accurate

**Next:** Click "Subscribe Now" → Should go to checkout page with "Coming Soon" message

---

#### Test 2: NEEDS ASSESSMENT State (New Premium User)

**Admin Steps:**
1. Click "Needs Assessment" button (📝 icon)
2. Wait for confirmation

**Web App Verification:**
1. Navigate to `/premium` in web app
2. ✅ Should automatically redirect to `/premium/assessment`
3. ✅ Should see assessment form with 3 sections:
   - **General Information:** Goals, age, gender, weight, activity level
   - **Nutrition Preferences:** Diet type, health conditions, foods
   - **Workout Preferences:** Experience, equipment, time availability

**Try Filling Out the Form:**
1. Enter test data in all fields
2. Click "Submit Assessment"
3. ✅ Should redirect to `/premium`
4. ✅ Should now see "pending" state (next test)

**What This Tests:**
- Redirect logic works correctly
- Form renders all 17 fields
- Form validation works
- Submission creates assessment record

---

#### Test 3: PENDING State (Assessment Submitted)

**Admin Steps:**
1. Click "Set to Pending" button (⏳ icon)
2. Wait for confirmation

**Web App Verification:**
1. Navigate to `/premium` in web app
2. ✅ Should see pending view with:
   - Clock icon (yellow background)
   - "Your Plan is Being Created" heading
   - "24-48 hours" message
   - Progress timeline showing:
     - ✅ Assessment Received (green checkmark)
     - 🔄 Plan Creation (loading indicator)
     - ○ Plan Ready (not yet)
   - "In the Meantime" suggestion box

**What This Tests:**
- Pending state UI displays correctly
- Timeline shows proper progress
- User understands they need to wait

**Real Scenario:** User would stay in this state while admin creates personalized plans

---

#### Test 4: ACTIVE State (Full Premium Access)

**Admin Steps:**
1. **Create Diet Plan:**
   - Under "Diet Plan Builder" section
   - Click "Load Minimal (1 week)" for quick testing
   - Click "Save Diet Plan"
   - Wait for success message

2. **Create Workout Plan:**
   - Under "Workout Plan Builder" section
   - Click "Load Minimal"
   - Click "Save Workout Plan"
   - Wait for success message

3. **Activate Premium:**
   - Click "Set to Active" button (✅ icon)
   - Wait for confirmation

**Web App Verification:**
1. Navigate to `/premium` in web app
2. ✅ Should see full premium dashboard with tabs:
   - "Your Premium Plan" heading
   - Tab switcher: Diet Plan | Workout Plan

3. **Test Diet Plan Tab:**
   - ✅ See "Week 1" selector (or Week 1-8 if using full template)
   - ✅ See daily meal cards:
     - Each card shows date, day name
     - Meals organized by type (Breakfast, Lunch, Dinner, Snack)
     - Each meal shows: name, calories, protein, carbs, fat
   - Click "View Details" on a meal:
     - ✅ Should expand to show ingredients and instructions
   - Click "Log This Meal":
     - ✅ Should show success message
     - ✅ Meal should be added to your diary (check /diary page)

4. **Test Workout Plan Tab:**
   - Click "Workout Plan" tab
   - ✅ See week selector
   - ✅ See daily workout cards:
     - Each card shows date, day name, workout type
     - Exercises list with sets, reps, rest time
     - Rest days show "Rest Day" message

**What This Tests:**
- Full premium dashboard renders correctly
- Week navigation works
- Diet plan displays all meals with proper formatting
- Meal logging functionality works (one-tap to diary)
- Workout plan displays exercises correctly
- Tab switching works smoothly

---

### 🔄 Reset for Next Test

**Admin Steps:**
1. Click "Set to Upsell" to reset user to free tier
2. This clears all test data
3. User is ready for another test cycle

---

## Admin Testing Panel Features

### Current Premium Status Card

Shows real-time status of the user:

```
┌─────────────────────────────────────────────────────────┐
│ Current Premium Status                                   │
├─────────────────────────────────────────────────────────┤
│ Assessment Status: pending                              │
│ Has Diet Plan: ✗ No                                      │
│ Has Workout Plan: ✓ Yes                                  │
└─────────────────────────────────────────────────────────┘
```

**Auto-refreshes after any state change**

---

### Quick State Changes (4 Buttons)

Visual cards with icons for each state:

| Button | Icon | Description | Database Action |
|--------|------|-------------|-----------------|
| Set to Upsell | 🔓 | Free user, no plans | Deletes all assessments & plans |
| Needs Assessment | 📝 | Premium, no assessment | Deletes assessments & plans |
| Set to Pending | ⏳ | Assessment submitted | Creates pending assessment |
| Set to Active | ✅ | Full premium with plans | Sets assessment to active |

---

### Diet Plan Builder

```
┌─────────────────────────────────────────────────────────┐
│ Diet Plan Builder                                        │
├─────────────────────────────────────────────────────────┤
│ Template: [Minimal (1 week) ▼]  [Load Template]        │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ {                                                    │ │
│ │   "weeks": [                                         │ │
│ │     {                                                │ │
│ │       "week_number": 1,                              │ │
│ │       "days": [...]                                  │ │
│ │     }                                                │ │
│ │   ]                                                  │ │
│ │ }                                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ [Save Diet Plan]  [Delete Diet Plan]                    │
└─────────────────────────────────────────────────────────┘
```

**Templates Available:**
- **Minimal (1 week):** 7 days, 3 meals/day - Fast testing
- **Full Indian (8 weeks):** 56 days, 4 meals/day - Complete plan

**How to Use:**
1. Select template from dropdown
2. Click "Load Template" → JSON appears in editor
3. Optionally edit JSON manually
4. Click "Save Diet Plan"
5. Status card updates to show "Has Diet Plan: ✓ Yes"

---

### Workout Plan Builder

Same structure as Diet Plan Builder:
- **Minimal (1 week):** 3 workout days, 4 rest days
- **Beginner (8 weeks):** Progressive difficulty, full program

---

## Database Schema (Simplified)

### Tables Used

#### profiles
```sql
id: uuid (PK)
username: text (contains email as identifier)
is_admin: boolean
points: integer
created_at: timestamp
```

**Note:** No `subscription_tier` column. Premium status determined by assessment/plan existence.

---

#### premium_assessments
```sql
id: uuid (PK)
user_id: uuid (FK → profiles.id, UNIQUE)
status: 'pending' | 'active'
fitness_goals: text
activity_level: text
age: integer
gender: text
... (14 more fields)
created_at: timestamp
```

**Key Field:** `status` determines if plans are ready

---

#### diet_plans
```sql
id: uuid (PK)
user_id: uuid (FK → profiles.id, UNIQUE)
plan_data: jsonb
created_at: timestamp
```

**Structure of plan_data:**
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
              "ingredients": ["Oats 50g", "Vegetables"],
              "instructions": "Cook oats with vegetables"
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
id: uuid (PK)
user_id: uuid (FK → profiles.id, UNIQUE)
plan_data: jsonb
created_at: timestamp
```

**Structure of plan_data:**
```json
{
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "day_name": "Full Body",
          "exercises": [
            {
              "exercise_name": "Push-ups",
              "sets": 3,
              "reps": "10-12",
              "rest_seconds": 60,
              "notes": "Keep body straight"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## API Routes Reference

### 1. Set User State
**Endpoint:** `POST /api/premium-testing/set-user-state`

**What Each State Does:**

| Target State | Database Operations |
|--------------|-------------------|
| `upsell` | 1. Delete diet_plans<br>2. Delete workout_plans<br>3. Delete premium_assessments |
| `needs_assessment` | 1. Delete diet_plans<br>2. Delete workout_plans<br>3. Delete premium_assessments<br>(Premium status simulated for testing) |
| `pending` | 1. Delete diet_plans<br>2. Delete workout_plans<br>3. Create/update assessment with `status='pending'` |
| `active` | 1. Set assessment `status='active'`<br>2. Create minimal diet plan (if missing)<br>3. Create minimal workout plan (if missing) |

---

### 2. Create Diet Plan
**Endpoint:** `POST /api/premium-testing/create-diet-plan`

Upserts diet plan to database (replaces if exists)

---

### 3. Create Workout Plan
**Endpoint:** `POST /api/premium-testing/create-workout-plan`

Upserts workout plan to database (replaces if exists)

---

### 4. Delete Plans
**Endpoint:** `POST /api/premium-testing/delete-plans`

Deletes specific plan types: "diet", "workout", or "both"

---

## Web App Routes Reference

| Route | State | Purpose |
|-------|-------|---------|
| `/premium` | All states | Main router - shows different UI based on gatekeeper state |
| `/premium/checkout` | Upsell | Payment page (shows "Coming Soon" placeholder) |
| `/premium/assessment` | Needs Assessment | 17-field assessment form |
| `/premium` (pending) | Pending | "24-48 hours" waiting room |
| `/premium` (active) | Active | Full premium dashboard with diet/workout tabs |

---

## Troubleshooting

### Problem: User not found in search

**Cause:** Username field is being searched, not all profiles

**Fix:**
- Search by the exact username (email) stored in database
- Check Supabase Table Editor → profiles table to see actual username value

---

### Problem: State doesn't change in web app

**Cause:** Browser cache or React Query cache

**Fix:**
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
2. Check admin panel status card - should show updated status
3. Check Supabase Table Editor to verify database updated

---

### Problem: "Column does not exist" error

**Cause:** Query trying to access non-existent database column

**Fix:**
- Check error message for column name
- Verify in Supabase Table Editor that column exists
- This guide reflects actual schema (no subscription_tier or email columns in profiles)

---

### Problem: Plans don't save

**Cause:** Invalid JSON format

**Fix:**
1. Click "Load Template" first to get valid JSON
2. Verify JSON is valid (no trailing commas, proper brackets)
3. Check browser console for detailed error message

---

### Problem: Service role key not working

**Cause:** Incorrect key or not set in environment

**Fix:**
1. Verify `.env.local` has `SUPABASE_SERVICE_ROLE_KEY=...`
2. Restart admin dev server after adding key
3. Check key is service_role (long key), not anon key

---

## Security Notes

### Service Role Key

**What It Does:**
- Bypasses Row Level Security (RLS)
- Allows admin to modify any user's data
- Required for testing state transitions

**Security Rules:**
- ✅ Store in `apps/admin/.env.local` (git-ignored)
- ✅ Only used server-side (API routes)
- ✅ Protected by middleware (admin-only access)
- ❌ NEVER expose to client-side code
- ❌ NEVER commit to git

### Admin Access

**Current Protection:**
- Middleware checks `profiles.is_admin = true`
- `/premium-testing` routes protected
- Must be logged in as admin user

---

## File Structure

```
fitness-web/
├── apps/
│   ├── admin/
│   │   ├── .env.local                      ← Add SUPABASE_SERVICE_ROLE_KEY
│   │   ├── app/
│   │   │   ├── api/premium-testing/
│   │   │   │   ├── set-user-state/route.ts
│   │   │   │   ├── create-diet-plan/route.ts
│   │   │   │   ├── create-workout-plan/route.ts
│   │   │   │   └── delete-plans/route.ts
│   │   │   ├── premium-testing/
│   │   │   │   ├── layout.tsx              ← Sidebar + dark theme
│   │   │   │   ├── page.tsx                ← User search
│   │   │   │   └── [userId]/page.tsx       ← Testing dashboard
│   │   │   └── middleware.ts               ← Protect /premium-testing/*
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Sidebar.tsx             ← Added "Premium Testing" link
│   │   │   └── premium-testing/
│   │   │       ├── StateButtons.tsx
│   │   │       ├── PremiumStatusCard.tsx
│   │   │       ├── DietPlanBuilder.tsx
│   │   │       └── WorkoutPlanBuilder.tsx
│   │   └── lib/templates/
│   │       ├── dietTemplates.ts
│   │       └── workoutTemplates.ts
│   │
│   └── web/
│       ├── app/(app)/premium/
│       │   ├── page.tsx                    ← Gatekeeper router (4 states)
│       │   ├── checkout/page.tsx           ← "Coming Soon" placeholder
│       │   └── assessment/page.tsx         ← 17-field form
│       ├── components/premium/
│       │   ├── UpsellView.tsx              ← Marketing page
│       │   ├── PendingView.tsx             ← "24-48 hours" message
│       │   ├── PlanDashboard.tsx           ← Tab switcher
│       │   ├── DietPlanView.tsx            ← Meal cards with logging
│       │   └── WorkoutPlanView.tsx         ← Exercise cards
│       ├── lib/hooks/
│       │   ├── usePremiumStatus.ts
│       │   ├── useDietPlan.ts
│       │   └── useWorkoutPlan.ts
│       └── shared/
│           ├── types/premium.ts
│           └── validation/premiumAssessment.ts
│
└── docs/
    ├── ADMIN_PREMIUM_TESTING_GUIDE.md      ← This file
    └── WEB_PREMIUM_IMPLEMENTATION_GUIDE.md
```

---

## Success Checklist

After setup, you should be able to:

- ✅ Access admin panel at `/premium-testing`
- ✅ Search for users by username
- ✅ See current premium status
- ✅ Click any of 4 state buttons and see immediate update
- ✅ Load templates and save plans in <30 seconds
- ✅ See changes reflected in web app immediately
- ✅ Complete full test cycle in under 5 minutes
- ✅ Test meal logging (one-tap to diary)
- ✅ Navigate between weeks in plans
- ✅ Reset user to upsell state for next test

---

## FAQs

**Q: Can I test with my own user account?**
A: Yes! Just search for your username and toggle states.

**Q: Will this affect real users?**
A: Only if pointed at production database. Development database is safe.

**Q: How do I reset a user completely?**
A: Click "Set to Upsell" - removes all premium data.

**Q: Can I create custom templates?**
A: Yes! Edit `apps/admin/lib/templates/dietTemplates.ts` or `workoutTemplates.ts`

**Q: Why no email/subscription_tier columns?**
A: Simplified schema - premium status determined by assessment/plan existence.

**Q: Where does the actual payment happen?**
A: Currently shows "Coming Soon" at `/premium/checkout`. Razorpay integration comes later.

**Q: How do I test the assessment form submission?**
A: Set state to "needs_assessment", go to web app, fill form, submit. Auto-transitions to pending.

---

## Next Steps After Testing

Once UI testing is complete:

1. **Add Razorpay Integration** (Web App)
   - Configure Razorpay account and get API keys
   - Replace placeholder checkout page with real payment flow
   - Set up webhook to update premium status on payment

2. **Enhance Admin Panel**
   - Add visual plan builder (avoid SQL/JSON editing)
   - Add meal and exercise libraries
   - Add template management

3. **Add Notifications**
   - Email user when plan is ready
   - Notify admin of new assessments
   - Remind users to complete assessment

---

**Last Updated:** January 15, 2026
**Version:** 2.0 (Reflects Actual Implementation)
**Maintainer:** ApexOne Development Team
