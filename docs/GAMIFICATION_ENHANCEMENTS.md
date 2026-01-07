# Gamification & UX Enhancements Roadmap

**Last Updated:** January 2, 2026
**Purpose:** Comprehensive guide for adding game-like features, quizzes, and UX improvements
**Platforms:** Expo Mobile App + Web App

---

## Table of Contents

1. [Current Gamification State](#current-gamification-state)
2. [Daily Engagement Games](#daily-engagement-games)
3. [Quiz & Trivia System](#quiz--trivia-system)
4. [Achievement & Badge System](#achievement--badge-system)
5. [Social Competition Features](#social-competition-features)
6. [Streak & Habit Mechanics](#streak--habit-mechanics)
7. [Reward & Loot System](#reward--loot-system)
8. [UX Micro-Interactions](#ux-micro-interactions)
9. [Web-Specific Gamification](#web-specific-gamification)
10. [Database Schema](#database-schema)
11. [Implementation Priority](#implementation-priority)

---

## Current Gamification State

### What You Have ✅
- Points system (posts, goals, challenges, referrals)
- Leaderboard (top 100 with materialized view)
- 5 seeded challenges
- Daily streaks with bonus points
- Rank badges (gold/silver/bronze)
- Follow system

### What's Missing ❌
- Interactive games/quizzes
- Achievement badges
- Daily spin/rewards
- Loot boxes/mystery rewards
- Progress milestones
- Social competitions (1v1, teams)
- Visual celebrations
- Sound effects

---

## Daily Engagement Games

### 1. 🎰 Daily Spin Wheel

**Concept:** Users get one free spin per day for random rewards

```
┌─────────────────────────────────┐
│         DAILY SPIN              │
│                                 │
│      🎁  10pts  🎁              │
│    50pts        5pts            │
│      🎁  25pts  🎁              │
│                                 │
│      [ SPIN NOW! ]              │
│                                 │
│   Next free spin: 23:45:12      │
└─────────────────────────────────┘
```

| Reward | Probability | Points |
|--------|-------------|--------|
| Small | 40% | 5 pts |
| Medium | 30% | 10 pts |
| Large | 20% | 25 pts |
| Jackpot | 8% | 50 pts |
| Premium Day | 2% | 1 day premium trial |

**Extra Spins:**
- Complete daily goals = +1 spin
- Watch ad = +1 spin (monetization)
- 7-day streak = +1 spin

### 2. 🎯 Daily Nutrition Guessing Game

**Concept:** Guess the calories/macros of foods

```
┌─────────────────────────────────┐
│   GUESS THE CALORIES            │
│                                 │
│   🍔 Big Mac                    │
│                                 │
│   How many calories?            │
│                                 │
│   [  400  ] [  550  ] [  700  ] │
│                                 │
│   Streak: 🔥 5 correct          │
└─────────────────────────────────┘
```

| Feature | Description |
|---------|-------------|
| **3 Choices** | Easy mode - pick from 3 options |
| **Slider Mode** | Hard mode - guess exact number (±10%) |
| **Categories** | Fast food, home cooking, restaurant |
| **Streak Bonus** | 5 correct = 10 pts, 10 correct = 25 pts |

### 3. 🃏 Food Card Match

**Concept:** Memory matching game with food cards

```
┌───┐ ┌───┐ ┌───┐ ┌───┐
│ ? │ │🍎│ │ ? │ │ ? │
└───┘ └───┘ └───┘ └───┘
┌───┐ ┌───┐ ┌───┐ ┌───┐
│ ? │ │ ? │ │🍎│ │ ? │
└───┘ └───┘ └───┘ └───┘

Pairs Found: 1/8  Time: 0:45
```

| Difficulty | Cards | Time | Points |
|------------|-------|------|--------|
| Easy | 8 pairs | 2 min | 10 pts |
| Medium | 12 pairs | 2 min | 20 pts |
| Hard | 16 pairs | 2 min | 35 pts |

**Card Types:** Match foods with their calorie counts, macros, or food groups

### 4. ⚡ Speed Logging Challenge

**Concept:** Log meals as fast as possible

```
┌─────────────────────────────────┐
│   SPEED LOG CHALLENGE           │
│                                 │
│   Log 5 foods in 60 seconds!    │
│                                 │
│   ⏱️ 00:45                      │
│                                 │
│   ✅ Chicken breast             │
│   ✅ Rice                       │
│   ✅ Broccoli                   │
│   ⬜ ___________                │
│   ⬜ ___________                │
│                                 │
│   Progress: 3/5                 │
└─────────────────────────────────┘
```

**Rewards:**
- Complete in time = 15 pts
- Under 30 seconds = 25 pts bonus
- Personal best = 10 pts bonus

---

## Quiz & Trivia System

### 1. 📚 Daily Nutrition Quiz

**Concept:** 5 questions per day about nutrition, fitness, health

```
┌─────────────────────────────────┐
│   DAILY QUIZ  •  Question 3/5   │
│                                 │
│   Which food has the most       │
│   protein per 100g?             │
│                                 │
│   ○ Chicken breast              │
│   ○ Greek yogurt                │
│   ○ Eggs                        │
│   ○ Tofu                        │
│                                 │
│   ⏱️ 15 seconds                 │
└─────────────────────────────────┘
```

| Category | Example Questions |
|----------|-------------------|
| **Macros** | "How many calories in 1g of protein?" |
| **Foods** | "Which has more fiber: apple or banana?" |
| **Fitness** | "What muscle does a squat primarily work?" |
| **Health** | "Recommended daily water intake?" |
| **Myths** | "True or False: Eating late causes weight gain" |

**Scoring:**
- Correct answer: 2 pts
- Fast answer (<5s): +1 pt bonus
- All 5 correct: +5 pts bonus
- Perfect week (35/35): +25 pts bonus

### 2. 🏆 Weekly Quiz Tournament

**Concept:** Compete against other users in real-time

```
┌─────────────────────────────────┐
│   QUIZ BATTLE                   │
│                                 │
│   You vs @FitnessFan            │
│                                 │
│   [  4  ]  :  [  3  ]           │
│                                 │
│   Question 8/10                 │
│                                 │
│   What is BMR?                  │
│   ○ Basal Metabolic Rate ✓      │
│   ○ Body Mass Ratio             │
│                                 │
│   Waiting for opponent...       │
└─────────────────────────────────┘
```

| Tournament Type | Players | Entry | Prize Pool |
|-----------------|---------|-------|------------|
| **Quick Match** | 1v1 | Free | 20 pts to winner |
| **Daily Tournament** | 8 players | 10 pts | 100 pts to winner |
| **Weekly Championship** | 64 players | 25 pts | 500 pts + badge |

### 3. 🧠 Fitness IQ Score

**Concept:** Comprehensive knowledge assessment

```
┌─────────────────────────────────┐
│   YOUR FITNESS IQ               │
│                                 │
│         🧠 142                  │
│                                 │
│   Top 15% of users!             │
│                                 │
│   Nutrition:    ████████░░ 80%  │
│   Exercise:     ██████░░░░ 60%  │
│   Health:       █████████░ 90%  │
│   Supplements:  ████░░░░░░ 40%  │
│                                 │
│   [ Take Quiz Again ]           │
│   [ Share Score ]               │
└─────────────────────────────────┘
```

**Features:**
- 50 questions across 5 categories
- Adaptive difficulty
- Monthly retake allowed
- Shareable score card
- Leaderboard by IQ score

---

## Achievement & Badge System

### Badge Categories

#### 🏃 Activity Badges
| Badge | Requirement | Points |
|-------|-------------|--------|
| **First Step** | Log first meal | 5 |
| **Week Warrior** | 7-day streak | 25 |
| **Month Master** | 30-day streak | 100 |
| **Century Club** | 100-day streak | 500 |
| **Year Legend** | 365-day streak | 2000 |

#### 🍎 Nutrition Badges
| Badge | Requirement | Points |
|-------|-------------|--------|
| **Macro Master** | Hit all macros 7 days | 50 |
| **Protein Pro** | Log 150g+ protein 30 days | 75 |
| **Veggie Victor** | Log veggies 14 days straight | 40 |
| **Water Wizard** | Track water 30 days | 60 |
| **Calorie Counter** | Log 1000+ foods | 100 |

#### 💪 Fitness Badges
| Badge | Requirement | Points |
|-------|-------------|--------|
| **Weight Watcher** | Log weight 30 days | 50 |
| **Goal Getter** | Reach goal weight | 200 |
| **Transformation** | Lose/gain 10kg | 300 |
| **Plateau Breaker** | Break 2-week plateau | 75 |

#### 🤝 Social Badges
| Badge | Requirement | Points |
|-------|-------------|--------|
| **Social Butterfly** | 10 followers | 25 |
| **Influencer** | 100 followers | 100 |
| **Viral Post** | Post with 50+ likes | 75 |
| **Helpful Hero** | 50 comments given | 50 |
| **Referral King** | 10 successful referrals | 150 |

#### 🎮 Game Badges
| Badge | Requirement | Points |
|-------|-------------|--------|
| **Quiz Whiz** | 100% on daily quiz | 20 |
| **Spin Master** | 30 daily spins | 30 |
| **Memory Champ** | Perfect card match | 25 |
| **Speed Demon** | Speed log under 20s | 35 |
| **Tournament Victor** | Win weekly tournament | 100 |

### Badge Display

```
┌─────────────────────────────────┐
│   @username's Badges            │
│                                 │
│   🏆 Featured                   │
│   ┌─────┐ ┌─────┐ ┌─────┐      │
│   │ 🔥  │ │ 💪  │ │ 🧠  │      │
│   │100d │ │Goal │ │ IQ  │      │
│   └─────┘ └─────┘ └─────┘      │
│                                 │
│   📊 Progress: 24/50 badges     │
│                                 │
│   [ View All Badges ]           │
└─────────────────────────────────┘
```

---

## Social Competition Features

### 1. ⚔️ 1v1 Challenges

**Concept:** Challenge a friend to a week-long competition

```
┌─────────────────────────────────┐
│   CHALLENGE @FitnessFan         │
│                                 │
│   Choose Challenge Type:        │
│                                 │
│   🔥 Most Calories Burned       │
│   🥗 Best Macro Accuracy        │
│   📝 Most Foods Logged          │
│   ⚖️ Most Weight Lost (%)       │
│   🏆 Most Points Earned         │
│                                 │
│   Duration: [ 1 Week ▼ ]        │
│   Wager: [ 50 pts ▼ ]           │
│                                 │
│   [ Send Challenge ]            │
└─────────────────────────────────┘
```

| Feature | Description |
|---------|-------------|
| **Wager System** | Both players bet points, winner takes all |
| **Live Progress** | See opponent's progress in real-time |
| **Trash Talk** | Quick chat during challenge |
| **History** | Win/loss record against friends |

### 2. 👥 Team Battles

**Concept:** 5v5 team competitions

```
┌─────────────────────────────────┐
│   TEAM BATTLE                   │
│                                 │
│   🔵 Fit Squad    vs   🔴 Gains │
│                                 │
│   Combined Points This Week:    │
│                                 │
│      1,245    :    1,180        │
│                                 │
│   Your Contribution: 312 pts    │
│   Team Rank: #2 of 5            │
│                                 │
│   ⏱️ 3 days remaining           │
└─────────────────────────────────┘
```

| Team Feature | Description |
|--------------|-------------|
| **Create Team** | Invite 4 friends |
| **Random Match** | Auto-match with another team |
| **Team Chat** | Coordinate strategy |
| **MVP Award** | Top contributor gets bonus |
| **Team Badges** | Unlock team achievements |

### 3. 🌍 Global Events

**Concept:** App-wide competitions

```
┌─────────────────────────────────┐
│   🌍 GLOBAL EVENT               │
│                                 │
│   "New Year, New You"           │
│   January Challenge             │
│                                 │
│   Community Goal:               │
│   Log 10,000,000 meals          │
│                                 │
│   Progress: ████████░░ 78%      │
│   7,800,000 / 10,000,000        │
│                                 │
│   Your Contribution: 156 meals  │
│                                 │
│   🎁 Reward: Exclusive Badge    │
│      + 100 pts if goal met      │
└─────────────────────────────────┘
```

---

## Streak & Habit Mechanics

### 1. 🔥 Multi-Streak System

**Track multiple streaks simultaneously:**

```
┌─────────────────────────────────┐
│   YOUR STREAKS                  │
│                                 │
│   🔥 Logging Streak      45 days│
│   💧 Water Streak        12 days│
│   🏋️ Workout Streak      8 days │
│   📸 Post Streak         3 days │
│   🎯 Goal Hit Streak    15 days │
│                                 │
│   🏆 Longest Ever: 67 days      │
└─────────────────────────────────┘
```

### 2. 🛡️ Streak Shields

**Protect streaks from breaking:**

| Shield Type | How to Earn | Protection |
|-------------|-------------|------------|
| **Free Shield** | 1 per month | Skip 1 day |
| **Earned Shield** | 30-day streak | Skip 1 day |
| **Premium Shield** | Premium users | Skip 2 days |
| **Emergency Shield** | Watch ad | Skip 1 day |

### 3. 📅 Streak Calendar

```
┌─────────────────────────────────┐
│   JANUARY 2026                  │
│                                 │
│   Mo Tu We Th Fr Sa Su          │
│   🟢 🟢 🟢 🟢 🟢 🟢 🟢          │
│   🟢 🟢 🟢 🟢 🟢 🟢 🟢          │
│   🟢 🟢 🔴 🟢 🟢 🟢 ⬜          │
│   ⬜ ⬜ ⬜ ⬜ ⬜ ⬜ ⬜          │
│                                 │
│   🟢 Logged  🔴 Missed  🛡️ Shield│
└─────────────────────────────────┘
```

---

## Reward & Loot System

### 1. 🎁 Mystery Boxes

**Earn boxes through various activities:**

| Box Type | How to Earn | Contents |
|----------|-------------|----------|
| **Bronze Box** | Daily login | 5-15 pts |
| **Silver Box** | Weekly goal complete | 20-50 pts + badge chance |
| **Gold Box** | Monthly challenge | 50-150 pts + premium day |
| **Diamond Box** | Special events | Exclusive items |

```
┌─────────────────────────────────┐
│   🎁 MYSTERY BOX                │
│                                 │
│   ┌─────────────────────┐       │
│   │                     │       │
│   │    [ 🎁 GOLD ]      │       │
│   │                     │       │
│   └─────────────────────┘       │
│                                 │
│   [ TAP TO OPEN ]               │
│                                 │
│   Contains: Points, Badges,     │
│   Premium Time, Shields         │
└─────────────────────────────────┘
```

### 2. 💎 Virtual Currency (FitCoins)

**Secondary currency for special items:**

| Earn FitCoins | Spend FitCoins |
|---------------|----------------|
| Daily quiz perfect score | Custom profile frames |
| Tournament wins | Animated badges |
| Referrals | Name colors |
| Premium subscription | Streak shields |

### 3. 🏪 Reward Shop

```
┌─────────────────────────────────┐
│   REWARD SHOP                   │
│                                 │
│   Your FitCoins: 💎 250         │
│                                 │
│   ┌───────┐ ┌───────┐ ┌───────┐│
│   │ 🖼️    │ │ 🛡️    │ │ 🎨    ││
│   │Frame  │ │Shield │ │Theme  ││
│   │💎 100 │ │💎 50  │ │💎 200 ││
│   └───────┘ └───────┘ └───────┘│
│                                 │
│   [ View All Items ]            │
└─────────────────────────────────┘
```

---

## UX Micro-Interactions

### 1. 🎉 Celebrations

**Visual feedback for achievements:**

| Trigger | Animation |
|---------|-----------|
| Goal complete | Confetti explosion |
| Streak milestone | Fire animation |
| Badge earned | Badge zoom + glow |
| Level up | Full-screen celebration |
| Leaderboard climb | Rocket animation |

### 2. 🔊 Sound Effects

| Action | Sound |
|--------|-------|
| Button tap | Soft click |
| Points earned | Coin collect |
| Goal complete | Success chime |
| Streak break | Sad trombone |
| Spin wheel | Wheel spinning |
| Quiz correct | Ding! |
| Quiz wrong | Buzz |

### 3. 📳 Haptic Feedback

| Action | Haptic |
|--------|--------|
| Button press | Light tap |
| Goal complete | Success pattern |
| Points earned | Double tap |
| Spin result | Impact |
| Error | Warning shake |

### 4. ✨ Progress Animations

```
Calorie Progress Bar:
[████████████░░░░░░░░] 1,250 / 2,000
         ↑
    Fills smoothly with glow effect
    
XP Bar with Level:
Level 12 ████████░░░░░░░░░░░░ Level 13
              ↑
    Sparkle particles when gaining XP
```

---

## Web-Specific Gamification

### 1. 🖥️ Interactive Leaderboard

```
┌─────────────────────────────────────────────────┐
│   GLOBAL LEADERBOARD                            │
│                                                 │
│   Filter: [This Week ▼] [All Categories ▼]      │
│                                                 │
│   #1  🥇 @FitKing      12,450 pts   ↑ 3        │
│   #2  🥈 @GainsTrain   11,890 pts   ↓ 1        │
│   #3  🥉 @HealthyLife  11,234 pts   ↑ 5        │
│   ...                                           │
│   #47 ⭐ @You          3,456 pts    ↑ 12       │
│                                                 │
│   [ Find Your Rank ] [ Challenge Someone ]      │
└─────────────────────────────────────────────────┘
```

### 2. 🎮 Browser Games

**Web-exclusive mini-games:**

| Game | Description |
|------|-------------|
| **Calorie Tetris** | Stack foods to hit exact calorie target |
| **Macro Match-3** | Match proteins, carbs, fats |
| **Food Runner** | Endless runner collecting healthy foods |
| **Quiz Showdown** | Multiplayer real-time quiz |

### 3. 📊 Progress Visualization

```
┌─────────────────────────────────────────────────┐
│   YOUR FITNESS JOURNEY                          │
│                                                 │
│   Weight Progress (Interactive Chart)           │
│   ┌─────────────────────────────────────────┐   │
│   │    ╭──╮                                 │   │
│   │   ╭╯  ╰╮    ╭──────────╮               │   │
│   │  ╭╯    ╰────╯          ╰───────        │   │
│   │──╯                                      │   │
│   └─────────────────────────────────────────┘   │
│   Jan  Feb  Mar  Apr  May  Jun                  │
│                                                 │
│   [ Share Progress ] [ Download Report ]        │
└─────────────────────────────────────────────────┘
```

---

## Database Schema

### New Tables Required

```sql
-- Daily spin rewards tracking
CREATE TABLE public.daily_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  spin_date DATE NOT NULL,
  reward_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, spin_date)
);

-- Quiz questions bank
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  quiz_type TEXT NOT NULL, -- 'daily', 'tournament', 'iq_test'
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB, -- {question_id: selected_index}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievement badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User earned badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  badge_id UUID REFERENCES badges(id) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, badge_id)
);

-- 1v1 Challenges
CREATE TABLE public.pvp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES profiles(id) NOT NULL,
  opponent_id UUID REFERENCES profiles(id) NOT NULL,
  challenge_type TEXT NOT NULL,
  wager_amount INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  challenger_score NUMERIC DEFAULT 0,
  opponent_score NUMERIC DEFAULT 0,
  winner_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending', -- pending, active, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams for team battles
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  captain_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE public.team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Mystery boxes inventory
CREATE TABLE public.user_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  box_type TEXT NOT NULL,
  earned_reason TEXT,
  opened_at TIMESTAMPTZ,
  reward JSONB, -- Set when opened
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual currency (FitCoins)
ALTER TABLE public.profiles 
ADD COLUMN fit_coins INTEGER DEFAULT 0;

-- Streak shields
CREATE TABLE public.streak_shields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  shield_type TEXT NOT NULL,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multiple streak tracking
CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  streak_type TEXT NOT NULL, -- 'logging', 'water', 'workout', 'post', 'goal'
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  UNIQUE(user_id, streak_type)
);
```

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 Weeks)
| Feature | Effort | Impact |
|---------|--------|--------|
| Badge system | Medium | High |
| Daily spin wheel | Low | High |
| Confetti animations | Low | Medium |
| Sound effects | Low | Medium |

### Phase 2: Engagement (2-4 Weeks)
| Feature | Effort | Impact |
|---------|--------|--------|
| Daily nutrition quiz | Medium | High |
| Multi-streak tracking | Medium | High |
| Streak shields | Low | Medium |
| Mystery boxes | Medium | High |

### Phase 3: Social (4-6 Weeks)
| Feature | Effort | Impact |
|---------|--------|--------|
| 1v1 challenges | High | High |
| Quiz tournaments | High | Medium |
| Team battles | High | Medium |

### Phase 4: Advanced (6-8 Weeks)
| Feature | Effort | Impact |
|---------|--------|--------|
| Fitness IQ system | Medium | Medium |
| FitCoins economy | High | Medium |
| Reward shop | High | Medium |
| Global events | High | High |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Daily Active Users** | +30% | Analytics |
| **Session Duration** | +50% | Time in app |
| **7-Day Retention** | +25% | Cohort analysis |
| **Streaks > 7 days** | +40% | Database query |
| **Quiz Participation** | 60% of DAU | Quiz attempts |
| **Social Challenges** | 20% of users | PvP table |

---

## Example User Journey

```
Morning:
1. Open app → Daily spin wheel → Win 15 pts 🎰
2. Log breakfast → Streak continues (Day 23!) 🔥
3. Daily quiz notification → 4/5 correct → +9 pts 📚

Afternoon:
4. Friend challenges to "Most Foods Logged" → Accept ⚔️
5. Log lunch → Progress bar fills with animation ✨
6. Hit protein goal → Confetti + badge earned! 🎉

Evening:
7. Complete daily goals → Mystery box earned 🎁
8. Open box → 25 pts + Streak Shield 🛡️
9. Check leaderboard → Moved up 5 spots! 🚀
10. Browse badges → 2 away from "Month Master" 🏆
```

---

**This gamification system transforms FitnessApp from a utility into an engaging experience that users WANT to open daily.**
