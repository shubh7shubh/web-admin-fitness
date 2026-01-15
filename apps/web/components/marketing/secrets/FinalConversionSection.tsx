'use client';

import { motion } from 'framer-motion';
import { Sparkles, Check, X, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const comparison = [
  { lie: 'Spend ₹10k+/month on fake plans', truth: 'Transform for ₹3k/month' },
  { lie: 'Train 6 days, burn out', truth: '3 smart sessions/week' },
  { lie: 'Buy useless supplements', truth: 'Zero supplements needed' },
  { lie: 'Stay confused and frustrated', truth: 'Know exactly what works' },
  { lie: 'Waste another year', truth: 'Start today' },
];

export function FinalConversionSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-orange-900 overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            The Choice Is Yours
          </h2>
          <p className="text-lg text-gray-300">
            Keep following the lies, or learn the secrets
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Keep Following Lies */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-red-900/30 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <X className="w-8 h-8 text-red-400" />
              <h3 className="text-2xl font-bold text-white">Keep Following The Lies</h3>
            </div>
            <ul className="space-y-4">
              {comparison.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{item.lie}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Learn The Secrets */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-green-900/30 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Check className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Learn The Secrets</h3>
            </div>
            <ul className="space-y-4">
              {comparison.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{item.truth}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Urgency Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/50 rounded-xl p-6 mb-12 text-center"
        >
          <p className="text-orange-300 font-semibold mb-2">⏰ Beta Access: Limited Spots Available</p>
          <p className="text-white">🚀 Just Launched. Don't miss out on early access benefits.</p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-16 mb-16"
        >
          {/* Primary CTA */}
          <Link href="/onboarding">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 sm:px-12 py-4 sm:py-6 text-base sm:text-xl rounded-xl font-bold shadow-2xl shadow-orange-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="text-center">Reveal All 12 Secrets + Start Transforming</span>
            </Button>
          </Link>

          {/* Secondary CTA */}
          <Link href="/download" className="flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-400 text-gray-300 hover:bg-white/10 px-6 py-3 text-base rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Just Download the App
            </Button>
          </Link>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-12"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Zero-risk guarantee</span>
          </div>
        </motion.div>

        {/* Final Hook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-xl text-gray-300 italic">
            "A year from now, you'll wish you started today.
            <br />
            <span className="text-orange-400 font-bold not-italic">The secrets are waiting inside.</span>"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
