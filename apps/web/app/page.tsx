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
          name: 'Shhubh7', // TODO: Update with your name
          instagramUrl: 'https://www.instagram.com/shhubh7?igsh=MXN2ZWx1eWo5OXBzZw==', // TODO: Update
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
