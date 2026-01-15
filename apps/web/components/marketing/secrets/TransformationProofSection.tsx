'use client';

import { motion } from 'framer-motion';
import { Instagram, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function TransformationProofSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            "Prove It" - Okay, Here's My Story
          </h2>
          <p className="text-lg text-gray-600">
            From wasting ₹15,000 on supplements to cracking the code
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-200 via-orange-200 to-green-200" />

          {/* Timeline Points */}
          <div className="space-y-16">
            {/* Point 1: Starting Point */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starting Point</h3>
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-red-600">45kg</span>
                  <span className="text-gray-600">| Age 18</span>
                </div>
                <p className="text-gray-600 mb-2">Skinny, weak, desperate</p>
                <p className="text-sm text-red-600 font-medium">Spent ₹15,000 on useless supplements</p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg" />
              <div className="w-1/2 pl-8" />
            </motion.div>

            {/* Point 2: Expensive Mistakes */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center"
            >
              <div className="w-1/2 pr-8" />
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-lg" />
              <div className="w-1/2 pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">The Expensive Mistakes</h3>
                <p className="text-gray-600 mb-3">Tried everything the industry sold:</p>
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <span>₹10k/month diet plans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <span>6-day gym programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <span>Supplement stacks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <span>Personal trainers</span>
                  </li>
                </ul>
                <p className="text-sm text-red-600 font-medium mt-3">
                  Result? Minimal gains, maxed-out credit card.
                </p>
              </div>
            </motion.div>

            {/* Point 3: The Breakthrough */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center"
            >
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">The Breakthrough</h3>
                <p className="text-gray-600 mb-3">I stopped following their rules and started experimenting:</p>
                <ul className="space-y-1 text-gray-700 flex flex-col items-end">
                  <li className="flex items-center gap-2">
                    <span>Budget Indian meals</span>
                    <span className="text-green-600">✓</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>3-day training splits</span>
                    <span className="text-green-600">✓</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>Zero supplements</span>
                    <span className="text-green-600">✓</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>Recovery-focused approach</span>
                    <span className="text-green-600">✓</span>
                  </li>
                </ul>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
              <div className="w-1/2 pl-8" />
            </motion.div>

            {/* Point 4: The Results */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center"
            >
              <div className="w-1/2 pr-8" />
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg" />
              <div className="w-1/2 pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">The Results</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-green-600">75kg</span>
                  <span className="text-gray-600">| 6 Months Later</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">30kg muscle gain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">₹3,000/month cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">No supplements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-semibold text-gray-800">No torture</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cycle Proof & Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Did it Again. And Again.</h3>
            <p className="text-gray-700 mb-4">
              Bulked to 75kg, cut to 60kg, back to 75kg - <span className="font-bold text-purple-600">3 complete cycles.</span>
              <br />
              Same system every time. That's how I know it works.
            </p>
            <Link href="https://www.instagram.com/shhubh7?igsh=MXN2ZWx1eWo5OXBzZw==" target="_blank">
              <Button
                variant="outline"
                className="border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-semibold gap-2"
              >
                <Instagram className="w-5 h-5" />
                @shhubh7 - See My Full Journey
              </Button>
            </Link>
          </div>

          <blockquote className="text-xl italic text-gray-700 max-w-2xl mx-auto">
            "I built ApexOne so you don't waste years like I did.
            <br />
            <span className="font-bold text-orange-600">The secrets are inside.</span>"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
