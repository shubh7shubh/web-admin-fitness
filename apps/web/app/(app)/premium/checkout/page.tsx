"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Settings } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/premium"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Premium
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Integration Coming Soon
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            We're currently setting up secure payment processing with Razorpay.
            This feature will be available shortly.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  For Testing & Development
                </h3>
                <p className="text-sm text-gray-700">
                  Administrators can activate premium features directly through
                  the admin panel for testing purposes. Contact your system
                  administrator to enable premium access for your account.
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="text-left max-w-md mx-auto mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              What You'll Get with Premium
            </h2>

            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>8-week personalized diet plan with daily meal schedules</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>8-week customized workout routines with detailed exercises</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>Expert coaching from certified fitness professionals</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>One-tap meal logging directly from your diet plan</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span>Plans tailored to your goals, preferences, and lifestyle</span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-baseline justify-center">
              <span className="text-5xl font-bold text-gray-900">₹999</span>
              <span className="text-xl text-gray-600 ml-2">/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Cancel anytime • 24-48 hour plan delivery
            </p>
          </div>

          {/* Action Button */}
          <Link href="/premium">
            <Button className="w-full h-14 text-lg font-semibold bg-gray-900 text-white hover:bg-gray-800">
              Return to Premium Page
            </Button>
          </Link>

          <p className="mt-6 text-sm text-gray-500">
            We'll notify you as soon as payment processing is available
          </p>
        </div>
      </div>
    </div>
  );
}
