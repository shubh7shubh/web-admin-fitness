'use client';

import { motion } from 'framer-motion';
import {
  TrendingDown,
  Dumbbell,
  Clock,
  Home,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

const results = [
  {
    icon: TrendingDown,
    number: '-10',
    unit: 'kg',
    label: 'Fat Loss',
    sublabel: 'in 2 months',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Dumbbell,
    number: '+10',
    unit: 'kg',
    label: 'Muscle Gain',
    sublabel: 'in 2 months',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    number: '60',
    unit: '',
    label: 'Days',
    sublabel: 'to transform',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const sellingPoints = [
  { icon: Clock, text: 'Any Schedule', detail: 'Night or day shift' },
  { icon: Home, text: 'No Gym Required', detail: 'Train from home' },
  { icon: IndianRupee, text: 'Under ₹3,000/mo', detail: 'Affordable plans' },
];

export function TransformationResultsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            Your Transformation Starts Here
          </h2>
          <p className="text-gray-600 text-lg">
            Real results. Your timeline. Your rules.
          </p>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${result.gradient} flex items-center justify-center`}
              >
                <result.icon className="w-6 h-6 text-white" />
              </div>
              <div className="mb-2">
                <span
                  className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${result.gradient} bg-clip-text text-transparent`}
                >
                  {result.number}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-gray-700">
                  {result.unit}
                </span>
              </div>
              <p className="text-gray-900 font-semibold">{result.label}</p>
              <p className="text-gray-500 text-sm">{result.sublabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Selling Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {sellingPoints.map((point) => (
            <div
              key={point.text}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2.5 border border-gray-200 shadow-sm"
            >
              <point.icon className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-gray-900">{point.text}</span>
              <span className="text-gray-500 text-sm hidden sm:inline">
                · {point.detail}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Money-Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 sm:p-8 text-center border border-emerald-200"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            100% Money-Back Guarantee
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Not satisfied with your results? Full refund within 30 days. No
            questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
