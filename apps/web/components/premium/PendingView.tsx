import { Clock, CheckCircle2 } from "lucide-react";

export function PendingView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Plan is Being Created
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for completing the assessment! Our expert team is now
            crafting your personalized diet and workout plans tailored to your
            goals and preferences.
          </p>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <p className="font-semibold text-gray-900">
                Expected Delivery: 24-48 hours
              </p>
            </div>
            <p className="text-sm text-gray-600">
              We'll notify you when your plan is ready to view
            </p>
          </div>

          {/* What's Happening */}
          <div className="text-left max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              What's Happening Now
            </h2>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  Assessment Received
                </p>
                <p className="text-sm text-gray-600">
                  Your detailed responses are being reviewed
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Plan Creation</p>
                <p className="text-sm text-gray-600">
                  Experts are designing your custom diet and workout plans
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Plan Ready</p>
                <p className="text-sm text-gray-600">
                  You'll be able to access your 8-week plans here
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">
              In the Meantime
            </h3>
            <p className="text-sm text-gray-700">
              Continue using ApexOne to track your current meals and workouts.
              Once your plan is ready, you'll see it on this page and can start
              following it immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
