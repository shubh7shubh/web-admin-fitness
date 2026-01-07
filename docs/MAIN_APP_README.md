# FitnessApp 🏋️‍♂️

An advanced fitness tracking application that revolutionizes health and wellness through gamification, social engagement, and personalized nutrition plans. Built with React Native and Expo, this app combines the functionality of MyFitnessPal with motivational challenges, community-driven feeds, and premium subscription services.

## 🌟 Vision

FitnessApp isn't just another calorie counter. It's a comprehensive fitness ecosystem that:
- **Motivates** users through gamification with challenges and badges
- **Connects** fitness enthusiasts through a points-based social feed
- **Personalizes** nutrition and exercise plans through premium subscriptions
- **Empowers** users with cloud-first architecture and AI-powered insights (coming soon)

## ✨ Key Features

### 🎯 Core Fitness Tracking
- **Daily Diary**: Comprehensive food and exercise logging with macro tracking
- **Nutrition Database**: Extensive food database with detailed nutritional information
- **Progress Monitoring**: Weight tracking with visual charts and goal progression
- **Goal Calculation**: Intelligent fitness goal recalculation based on user profile changes

### 🏆 Gamification & Social
- **Points System**: Multi-source earning system (posts, daily goals, challenges, referrals)
- **Leaderboard**: Real-time ranking with materialized view for <10ms queries, top 100 cached
- **Challenge System**: 5+ fitness challenges with enrollment, progress tracking, and automated point rewards
- **Automated Point Awards**: Database triggers award points for post creation, daily goal achievement, referrals
- **Daily Streaks**: Consecutive day tracking with bonus points (up to +10 per day)
- **Social Feed**: Community posts ranked by user points - top 20 performers get prioritized visibility
- **Direct Messaging**: 1-on-1 real-time chat with followers and following users
- **Rank Badges**: Visual rank indicators on posts and leaderboards
- **Points History**: Complete audit trail of all point transactions with metadata

### 💎 Premium Features (Concierge Model)
- **4-State Gatekeeper System**: Intelligent UI flow (upsell → assessment → pending → active)
- **17-Field Assessment Form**: Comprehensive questionnaire organized into 3 sections (General, Nutrition, Workout)
- **Expert-Created Diet Plans**: Manually crafted personalized meal plans with JSONB structure (weeks/days/meals)
- **Expert-Created Workout Plans**: Customized exercise routines with detailed form tips and alternatives
- **One-Tap Meal Logging**: "Eat This" button logs planned meals directly to diary
- **Manual Admin Workflow**: Quality-first concierge approach via Supabase Dashboard
- **Dual Plan Support**: Users receive both diet AND workout plans from single assessment

### 🔮 Coming Soon
- **AI Chatbot**: Intelligent fitness and nutrition assistant
- **Advanced Coaching**: Personalized recommendations and guidance
- **Meal Planning**: AI-powered meal suggestions and grocery lists
- **Community Challenges**: Group competitions and team-based goals

## 🚀 Recent Improvements

Over the past months, we've made significant architectural improvements:

### Points System & Leaderboard Implementation (December 2025)
- ✅ Comprehensive points economy with multiple earning sources
  - Post creation: 2 pts (max 10 posts/day = 20 pts)
  - Daily calorie goal achievement: 10 pts
  - All macros goal achievement: +5 bonus pts
  - Daily streak bonus: +1 to +10 pts based on consecutive days
  - Challenge completion: 30-100 pts based on difficulty
  - Successful referral: 25 pts
- ✅ Real-time leaderboard with materialized view for performance
  - Top 100 users cached for <10ms queries
  - Automatic refresh when points change by ≥10
  - User rank calculation for all users (on-demand for users outside top 100)
- ✅ Challenge system with progress tracking
  - 5 seeded challenges (30-day streak, weight loss, social engagement, etc.)
  - User enrollment and completion tracking
  - Automated point awards on challenge completion
- ✅ Database triggers for automated point awards
  - Post creation trigger (rate-limited to 10 posts/day)
  - Daily goal achievement trigger (checks nutrition targets)
  - Referral completion trigger (awards both referrer and referred)
