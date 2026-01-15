'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import FitnessOnboarding from '@/components/onboarding/FitnessOnboarding';

export default function OnboardingPage() {
  const router = useRouter();

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

      // Redirect to download page
      router.push('/download');

    } catch (err) {
      console.error('Failed to save beta signup:', err);
      // Still redirect to download page (don't block user)
      router.push('/download');
    }
  };

  return (
    <FitnessOnboarding
      onComplete={handleOnboardingComplete}
      personalInfo={{
        name: 'Shhubh7',
        instagramUrl: 'https://www.instagram.com/shhubh7?igsh=MXN2ZWx1eWo5OXBzZw==',
        transformationImages: [
          '/images/onboarding/transformation-before.webp',
          '/images/onboarding/transformation-after.webp',
        ],
      }}
    />
  );
}
