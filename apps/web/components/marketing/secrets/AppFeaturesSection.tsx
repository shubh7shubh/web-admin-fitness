'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Smartphone,
  Download,
  Sparkles,
  UtensilsCrossed,
  Search,
  TrendingUp,
  Trophy,
  Users,
  MessageCircle,
  Crown,
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const appScreenshots = [
  {
    src: '/images/app-features/home.png',
    alt: 'Home Dashboard - Track calories, macros, and weekly goals',
    label: 'Home Dashboard',
  },
  {
    src: '/images/app-features/my_diary.png',
    alt: 'My Diary - Log breakfast, lunch, dinner, and snacks',
    label: 'Food Diary',
  },
  {
    src: '/images/app-features/progress.png',
    alt: 'Progress - Weight tracking with charts and entries',
    label: 'Progress Tracking',
  },
  {
    src: '/images/app-features/feed.png',
    alt: 'Social Feed - Community posts and engagement',
    label: 'Social Feed',
  },
  {
    src: '/images/app-features/leaderboard.png',
    alt: 'Leaderboard - Shop and compete with others',
    label: 'Leaderboard & Shop',
  },
  {
    src: '/images/app-features/assessment_form.png',
    alt: 'Premium Assessment - Personalized fitness questionnaire',
    label: 'Premium Assessment',
  },
  {
    src: '/images/app-features/plan_creation.png',
    alt: 'Plan Creation - Expert coaches craft your plan in 24-48 hours',
    label: 'Expert Plan Creation',
  },
  {
    src: '/images/app-features/diet_plan.png',
    alt: 'Diet Plan - Personalized daily meals with macros and one-tap logging',
    label: 'Personalized Diet Plan',
  },
  {
    src: '/images/app-features/workout_plan.png',
    alt: 'Workout Plan - Custom exercises with sets, reps, and instructions',
    label: 'Custom Workout Plan',
  },
];

const appFeatures = [
  {
    id: 1,
    icon: UtensilsCrossed,
    title: 'Daily Diary',
    description:
      'Log meals and exercises with full macro tracking. Know exactly what you eat every day.',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 2,
    icon: Search,
    title: 'Nutrition Database',
    description:
      'Search thousands of foods with detailed nutritional info. Indian foods included.',
    gradient: 'from-emerald-400 to-cyan-500',
  },
  {
    id: 3,
    icon: TrendingUp,
    title: 'Progress Tracking',
    description:
      'Visual weight charts and goal progression. See your transformation unfold.',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: 4,
    icon: Trophy,
    title: 'Points & Gamification',
    description:
      'Earn points for logging, streaks, and challenges. Climb the leaderboard.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    id: 5,
    icon: Users,
    title: 'Social Feed',
    description:
      'Share progress with the community. Top performers get prioritized visibility.',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    id: 6,
    icon: MessageCircle,
    title: 'Direct Messaging',
    description:
      'Real-time 1-on-1 chat with other fitness enthusiasts you follow.',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    id: 7,
    icon: Crown,
    title: 'Premium Plans',
    description:
      'Expert-created diet and workout plans. One-tap meal logging from your plan.',
    gradient: 'from-rose-400 to-red-500',
  },
  {
    id: 8,
    icon: Target,
    title: 'Fitness Challenges',
    description:
      'Join 30-day challenges, track progress, and earn bonus points on completion.',
    gradient: 'from-teal-400 to-emerald-500',
  },
];

export function AppFeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const isGalleryInView = useInView(galleryRef, { once: true });

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="app-features" className="overflow-hidden">
      {/* Hero Banner */}
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* App Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl shadow-orange-500/25"
            >
              <Smartphone className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Meet the{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                ApexOne
              </span>{' '}
              App
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Everything you need to track nutrition, crush goals, and transform
              your body — in one app.
            </p>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-500/30">
                <Download className="w-4 h-4 text-orange-400" />
                <span className="text-white font-medium text-sm">Free Download</span>
              </span>
              <span className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-gray-300 text-sm font-medium">
                Beta
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Screenshot Gallery */}
        <div ref={galleryRef} className="relative max-w-7xl mx-auto">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 px-4 sm:px-8 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {appScreenshots.map((screenshot, index) => (
              <motion.div
                key={screenshot.src}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={
                  isGalleryInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 30, scale: 0.95 }
                }
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex-shrink-0 snap-center"
              >
                <div className="relative w-[220px] sm:w-[260px] group">
                  {/* Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Screenshot */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={260}
                      height={563}
                      className="w-full h-auto"
                      quality={90}
                    />
                  </div>
                  {/* Label */}
                  <p className="text-center text-sm text-gray-400 mt-3 font-medium">
                    {screenshot.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll hint on mobile */}
          <div className="flex justify-center gap-1.5 mt-2 md:hidden">
            {appScreenshots.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/30"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Packed with Features
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Built for real results, not just counting calories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-white text-center"
          >
            <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to Transform?
            </h3>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Join thousands already using ApexOne to track, compete, and crush
              their fitness goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-lg py-6 px-8 rounded-xl flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download ApexOne
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gray-800 border-2 border-gray-600 text-white hover:bg-gray-700 font-semibold text-lg py-6 px-8 rounded-xl"
                >
                  Start on Web
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
