# FitnessOnboarding Implementation Plan

## Overview
Integrate a mobile-first, unskippable 4-screen onboarding flow into the web version to capture beta leads, educate users, and drive APK downloads.

## Approach Summary
- Convert root page from server to client component with conditional rendering
- Show onboarding to first-time visitors, marketing site to returning visitors
- Use localStorage to track completion
- Collect phone/email in DPDPA-compliant form
- Store leads in Supabase beta_waitlist table
- Redirect to download page after completion

---

## Implementation Steps

### 1. Install Dependencies ⚡
**Time: 5 minutes**

```bash
cd /Users/apple/Documents/GitHub/fitness-web/apps/web
npm install framer-motion@^11.11.17
```

**Rationale:** framer-motion is the only missing dependency. lucide-react (v0.562.0) is already installed.

---

### 2. Create Supabase Database Table 🗄️
**Time: 15 minutes**

Run this SQL migration in your Supabase SQL Editor:

```sql
-- Beta Waitlist Table
CREATE TABLE IF NOT EXISTS public.beta_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT,
  email TEXT,
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT DEFAULT 'web_onboarding' NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT at_least_one_contact CHECK (
    phone_number IS NOT NULL OR email IS NOT NULL
  ),
  CONSTRAINT valid_phone_format CHECK (
    phone_number IS NULL OR phone_number ~ '^[6-9][0-9]{9}$'
  )
);

-- Indexes
CREATE INDEX idx_beta_waitlist_phone ON public.beta_waitlist(phone_number);
CREATE INDEX idx_beta_waitlist_email ON public.beta_waitlist(email);
CREATE INDEX idx_beta_waitlist_created ON public.beta_waitlist(created_at DESC);

-- RLS Policies
ALTER TABLE public.beta_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.beta_waitlist
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON public.beta_waitlist
  FOR SELECT TO authenticated USING (true);

-- Duplicate Prevention Trigger
CREATE OR REPLACE FUNCTION check_duplicate_beta_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone_number IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.beta_waitlist
      WHERE phone_number = NEW.phone_number
      AND created_at > NOW() - INTERVAL '7 days'
    ) THEN
      RAISE EXCEPTION 'Phone number already registered recently';
    END IF;
  END IF;

  IF NEW.email IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.beta_waitlist
      WHERE email = NEW.email
      AND created_at > NOW() - INTERVAL '7 days'
    ) THEN
      RAISE EXCEPTION 'Email already registered recently';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_duplicate_beta_signup
  BEFORE INSERT ON public.beta_waitlist
  FOR EACH ROW EXECUTE FUNCTION check_duplicate_beta_signup();
```

**Key Features:**
- Phone OR email required (reduces friction)
- 7-day duplicate prevention window
- Indian phone validation (10 digits, starts with 6-9)
- DPDPA-compliant consent tracking

---

### 3. Add Transformation Images 📸
**Time: 20 minutes**

**Steps:**
1. Create directory: `mkdir -p apps/web/public/images/onboarding`
2. Optimize your transformation photos:
   - Convert to WebP format (use Squoosh.app or sharp)
   - Target size: <200KB per image
   - Recommended dimensions: 800x800px
3. Save as:
   - `transformation-before.webp`
   - `transformation-after.webp`

**Optional but recommended:** Create responsive sizes (400px, 800px) for better mobile performance.

---

### 4. Create Onboarding Component 🎨
**Time: 30 minutes**

**File:** `apps/web/components/onboarding/FitnessOnboarding.tsx`

**Screen 1 Design - "I Found the Secret Nobody Talks About"**

The first screen introduces ApexOne with a compelling hook:

**Layout (Ultra-Compact, No Scroll):**
- **Title:** "I Found the Secret Nobody Talks About"
- **Subtitle:** "ApexOne"
- **Photos:** 2 transformation photos (square format, side-by-side)
- **Content Box:**
  - Industry lies (❌ ₹10k+/month, ❌ 6 days/week, ❌ Supplements)
  - Your truth (✓ ₹3k/month, ✓ No gym torture, ✓ Zero supplements)
  - "45kg → 75kg" transformation stats
  - ApexOne = Proven System CTA
- **Instagram Button:** "See My Full Journey"

