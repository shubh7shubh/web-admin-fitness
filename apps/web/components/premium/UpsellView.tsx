import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Utensils,
  Dumbbell,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

export function UpsellView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Concierge Premium Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized diet and workout plans crafted by experts,
            tailored specifically to your goals and lifestyle
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Custom Meal Plans
            </h3>
            <p className="text-gray-600 mb-4">
              8-week personalized diet plans with weekly meal schedules. Every
              meal calculated with macros (protein, carbs, fats) and calories.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Based on your dietary preferences
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Respects health conditions & allergies
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                One-tap meal logging to diary
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Workout Routines
            </h3>
            <p className="text-gray-600 mb-4">
              8-week customized workout plans with detailed exercises, sets,
              reps, and rest times tailored to your experience level.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Matches your available equipment
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Fits your time availability
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                Considers injuries & limitations
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Expert Coaching
            </h3>
            <p className="text-gray-600 mb-4">
              Your plans are created by certified fitness and nutrition experts
              based on your detailed assessment.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                Comprehensive 17-field assessment
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                Plans ready within 24-48 hours
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">✓</span>
                Personalized to your fitness goals
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Progress Tracking
            </h3>
            <p className="text-gray-600 mb-4">
              Seamlessly integrate your premium plans with the existing
              ApexOne tracking features.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">✓</span>
                Quick meal logging from diet plan
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">✓</span>
                Track nutrition automatically
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">✓</span>
                Monitor workout completion
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center shadow-2xl max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Transformation Today
          </h2>
          <div className="flex items-baseline justify-center mb-6">
            <span className="text-6xl font-bold">₹999</span>
            <span className="text-2xl text-gray-300 ml-2">/month</span>
          </div>
          <p className="text-gray-300 mb-8">
            Cancel anytime • 24-48 hour plan delivery • Expert support
          </p>
          <Link href="/premium/checkout">
            <Button className="w-full h-14 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100">
              Upgrade to Premium
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Secure payment • UPI, Cards, Net Banking accepted
          </p>
        </div>
      </div>
    </div>
  );
}