- ✅ Points history audit trail
  - Complete transaction log with metadata (JSONB)
  - Queryable by user, reason, and date range
  - Supports analytics and debugging
- ✅ Frontend integration
  - LeaderboardSection on home screen with top 5 preview
  - Full leaderboard modal with top 100 users
  - Challenges screen with enrollment UI
  - Rank badges on posts and profiles
  - Points display throughout the app
- **Max Daily Points:** ~45 from routine activities (posts, goals, streaks)
- **Documentation:** See `docs/CURRENT_DATABASE_STATE.md` (Sections 13-16) and `docs/POINTS_SYSTEM_IMPLEMENTATION_GUIDE.md`

### Premium Concierge System & Workout Plans (December 2025)
- ✅ Comprehensive premium subscription system with manual plan creation
  - 4-state gatekeeper (upsell → assessment → pending → active)
  - 17-field assessment form (General + Nutrition + Workout sections)
  - Expert-created diet plans with JSONB structure
  - Expert-created workout plans with exercises, form tips, alternatives
- ✅ Database layer
  - `premium_assessments` table (17 fields, unique active constraint)
  - `diet_plans` table (weeks/days/meals JSONB)
  - `workout_plans` table (weeks/days/exercises JSONB)
  - 4 RPC functions: `submit_premium_assessment`, `get_user_premium_status`, `get_active_diet_plan`, `get_active_workout_plan`
- ✅ Frontend implementation
  - PlanDashboard with Diet and Workout tabs
  - DietPlanView with "Eat This" meal logging
  - WorkoutPlanView with exercise cards, muscle group badges, expandable instructions
  - AssessmentForm with 3 visual sections
- ✅ Admin workflow via Supabase Dashboard SQL Editor
  - Manual plan creation using JSON templates
  - Sample INSERT scripts: `SAMPLE_DIET_PLAN_INSERT.sql`, `SAMPLE_WORKOUT_PLAN_INSERT.sql`
- **Documentation:** See `docs/CURRENT_DATABASE_STATE.md` (Section 17), `docs/PREMIUM_ADMIN_WORKFLOW.md`, and `docs/CONCIERGE_PREMIUM_IMPLEMENTATION_GUIDE.md`

### Phase 4: WatermelonDB Removal (November 2025)
- ✅ Removed entire `db/` directory and offline database layer (17 files deleted)
- ✅ Uninstalled WatermelonDB packages (~520KB bundle size reduction)
- ✅ Transitioned to cloud-first Supabase PostgreSQL architecture
- ✅ Simplified codebase with single source of truth

### TanStack Query Integration (December 2025)
- ✅ Replaced manual `useEffect` + `useState` data fetching patterns
- ✅ Implemented query keys factory for centralized cache management
- ✅ Added optimistic updates for instant UI feedback on social features
- ✅ Achieved ~40% code reduction in data fetching logic
- ✅ Automatic request deduplication and caching (30s stale, 5min cache)

### Edge Functions Deprecation (December 2025)
- ✅ Migrated user CRUD operations to direct Supabase RPC calls
- ✅ Edge Functions now reserved exclusively for 3rd party API integrations
- ✅ Reduced network latency (eliminated one network hop)
- ✅ Lower costs (RPC calls included in database compute, Edge Functions billed separately)

**Migration Documentation:** See `docs/PHASE_4_WATERMELONDB_REMOVAL.md` for complete migration details.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account (for database and authentication)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FitnessApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Set up Supabase project and get your credentials
   - Configure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in your environment
   - Add `google-services.json` for Android authentication

   For detailed setup instructions, see `docs/CLI_SETUP_GUIDE.md`

4. **Start development server**
   ```bash
   npm start
   ```

## 🛠 Technology Stack

### Frontend & Framework
- **React Native** + **Expo SDK 52** - Cross-platform mobile development
- **Expo Router** - File-based navigation system with native stack
- **TypeScript** - Type-safe development experience

### Styling & UI
- **NativeWind** - Tailwind CSS utility classes for React Native
- **React Native Gifted Charts** - Beautiful data visualizations
- **Inter Font Family** - Modern typography system
- **Expo Image** - Optimized image handling with caching