**Design Philosophy:**
- **Mobile-First:** Everything fits on one screen without scrolling
- **Compact:** 11px-12px text, tight spacing (space-y-3)
- **Square Photos:** aspect-square for less vertical height
- **Vertical Centering:** Content centered to eliminate white space
- **Fast Animations:** Staggered reveals (0.1s-0.6s delays)

**Key Implementation Notes:**
- Component uses framer-motion for animations
- Prevents back button navigation (history.pushState)
- Validates Indian phone numbers (10 digits, starts with 6-9)
- Email OR phone required (not both)
- DPDPA-compliant consent checkbox
- No celebrity names (legally safe)

**Create barrel export:**
**File:** `apps/web/components/onboarding/index.ts`
```typescript
export { default } from './FitnessOnboarding';
```

---

### 5. Modify Root Page (Critical) 🏠
**Time: 45 minutes**

**File:** `apps/web/app/page.tsx`

**Current state:** Server component showing marketing site
**Target state:** Client component with conditional onboarding

**Implementation:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { Header, Footer, HeroSection, FeaturesSection, CTASection } from '@/components/marketing';

// Lazy load onboarding (client-side only)
const FitnessOnboarding = dynamic(
  () => import('@/components/onboarding/FitnessOnboarding'),
  { ssr: false }
);

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hasCompleted = localStorage.getItem('hasSeenOnboarding');
    setShowOnboarding(!hasCompleted);
  }, []);

  const handleOnboardingComplete = async (data: {
    phoneNumber?: string;
    email?: string;
  }) => {
    try {
      const supabase = createClient();

      const { error } = await supabase.from('beta_waitlist').insert({
        phone_number: data.phoneNumber || null,
        email: data.email || null,
        consent_marketing: true,
        consent_timestamp: new Date().toISOString(),
        source: 'web_onboarding',
        user_agent: navigator.userAgent,
      });

      if (error && !error.message.includes('already registered')) {
        throw error;
      }

      localStorage.setItem('hasSeenOnboarding', 'true');
      router.push('/download');

    } catch (err) {
      console.error('Failed to save beta signup:', err);
      // Still redirect to download page (don't block user)
      localStorage.setItem('hasSeenOnboarding', 'true');
      router.push('/download');
    }
  };

  // Loading state (prevent flash)
  if (showOnboarding === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // First-time visitor: Show onboarding
  if (showOnboarding) {
    return (
      <FitnessOnboarding
        onComplete={handleOnboardingComplete}
        personalInfo={{
          name: 'Your Name', // TODO: Update with your name
          instagramUrl: 'https://instagram.com/yourusername', // TODO: Update
          transformationImages: [
            '/images/onboarding/transformation-before.webp',
            '/images/onboarding/transformation-after.webp',
          ],
        }}
      />
    );
  }

  // Returning visitor: Show marketing site
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "ApexOne",
            applicationCategory: "HealthApplication",
            operatingSystem: "Android, iOS",
            description: "Gamified fitness tracking app with calorie counting, macro tracking, social challenges, and leaderboards.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "10000",
            },
          }),
        }}
      />
    </>
  );
}
```

**Critical Changes:**
- Add `'use client'` directive at top
- Import `dynamic` from next/dynamic
- Add state management with useState
- Add localStorage check in useEffect
- Implement handleOnboardingComplete with Supabase insert
- Add loading state to prevent content flash
- Conditional rendering based on showOnboarding flag

---

### 6. Create Privacy Policy Page 📜
**Time: 30 minutes**

**File:** `apps/web/app/privacy/page.tsx`

**Structure:**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ApexOne Fitness',
  description: 'Data protection practices in compliance with DPDPA',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 lg:p-12">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 8, 2026</p>

        {/* Section 1: Data Collection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4 text-gray-700">
            When you sign up for beta access, we collect:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Contact information (phone number and/or email address)</li>
            <li>Device information (browser type, operating system)</li>
            <li>Usage data (how you interact with our website)</li>
          </ul>
        </section>

        {/* Section 2: How We Use Your Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Notify you about the app launch and beta updates</li>
            <li>Send fitness tips (only if consented)</li>
            <li>Improve our services</li>
          </ul>
        </section>

        {/* Section 3: DPDPA Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Your Rights Under DPDPA</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Right to Access:</strong> Request a copy of your data</li>
            <li><strong>Right to Correction:</strong> Update inaccurate data</li>
            <li><strong>Right to Deletion:</strong> Request data deletion</li>
            <li><strong>Right to Withdraw Consent:</strong> Opt-out anytime</li>
          </ul>
        </section>

        {/* Section 4: Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-700">
            We store your data securely using Supabase with industry-standard encryption.
          </p>
        </section>

        {/* Section 5: How to Unsubscribe */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. How to Unsubscribe</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Reply "STOP" to any WhatsApp message or SMS</li>
            <li>Click "Unsubscribe" in any email</li>
            <li>Email us at: privacy@apexone.fitness</li>
          </ul>
        </section>

        {/* Section 6: Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              Email: <a href="mailto:privacy@apexone.fitness" className="text-blue-600">privacy@apexone.fitness</a>
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </article>
    </div>
  );
}
```

