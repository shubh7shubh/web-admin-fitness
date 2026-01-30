'use client';

import { motion } from 'framer-motion';
import { X, Check, DollarSign, Zap, PillBottle } from 'lucide-react';

const lies = [
  {
    icon: DollarSign,
    lie: 'Spend ₹10,000+/Month on Diet Plans',
    reality: 'I transformed on ₹3,000/month',
    detail: "That's LESS than a month of protein powder",
    color: 'orange',
  },
  {
    icon: Zap,
    lie: 'Train 6 Days a Week or Fail',
    reality: 'Smart training beats gym torture',
    detail: 'You need recovery to grow',
    color: 'red',
  },
  {
    icon: PillBottle,
    lie: 'Buy Expensive Supplements to Grow',
    reality: 'Zero supplements needed',
    detail: 'Food is medicine. Marketing is poison',
    color: 'purple',
  },
];

export function IndustryLiesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-100 to-white">
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
            The Fitness Industry's Biggest Lies
          </h2>
          <p className="text-lg text-gray-600">
            (That Keep You Broke and Confused)
          </p>
        </motion.div>

        {/* Lies Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {lies.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Lie Card */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-4 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <X className="w-8 h-8 text-red-600" strokeWidth={3} />
                </div>
                <item.icon className={`w-12 h-12 text-${item.color}-600 mb-4`} />
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-through decoration-red-600 decoration-2">
                  {item.lie}
                </h3>
                <p className="text-sm text-gray-600">Industry wants you to believe this</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-2">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-green-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </div>

              {/* Reality Card */}
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 relative">
                <div className="absolute top-4 right-4">
                  <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.reality}
                </h3>
                <p className="text-sm text-green-700 font-medium">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xl font-semibold text-gray-900 mb-4">
            I'll show you exactly what works instead
          </p>
          <a
            href="#app-features"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group"
          >
            Explore the App
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