### Data Layer (Cloud-First Architecture)
- **Supabase PostgreSQL** - Single source of truth for all data
- **TanStack Query (React Query)** - Server state management, caching, and synchronization
- **Zustand** - Lightweight client state management (`useAppStore`, `useUserStore`)
- **Zod** - Runtime type validation and schema definition

### Backend Services
- **Supabase Auth** - Google Sign-in and user management
- **Supabase RPC Functions** - Complex database operations with Row Level Security
- **Supabase Edge Functions** - 3rd party API integrations (payments, AI) only
- **Supabase Storage** - User-generated content (profile pictures, post images)

### Development & Quality
- **ESLint** + **Prettier** - Code quality and consistent formatting
- **Husky** - Git hook enforcement
- **Jest** - Testing framework with jest-expo preset
- **EAS Build** - CI/CD pipeline for app deployment

### Key Architectural Principles
- ✅ Cloud-first architecture (not offline-first)
- ✅ Direct Supabase RPC calls for user data (NOT Edge Functions)
- ✅ TanStack Query for all data fetching (NO manual useState + useEffect)
- ✅ Query invalidation for data synchronization
- ✅ Production-grade migration workflow

## 🏗 Architecture Overview

### Production-Grade Architecture Decision Matrix

This app follows a carefully designed architecture for optimal performance, cost, and security:

| Use Case | Implementation | Why |
|----------|----------------|-----|
| **User CRUD Operations** | Supabase Client + RLS + RPC | FREE (included in database compute), FAST (no extra network hop), Works offline with TanStack Query cache |
| **Gamification Logic** | Database Triggers | Atomic operations, prevents cheating, runs inside DB transaction |
| **Feed Counts** | Cached Counts | Performance - never run `SELECT COUNT(*)` on feeds, store and update with triggers |
| **AI Features** | Edge Functions | Hide OpenAI API keys from client |
| **Payment Processing** | Edge Functions | Secure webhook signature verification |
| **Push Notifications** | Edge Functions | Protect Apple/Google master keys |
| **Cron Jobs** | Edge Functions | Automation when app is closed |

**Key Principle:** Edge Functions are ONLY for 3rd party API integrations (AI, payments, push notifications) and automation. ALL user data operations use direct Supabase client calls with RLS policies and RPC functions.

### Database Architecture

**Supabase PostgreSQL** - Single source of truth for all data:

**Core Tables:**
- `profiles` - User profiles, fitness goals (TDEE, macros), points, and badges
- `foods` - Nutrition database with full-text search
- `diary_entries` - Daily food/exercise logging by meal type
- `weight_entries` - Weight tracking with historical data

**Social Features:**
- `posts` - Social feed with cached engagement counts (like_count, comment_count)
- `likes` - Post likes with UNIQUE constraints
- `comments` - Post comments
- `follows` - User follow relationships
- `saved_posts` - Bookmarked posts
- `conversations` - 1-on-1 chat conversations
- `messages` - Chat messages with read status and real-time delivery

**Gamification & Points System:**
- `challenges` - Challenge definitions with requirements, rewards, and dates
- `user_challenges` - User progress tracking with status and points awarded
- `referrals` - Referral tracking with status (pending, completed, expired)
- `points_history` - Complete audit trail of all point transactions with metadata
- `leaderboard_mv` - Materialized view with top 100 users (pre-calculated for performance)

**Key RPC Functions:**
- `get_diary_entries_for_date` - Fetch daily logs
- `search_foods` - Full-text food search with ranking
- `get_posts` - Social feed with pagination
- `toggle_like` / `toggle_follow` - Atomic social actions
- `log_or_update_weight` - Weight tracking with upsert logic
- `update_user_fitness_profile` - Goal updates with TDEE recalculation
- `get_conversations` / `send_message` - Chat operations with real-time delivery
- `award_points` - Award points with audit trail and rank recalculation
- `check_daily_goal_achievement` - Evaluate nutrition goals and award points
- `get_leaderboard` - Fetch top N users from cached materialized view
- `get_user_rank` - Calculate user's rank and percentile
- `enroll_in_challenge` / `complete_challenge` - Challenge participation with point awards
- `get_feed` - Social feed ranked by author points (top 20 prioritized)

