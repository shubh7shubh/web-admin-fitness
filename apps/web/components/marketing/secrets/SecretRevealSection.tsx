'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecretsProgressBar } from './shared/SecretsProgressBar';
import { UnlockAnimation } from './shared/UnlockAnimation';
import Link from 'next/link';

const secrets = [
  {
    id: 1,
    title: 'The ₹100/Day Muscle Fuel Formula',
    teaser: 'Most trainers want you buying ₹500/day meal plans...',
    content: {
      intro: "Here's what actually works:",
      points: [
        'Rice + Dal + Eggs = Complete protein profile',
        'Total cost: ₹80-120 per day',
        'Same results as ₹10k "custom plans"',
        'I used this exact formula to gain 30kg',
      ],
      proTip: '200g protein for ₹100/day is possible',
    },
  },
  {
    id: 2,
    title: 'The 3-Day Growth Hack',
    teaser: 'The supplement industry wants you training 6 days/week...',
    content: {
      intro: "Reality: Muscle grows during rest, not workouts.",
      points: [
        '3 hard training days per week',
        '4 recovery days',
        'More muscle, less burnout',
        'No recovery supplements needed',
      ],
      proTip: 'Actors use this for movie transformations',
    },
  },
];

const lockedSecrets = [
  'Meal timing hacks that boost muscle gain',
  'Budget food swaps for premium nutrition',
  'Zero-equipment workout templates',
  'Plateau-breaking techniques',
  'Sleep optimization for recovery',
  'The cutting formula (lose fat, keep muscle)',
  'Calorie cycling for faster results',
  'Protein distribution secrets',
  'The bulk without belly method',
  'Maintenance mode strategy',
];

export function SecretRevealSection() {
  const [expandedSecret, setExpandedSecret] = useState<number | null>(null);

  return (
    <section id="secrets" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            Okay, Here Are 2 Secrets For Free
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            (There are 10 more inside ApexOne)
          </p>
          <SecretsProgressBar unlocked={2} total={12} />
        </motion.div>

        {/* Secret Cards */}
        <div className="space-y-6 mb-12">
          {secrets.map((secret, index) => (
            <motion.div
              key={secret.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden"
            >
              {/* Secret Header */}
              <button
                onClick={() => setExpandedSecret(expandedSecret === secret.id ? null : secret.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <UnlockAnimation isUnlocked={true} size={32} />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      SECRET #{secret.id}: {secret.title}
                    </h3>
                    <p className="text-sm text-gray-600">{secret.teaser}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSecret === secret.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                </motion.div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedSecret === secret.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50"
                  >
                    <div className="p-6">
                      <p className="text-gray-700 font-medium mb-4">{secret.content.intro}</p>
                      <ul className="space-y-2 mb-6">
                        {secret.content.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span className="text-gray-800">{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r-lg">
                        <p className="text-sm font-semibold text-orange-800">
                          💡 Pro Tip: {secret.content.proTip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Locked Secrets Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-orange-400" />
            <h3 className="text-2xl font-bold">10 More Secrets Waiting Inside</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {lockedSecrets.map((secret, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-2 text-gray-300"
              >
                <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm">{secret}</span>
              </motion.div>
            ))}
          </div>
          <Link href="/onboarding">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-lg py-6 rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Get All 12 Secrets Inside ApexOne
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
