'use client';

import { motion } from 'framer-motion';
import { Target, Unlock, TrendingUp, Users, Utensils, Dumbbell, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
  {
    icon: Target,
    number: 1,
    title: 'Tell Us Your Goal',
    description: 'Take our 2-minute assessment. We calculate your exact needs.',
    detail: 'No guessing, no generic plans',
  },
  {
    icon: Unlock,
    number: 2,
    title: 'Get Your Secret System',
    description: 'Custom diet plan (₹100/day meals) + 3-day workout templates',
    detail: 'All 12 secret hacks revealed inside the app',
  },
  {
    icon: TrendingUp,
    number: 3,
    title: 'Track & Transform',
    description: 'Log meals in seconds. Follow your workout plan. Watch your body change.',
    detail: 'Join the community of transformers',
  },
];

const features = [
  {
    icon: Utensils,
    title: 'Budget Meal Database',
    description: 'Indian foods, real prices, optimized macros',
    color: 'orange',
  },
  {
    icon: Dumbbell,
    title: 'No-Equipment Workouts',
    description: 'Home or gym, we have got you covered',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Learn from others using the same secrets',
    color: 'purple',
  },
  {
    icon: Shield,
    title: 'Money-Back Guarantee',
    description: 'If it does not work, get a full refund',
    color: 'green',
  },
];

export function SystemOverviewSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            How ApexOne Makes It Stupid Simple
          </h2>
          <p className="text-lg text-gray-600">
            Three steps to unlock the secrets and start transforming
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-20 transform -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-emerald-300 to-cyan-300 hidden md:block" />
              )}

              <div className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Step Content */}
                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">{step.description}</p>
                  <p className="text-sm text-emerald-600 font-medium">{step.detail}</p>
                </div>

                {/* Step Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xl font-semibold text-gray-900 mb-6">
            Join 1,000+ People Transforming Right Now
          </p>
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white px-12 py-7 text-lg rounded-xl font-semibold shadow-lg"
            >
              Start Your Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