**Complete Schema:** See `docs/CURRENT_DATABASE_STATE.md` (1,755 lines) for full database schema, RLS policies, and all RPC functions.

### Data Fetching with TanStack Query

**CRITICAL:** All data fetching uses TanStack Query (React Query). Never use manual `useState` + `useEffect` patterns.

**Query Keys Factory:**
All queries use centralized keys from `lib/queryKeys.ts` for type safety and cache management:
```typescript
queryKeys.diaryEntries(date)
queryKeys.weightHistory()
queryKeys.posts()
queryKeys.nutritionSummary(date)
```

**Fetching Data (useQuery):**
```typescript
const { data = [], isLoading, error } = useQuery({
  queryKey: queryKeys.diaryEntries(dateString),
  queryFn: async () => {
    const { data, error } = await supabase.rpc('get_diary_entries_for_date', {
      p_date: dateString
    });
    if (error) throw error;
    return data || [];
  },
});
```

**Mutations with Invalidation (useMutation):**
```typescript
const { mutate: logWeight, isPending } = useMutation({
  mutationFn: async (weightKg: number) => {
    const { data, error } = await supabase.rpc('log_or_update_weight', {
      p_weight_kg: weightKg
    });
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    // Automatically refresh weight history
    queryClient.invalidateQueries({ queryKey: queryKeys.weightHistory() });
  },
});
```

**Benefits:**
- ✅ Automatic caching (30s stale time, 5min cache time)
- ✅ Request deduplication (multiple components requesting same data = one network request)
- ✅ Optimistic updates for instant UI feedback
- ✅ Built-in loading/error states
- ✅ Pull-to-refresh support

**Complete Guide:** See `docs/TANSTACK_QUERY_GUIDE.md` (1,098 lines) for detailed patterns, optimistic updates, and troubleshooting.

### State Management

**AppStore** (`stores/appStore.ts`):
- Current user session and authentication state
- App-wide loading states
- Global UI state

**UserStore** (`stores/useUserStore.ts`):
- User profile data from Supabase profiles table
- Fitness goals (height, weight, TDEE, calorie goals, macros)
- Points and badges for gamification
- Populated from Supabase on auth state change

### Migration System

Production-grade database migration workflow using Supabase CLI:

```bash
# 1. Create migration
npx supabase migration new description

# 2. Write SQL in generated file (supabase/migrations/YYYYMMDD_HHMMSS_description.sql)

# 3. Apply migration (automatically tracks and applies)
npx supabase db push

# 4. Update documentation
# Edit docs/CURRENT_DATABASE_STATE.md
```

**Benefits:**
- ✅ Automatic migration tracking (prevents duplicate runs)
- ✅ Applies migrations in correct order
- ✅ Team-ready (other devs can sync with `npx supabase db pull`)
- ✅ No manual copy/paste to SQL Editor

**Workflow Guide:** See `docs/MIGRATION_WORKFLOW.md` for best practices, troubleshooting (PGRST203 errors), and production standards.

## 📱 Project Structure

