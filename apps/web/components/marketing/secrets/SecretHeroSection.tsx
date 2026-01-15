'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles } from 'lucide-react';

export function SecretHeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/50 border border-red-500/50 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-300">
              The Secret They Don't Want You to Know
            </span>
          </motion.div>

          {/* Main Headline with Sequential Reveal */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="block"
            >
              I Found the Fitness Secret
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
            >
              Nobody Talks About
            </motion.span>
          </motion.h1>

          {/* Subheadline with mystery */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            And proved the entire industry wrong.{' '}
            <span className="text-orange-400 font-semibold">45kg to 75kg. Multiple times.</span>
            <br />
            No supplements. No 6-day torture. No ₹10k+ diets.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-7 text-lg rounded-xl font-semibold shadow-lg shadow-orange-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Reveal the Secrets
              </Button>
            </Link>
            <Link href="/download">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-400 text-gray-300 hover:bg-white/10 px-10 py-7 text-lg rounded-xl"
              >
                Download Now
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-orange-400">Your turn to succeed</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full" />
            <div className="px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
              <span className="text-sm font-medium text-green-400">✓ 100% Money-back guarantee</span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-20"
          >
            <ChevronDown className="w-6 h-6 text-gray-500 mx-auto" />
            <span className="text-xs text-gray-500 block mt-2">Scroll to see proof</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