**DPDPA Compliance Checklist:**
- ✅ Clear data collection disclosure
- ✅ Purpose of data usage
- ✅ User rights explained
- ✅ Easy opt-out mechanism
- ✅ Contact information for privacy queries

---

### 7. Create Download Page 📥
**Time: 30 minutes**

**File:** `apps/web/app/download/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Download, CheckCircle, Smartphone, Shield, Zap } from 'lucide-react';

export default function DownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  // TODO: Replace with actual APK URL from EAS Build
  const apkUrl = process.env.NEXT_PUBLIC_APK_URL || '#';

  const handleDownload = () => {
    setIsDownloading(true);
    window.location.href = apkUrl;
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">You're In! 🎉</h1>
          <p className="text-lg text-gray-600">
            Welcome to the ApexOne beta. Let's start your transformation!
          </p>
        </div>

        {/* Download Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-3 mb-6"
          >
            {isDownloading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download APK (Beta)
              </>
            )}
          </button>

          {/* Installation Instructions */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-600" />
              Installation Steps
            </h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="pt-0.5">Tap "Download APK" button above</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="pt-0.5">Open downloaded file from notifications</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="pt-0.5">Allow "Install from unknown sources" if prompted</span>
              </li>
              <li className="flex gap-3">
                <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="pt-0.5">Tap "Install" and open the app</span>
              </li>
            </ol>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Instant Access</h3>
              <p className="text-xs text-gray-600 mt-1">Start tracking today</p>
            </div>
            <div className="text-center p-4">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">100% Safe</h3>
              <p className="text-xs text-gray-600 mt-1">Secure & private</p>
            </div>
            <div className="text-center p-4">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Beta Exclusive</h3>
              <p className="text-xs text-gray-600 mt-1">Early access perks</p>
            </div>
          </div>

          {/* Beta Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>🔒 Beta Version:</strong> This is a pre-release version for testing.
              We'll notify you when the app launches on Google Play Store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Environment Variable Needed:**
Add to `.env.local`: `NEXT_PUBLIC_APK_URL=your-apk-download-url`

---

### 8. Environment Setup 🔧
**Time: 5 minutes**

**File:** `apps/web/.env.local`

Add (if not already present):
```env
# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# APK Download URL (add this)
NEXT_PUBLIC_APK_URL=https://your-apk-url.com/app.apk
```

**For Vercel Deployment:**
Add the same variables in Vercel Dashboard → Settings → Environment Variables

---

### 9. Testing Checklist ✅
**Time: 1-2 hours**

**Functional Tests:**
- [ ] Install framer-motion dependency
- [ ] Run Supabase migration
- [ ] Upload transformation images
- [ ] Update personalInfo in app/page.tsx (name, Instagram)
- [ ] Test onboarding flow on desktop
- [ ] Test all 4 screens render correctly
- [ ] Test phone number validation (10 digits, starts with 6-9)
- [ ] Test email validation
- [ ] Test "at least one contact required" validation
- [ ] Test consent checkbox requirement
- [ ] Test form submission to Supabase
- [ ] Test duplicate prevention (try same phone/email twice)
- [ ] Test localStorage persistence
- [ ] Test redirect to /download after completion
- [ ] Test returning visitor sees marketing site (not onboarding)

**Mobile Tests:**
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on small screen (iPhone SE)
- [ ] Test animations are smooth
- [ ] Test touch targets are large enough
- [ ] Test back button is disabled during onboarding
- [ ] Test images load properly
- [ ] Test forms work with mobile keyboard

**Performance:**
- [ ] Run Lighthouse audit (target: >90 performance)
- [ ] Check bundle size (use `npm run build`)
- [ ] Test on slow 3G connection (Chrome DevTools)
- [ ] Verify images are optimized (WebP, <200KB)

---

## Critical Files to Modify

| File Path | Action | Complexity |
|-----------|--------|------------|
| `apps/web/package.json` | Add framer-motion | LOW |
| `apps/web/components/onboarding/FitnessOnboarding.tsx` | Create component | MEDIUM |
| `apps/web/app/page.tsx` | Convert to client component, add conditional logic | HIGH |
| `apps/web/app/privacy/page.tsx` | Create privacy policy | LOW |
| `apps/web/app/download/page.tsx` | Create download page | LOW |
| `apps/web/.env.local` | Add APK URL variable | LOW |
| Supabase SQL Editor | Create beta_waitlist table | MEDIUM |

---

## Legal & Compliance Considerations

### ✅ DPDPA Compliance
- Explicit consent checkbox (not pre-checked) ✅
- Clear purpose statement ✅
- Link to privacy policy ✅
- Consent timestamp stored ✅
- Easy opt-out mechanism ✅
- Data minimization (phone OR email) ✅

### ⚠️ Celebrity Names - DO NOT USE
**Avoid:**
- "Aamir Khan gained 20kg for Dangal"
- "Sara Ali Khan lost 40kg"
- "Aashish Chanchlani's transformation"

**Use instead (Screen 3):**
- "Professional actors gain 15-20kg muscle for action roles"
- "40kg weight loss transformations using systematic methods"
- "Content creators build fitness while working 12-hour days"

**Legal Risk:** Using celebrity names without permission violates:
- Trade Marks Act, 1999 (Section 14)
- Right of Publicity (common law)
- Can result in lawsuits (₹5-50 lakhs in legal fees)

---

## Success Metrics

**Target Conversion Rates:**
- Onboarding completion: >60%
- Lead capture: >50%
- Download rate: >40%

**Track with Vercel Analytics:**
- `onboarding_screen_view` - Screen progression
- `onboarding_complete` - Form submission
- `apk_download_click` - Download button clicks

---

## Post-Deployment Monitoring

**First 24 Hours:**
1. Monitor Supabase logs for inserts
2. Check Vercel Analytics for traffic
3. Test on real mobile devices
4. Review error logs (Vercel → Functions)
5. Verify localStorage working across browsers

**First Week:**
1. Analyze conversion funnel
2. Identify drop-off points
3. Collect user feedback
4. Fix critical bugs
5. Optimize based on data

---

## Estimated Timeline

| Phase | Time | Priority |
|-------|------|----------|
| Setup (Steps 1-3) | 40 min | CRITICAL |
| Component Creation (Step 4) | 30 min | HIGH |
| Page Modifications (Steps 5-7) | 2 hrs | CRITICAL |
| Testing (Step 9) | 1-2 hrs | HIGH |
| **TOTAL** | **4-5 hrs** | - |

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd /Users/apple/Documents/GitHub/fitness-web/apps/web
npm install framer-motion@^11.11.17

# 2. Create directories
mkdir -p components/onboarding
mkdir -p public/images/onboarding

# 3. Run dev server
npm run dev

# 4. Test at http://localhost:3000
# (Clear localStorage to see onboarding again)
```

---

## Troubleshooting

**Problem:** Onboarding shows every time
**Solution:** Check browser DevTools → Application → Local Storage → `hasSeenOnboarding` should be `'true'`

**Problem:** Form submission fails
**Solution:** Check Supabase table exists and RLS policies are correct

**Problem:** Images not loading
**Solution:** Verify files exist in `public/images/onboarding/` and paths are correct

**Problem:** Back button not prevented
**Solution:** Ensure FitnessOnboarding.tsx has `history.pushState` useEffect

**Problem:** Duplicate submissions not prevented
**Solution:** Check trigger function exists in Supabase

---

## Next Steps After Launch

1. **Week 1:** Monitor conversions, fix bugs
2. **Week 2-4:** A/B test CTAs, form fields, incentives
3. **Month 2:** Add analytics dashboard, user testimonials
4. **Future:** Multi-language support, PWA features, referral tracking