```
FitnessApp/
├── app/                    # Expo Router file-based routing
│   ├── (auth)/            # Authentication screens (login, onboarding)
│   ├── (tabs)/            # Main tab navigation (Home, Diary, Progress, Feeds)
│   ├── (modals)/          # Modal screens (Profile, Comments, Settings)
│   ├── nutrition/         # Food search and logging screens
│   └── blogs/             # Articles and blog content
├── modules/               # Feature-based modules
│   ├── home/              # Dashboard and overview components
│   ├── diary/             # Daily food/exercise logging
│   ├── nutrition/         # Food database and search
│   ├── progress/          # Weight tracking and charts
│   ├── onboarding/        # User setup flow (goal calculation)
│   └── feeds/             # Social feed components
├── supabase/              # Supabase backend layer
│   ├── migrations/        # SQL migration files (production-grade CLI workflow)
│   └── functions/         # Edge Functions (AI, payments, push - future)
├── components/            # Shared UI components
├── stores/                # Zustand state management
│   ├── appStore.ts        # Global app state (auth, loading)
│   └── useUserStore.ts    # User profile state (goals, points)
├── providers/             # React context providers
│   ├── AuthProvider.tsx   # Authentication context
│   └── ToastProvider.tsx  # Toast notifications
├── lib/                   # External service configurations
│   ├── supabase.ts        # Supabase client setup
│   ├── queryClient.ts     # TanStack Query configuration
│   └── queryKeys.ts       # Query key factory (centralized cache keys)
├── constants/             # Theme colors and configuration
│   └── theme.ts           # Color palette, typography
└── docs/                  # Comprehensive documentation (24 files)
    ├── CURRENT_DATABASE_STATE.md    # Complete schema (1,755 lines)
    ├── TANSTACK_QUERY_GUIDE.md      # Data fetching guide (1,098 lines)
    ├── MIGRATION_WORKFLOW.md        # Database migrations
    ├── ARCHITECTURE_DECISIONS.md    # Design rationale
    ├── PHASE_4_WATERMELONDB_REMOVAL.md  # Migration history
    └── [19 other guides]
```

## 🔧 Development Commands

### Core Development
```bash
npm start           # Start Expo development server
npm run android     # Run on Android device/emulator
npm run ios         # Run on iOS device/simulator
npm run web         # Run web version
npm run test        # Run Jest tests with watch mode
npm run lint        # Run Expo linting
```

### Building & Deployment
```bash
eas build --platform android    # Build Android APK
eas build --platform ios        # Build iOS IPA
eas build --platform all        # Build for both platforms
```

## 💻 Development Patterns

### Data Fetching (ALWAYS use TanStack Query)

```typescript
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

// ❌ WRONG - Manual state management (don't do this!)
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
  // Never do this - use TanStack Query instead!
  fetchData().then(setData);
}, []);
```

### Mutations with Query Invalidation

```typescript
const { mutate: savePost, isPending } = useMutation({
  mutationFn: async (postId: string) => {
    const { data, error } = await supabase.rpc('save_post', {
      post_id_to_save: postId
    });
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    // Automatically refresh related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.posts() });
    queryClient.invalidateQueries({ queryKey: queryKeys.savedPosts() });
  },
});
```

### Goal Recalculation

When updating user profile (height, weight, age, activity level):

```typescript
import { calculateUserGoals } from '@/modules/onboarding/services/goalCalculator';

// 1. Recalculate goals using pure function
const calculatedGoals = calculateUserGoals({
  dateOfBirth,
  gender,
  heightCm,
  currentWeightKg,
  goalWeightKg,
  activityLevel,
  goalType,
  goalRateKgPerWeek,
});

// 2. Update Supabase profiles table
await supabase
  .from('profiles')
  .update(calculatedGoals)
  .eq('id', userId);

// 3. Update UserStore
useUserStore.getState().updateProfile(calculatedGoals);
```

### Database Migrations

```bash
# 1. Create migration
npx supabase migration new add_feature_name

# 2. Edit generated SQL file in supabase/migrations/YYYYMMDD_HHMMSS_add_feature_name.sql

# 3. Apply migration (automatically tracks and applies in order)
npx supabase db push

# 4. Document changes in docs/CURRENT_DATABASE_STATE.md
```

**Best Practices:**
- Always use `CREATE OR REPLACE FUNCTION` for functions
- Use table aliases to avoid ambiguous column references (e.g., `UPDATE posts p SET ...`)
- If changing function signatures, `DROP FUNCTION` first to avoid PGRST203 errors

**Complete guides:** See `docs/TANSTACK_QUERY_GUIDE.md` and `docs/MIGRATION_WORKFLOW.md`

## 📚 Documentation

This project has **comprehensive documentation** in the `docs/` folder (24 files, 3,000+ lines):

### Core Guides
- **CLAUDE.md** - Primary developer guide (read this first!)
- **CURRENT_DATABASE_STATE.md** (1,755 lines) - Complete database schema, RLS policies, all RPC functions
- **TANSTACK_QUERY_GUIDE.md** (1,098 lines) - Data fetching patterns, optimistic updates, troubleshooting
- **ARCHITECTURE_DECISIONS.md** - Design rationale and decision matrix
- **MIGRATION_WORKFLOW.md** - Database migration best practices

