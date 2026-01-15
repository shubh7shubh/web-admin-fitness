'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ChevronRight, Sparkles, Trophy, Users, Download } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  canSkip: boolean;
}

interface OnboardingProps {
  onComplete: (data: { phoneNumber?: string; email?: string }) => void;
  personalInfo?: {
    name: string;
    instagramUrl: string;
    transformationImages: string[];
  };
}

const FitnessOnboarding: React.FC<OnboardingProps> = ({ onComplete, personalInfo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent scrolling during onboarding
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Prevent back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const validatePhoneNumber = (phone: string): boolean => {
    // Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Validate final step
      const newErrors: Record<string, string> = {};

      if (!formData.phoneNumber && !formData.email) {
        newErrors.contact = 'Please provide either phone number or email';
      }

      if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
      }

      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.consent) {
        newErrors.consent = 'Please agree to receive updates';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      onComplete(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "I Found the Secret Nobody Talks About",
      subtitle: "ApexOne",
      content: (
        <div>
          {/* Transformation Photos - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-1"
          >
            {personalInfo?.transformationImages.slice(0, 2).map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="aspect-[3.5/4] rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={img}
                  alt={`Transformation ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Main Message - Ultra Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-1.5 rounded-xl space-y-0.5 mt-4"
          >
            {/* The Lie - Condensed */}
            <div className="space-y-0.5 mb-1">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">
                The fitness industry wants you to believe:
              </p>
              <div className="space-y-0 text-[11px] leading-tight ">
                <p className="text-gray-600 dark:text-gray-400">❌ "Spend ₹10k+ on diet"</p>
                <p className="text-gray-600 dark:text-gray-400">❌ "Train 6 days a week"</p>
                <p className="text-gray-600 dark:text-gray-400">❌ "Buy expensive supplements"</p>
              </div>
            </div>

            {/* The Truth - Condensed */}
            <div className="border-t border-orange-200 dark:border-orange-800 pt-1">
              <p className="text-xs font-bold text-orange-700 dark:text-orange-400 mb-0.5">
                I proved them ALL wrong.
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-0.5">
                From 45kg to 75kg (and back) multiple times, I cracked the code:
              </p>

              <div className="space-y-0 text-[11px] leading-tight">
                <p className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Even <span className="font-bold text-green-600">₹3,000/month</span> is enough to fuel muscle growth - that's LESS than a month's protein powder
                  </span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Transform without daily gym torture</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Zero supplements needed</span>
                </p>
                                <p className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Money back guarantee</span>
                </p>
              </div>
            </div>

            {/* ApexOne CTA - Compact */}
            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-1.5 text-center">
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                ApexOne is this proven system - the hacks nobody shares.
              </p>
            </div>
          </motion.div>

          {/* Instagram Link - Compact */}
          {personalInfo?.instagramUrl && (
            <motion.a
              href={personalInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-full font-semibold text-xs hover:scale-105 transition-transform shadow-lg mt-4 mb-2 block "
            >
              <Instagram className="w-4 h-4" />
              See My Full Journey
            </motion.a>
          )}
        </div>
      ),
      canSkip: false,
    },
    {
      id: 3,
      title: "Real Transformations",
      subtitle: "If they can do it, so can you",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-2xl"
          >
            <Trophy className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-center mb-4">Success Stories</h3>

            <div className="space-y-4">
              {/* Professional Actor Example - Legal Safe */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    🎬
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Film Professionals</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Professional actors gain 15-20kg muscle in 2-3 months for action roles
                    </p>
                  </div>
                </div>
              </div>

              {/* Athlete Example */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    🏃
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Professional Athletes</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Maintain peak physique year-round 
                    </p>
                  </div>
                </div>
              </div>

              {/* Regular People */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    👥
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Everyday People</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lose 20-30kg, build muscle, and transform their health
                      with proven methods that work
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      ),
      canSkip: false,
    },
    {
      id: 4,
      title: "Join the Beta 🚀",
      subtitle: "Be the first to transform",
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-2xl text-center"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-bold mb-2">Limited Beta Access</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We're currently in beta testing. Get early access and exclusive benefits!
            </p>
          </motion.div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mobile Number (India)
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={formData.phoneNumber}
                onChange={(e) => {
                  setFormData({ ...formData, phoneNumber: e.target.value });
                  setErrors({ ...errors, phoneNumber: '', contact: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800 focus:outline-none focus:border-orange-500 transition-colors`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">or</div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: '', contact: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } bg-white dark:bg-gray-800 focus:outline-none focus:border-orange-500 transition-colors`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {errors.contact && (
              <p className="text-red-500 text-xs text-center">{errors.contact}</p>
            )}

            {/* Consent Checkbox - CRITICAL for DPDPA Compliance */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => {
                  setFormData({ ...formData, consent: e.target.checked });
                  setErrors({ ...errors, consent: '' });
                }}
                className={`mt-1 w-5 h-5 rounded border-2 ${
                  errors.consent ? 'border-red-500' : 'border-gray-300'
                } text-orange-600 focus:ring-orange-500`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                I agree to receive launch notifications and fitness tips via WhatsApp/Email.
                I can unsubscribe anytime.
                <a href="/privacy" className="text-orange-600 underline ml-1" target="_blank">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-500 text-xs">{errors.consent}</p>
            )}

            {/* Benefits List */}
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-xl">
              <p className="font-semibold text-sm mb-2">You'll get:</p>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>✅ Instant access to the app</li>
                <li>✅ Exclusive beta features</li>
                <li>✅ Direct support from me</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      canSkip: false,
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Desktop: Centered Card Layout, Mobile: Full Screen */}
      <div className="h-full flex items-center justify-center overflow-y-auto lg:p-8">
        <div className="w-full h-full lg:h-auto lg:max-w-lg lg:rounded-3xl lg:shadow-2xl bg-white dark:bg-gray-900 lg:border lg:border-gray-200 dark:lg:border-gray-800 overflow-hidden">
          {/* Content Container */}
          <div className="h-full lg:h-auto overflow-y-auto lg:max-h-[90vh]">
            <div>
              {/* Header */}
              <div className="pt-2 pb-1 px-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-0.5 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {steps[currentStep].title}
              </h1>
              {steps[currentStep].subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {steps[currentStep].subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="px-6 pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto"
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 pb-4 pt-1 bg-white dark:bg-gray-900">
            <div className="max-w-md mx-auto space-y-2">
              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Download className="w-5 h-5" />
                    Get Beta Access
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Step Indicator */}
              <div className="flex justify-center gap-2">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentStep
                        ? 'w-8 bg-gradient-to-r from-orange-600 to-red-600'
                        : 'w-2 bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessOnboarding;