### Feature Implementation
- **FEATURE_IMPLEMENTATION.md** - How to build new features
- **FEATURE_ROADMAP.md** - Planned features and priorities
- **SUBSCRIPTION_IMPLEMENTATION.md** - Premium subscriptions guide
- **SOCIAL_FEED_FEATURES.md** - Social features documentation
- **GOAL_RECALCULATION_FIX.md** - Fitness goal calculation logic

### Migration History
- **PHASE_4_WATERMELONDB_REMOVAL.md** - WatermelonDB to Supabase migration
- **DATA_MIGRATION_GUIDE.md** - Migration strategy and execution
- **USER_ID_SYSTEM.md** - User ID architecture evolution
- **MIGRATION_PROGRESS.md** - Migration tracking

### Setup & Operations
- **CLI_SETUP_GUIDE.md** - Supabase CLI setup instructions
- **PRODUCTION_CHECKLIST.md** - Pre-deployment checklist
- **MANUAL_STORAGE_POLICY_SETUP.md** - Storage configuration
- **DASHBOARD_SQL_GUIDE.md** - Running SQL in Supabase Dashboard

**Total:** 24 documentation files covering architecture, features, migrations, and operations.

## 🎨 Design System

### Styling Approach
- **NativeWind**: Tailwind-inspired utility classes for React Native
- **Theme System**: Consistent colors and typography defined in `constants/theme.ts`
- **Fitness Colors**: Specialized color palette for calories, macros (protein, carbs, fat), and progress indicators
- **Dark/Light Mode**: Full theme support for enhanced user experience

## 🧪 Testing

```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
```

Test files are located in the `test/` directory, including specialized tests for goal recalculation logic.

## 🚀 Roadmap

### Phase 1: Gamification Enhancement
- [ ] Advanced challenge system with multiplayer competitions
- [ ] Badge marketplace and trading features
- [ ] Social leaderboards and friend connections

### Phase 2: Premium Subscriptions
- [ ] Subscription tiers and payment integration
- [ ] Premium diet plan creator and marketplace
- [ ] Advanced analytics and insights dashboard

### Phase 3: AI Integration
- [ ] AI-powered chatbot for fitness advice
- [ ] Smart meal recommendations based on goals
- [ ] Predictive analytics for goal achievement

### Phase 4: Community Features
- [ ] Group challenges and team competitions
- [ ] Fitness coaching marketplace
- [ ] Social features expansion (stories, live workouts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

1. **Architecture**: Follow the Production-Grade Architecture Decision Matrix
   - User CRUD operations: Use Supabase Client + RLS + RPC (NOT Edge Functions)
   - Edge Functions: ONLY for 3rd party APIs (AI, payments, push) and automation
2. **Data Fetching**: ALWAYS use TanStack Query (see `docs/TANSTACK_QUERY_GUIDE.md`)
   - Use query keys from `lib/queryKeys.ts`
   - Implement query invalidation for mutations
   - Use optimistic updates for instant UI feedback
3. **Goal Recalculation**: Use `calculateUserGoals()` from `goalCalculator.ts`
4. **State Management**: Update both AppStore and UserStore for user-related changes
5. **Database Changes**: Follow migration workflow in `docs/MIGRATION_WORKFLOW.md`
   - Create migration with `npx supabase migration new description`
   - Apply with `npx supabase db push`
   - Update `docs/CURRENT_DATABASE_STATE.md`
6. **Styling**: Use NativeWind classes for consistent styling
7. **Navigation**: Follow Expo Router conventions (file-based routing)

### Pull Request Checklist
- [ ] Code follows existing patterns and architecture decisions
- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Database migrations tracked (if schema changed)
- [ ] `docs/CURRENT_DATABASE_STATE.md` updated (if database changed)
- [ ] Tests pass (`npm run test`)
- [ ] No `useState` + `useEffect` for data fetching (use TanStack Query)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**FitnessApp** - Transforming fitness tracking into an engaging, social, and rewarding experience. 💪✨
