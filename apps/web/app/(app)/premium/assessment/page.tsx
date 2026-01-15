"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  premiumAssessmentSchema,
  type PremiumAssessmentData,
} from "@/shared/validation/premiumAssessment";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePremiumStatus } from "@/lib/hooks/usePremiumStatus";
import { createClient } from "@/lib/supabase-browser";

export default function AssessmentPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const { data: premiumStatus, isLoading: statusLoading } = usePremiumStatus(user?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PremiumAssessmentData>>({
    activity_level: "moderately_active",
    workout_experience: "beginner",
    time_availability: "30min",
    primary_workout_goal: "general_fitness",
    cardio_preference: "minimal",
    workout_environment: "commercial_gym",
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  // Protect assessment form - redirect if user already has assessment or is in upsell state
  useEffect(() => {
    if (!premiumStatus || !user) return;

    const { gatekeeper_state } = premiumStatus;

    // If user is in upsell state (free user), redirect to premium page
    if (gatekeeper_state === "upsell") {
      router.push("/premium");
      return;
    }

    // If user already submitted assessment (pending or active), redirect to premium page
    if (gatekeeper_state === "pending" || gatekeeper_state === "active") {
      router.push("/premium");
      return;
    }
  }, [premiumStatus, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      const validatedData = premiumAssessmentSchema.parse(formData);

      const supabase = createClient();

      // Call RPC function directly (matches Expo app)
      const { data: assessmentId, error: rpcError } = await supabase.rpc(
        "submit_premium_assessment",
        {
          p_fitness_goals: validatedData.fitness_goals,
          p_dietary_preferences: validatedData.dietary_preferences || null,
          p_health_conditions: validatedData.health_conditions || null,
          p_activity_level: validatedData.activity_level,
          p_meal_frequency: validatedData.meal_frequency || null,
          p_favorite_foods: validatedData.favorite_foods || null,
          p_foods_to_avoid: validatedData.foods_to_avoid || null,
          p_workout_experience: validatedData.workout_experience,
          p_available_equipment: validatedData.available_equipment || null,
          p_time_availability: validatedData.time_availability,
        }
      );

      if (rpcError) throw rpcError;

      // Redirect to premium page (will show pending view)
      router.push("/premium");
    } catch (err: any) {
      if (err.errors) {
        // Zod validation error
        setError(err.errors[0]?.message || "Please fill all required fields");
      } else {
        setError(err.message || "Something went wrong");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof PremiumAssessmentData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Show loading while checking premium status
  if (statusLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/premium"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Help us create your personalized plan by answering these questions
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* General Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              General Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are your fitness goals? *
                </label>
                <textarea
                  value={formData.fitness_goals || ""}
                  onChange={(e) => updateField("fitness_goals", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={4}
                  placeholder="e.g., Lose 10kg, build muscle, improve endurance..."
                  maxLength={500}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.fitness_goals?.length || 0}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level *
                </label>
                <select
                  value={formData.activity_level || ""}
                  onChange={(e) => updateField("activity_level", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                  <option value="very_active">Very Active (6-7 days/week)</option>
                  <option value="extremely_active">Extremely Active (physical job + training)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nutrition Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nutrition Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Preferences
                </label>
                <textarea
                  value={formData.dietary_preferences || ""}
                  onChange={(e) =>
                    updateField("dietary_preferences", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Vegetarian, Vegan, Keto, No restrictions..."
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Conditions or Allergies
                </label>
                <textarea
                  value={formData.health_conditions || ""}
                  onChange={(e) =>
                    updateField("health_conditions", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Diabetes, lactose intolerance, nut allergies..."
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Meal Frequency
                </label>
                <input
                  type="number"
                  value={formData.meal_frequency || ""}
                  onChange={(e) =>
                    updateField("meal_frequency", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  min={1}
                  max={10}
                  placeholder="e.g., 3 (meals per day)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Foods
                </label>
                <textarea
                  value={formData.favorite_foods || ""}
                  onChange={(e) => updateField("favorite_foods", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Chicken, rice, eggs, broccoli..."
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foods to Avoid
                </label>
                <textarea
                  value={formData.foods_to_avoid || ""}
                  onChange={(e) => updateField("foods_to_avoid", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Dairy, gluten, seafood..."
                  maxLength={1000}
                />
              </div>
            </div>
          </div>

          {/* Workout Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Workout Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Experience *
                </label>
                <select
                  value={formData.workout_experience || ""}
                  onChange={(e) =>
                    updateField("workout_experience", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Equipment
                </label>
                <textarea
                  value={formData.available_equipment || ""}
                  onChange={(e) =>
                    updateField("available_equipment", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Dumbbells, resistance bands, gym membership, none..."
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Availability per Workout *
                </label>
                <select
                  value={formData.time_availability || ""}
                  onChange={(e) =>
                    updateField("time_availability", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="15min">15 minutes</option>
                  <option value="30min">30 minutes</option>
                  <option value="45min">45 minutes</option>
                  <option value="60min_plus">60+ minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Days per Week
                </label>
                <input
                  type="number"
                  value={formData.workout_days_per_week || ""}
                  onChange={(e) =>
                    updateField("workout_days_per_week", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  min={1}
                  max={7}
                  placeholder="e.g., 4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Workout Split
                </label>
                <select
                  value={formData.preferred_workout_split || ""}
                  onChange={(e) =>
                    updateField("preferred_workout_split", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select a split</option>
                  <option value="full_body">Full Body</option>
                  <option value="upper_lower">Upper/Lower</option>
                  <option value="push_pull_legs">Push/Pull/Legs</option>
                  <option value="body_part">Body Part Split</option>
                  <option value="no_preference">No Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Workout Goal *
                </label>
                <select
                  value={formData.primary_workout_goal || ""}
                  onChange={(e) =>
                    updateField("primary_workout_goal", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="strength">Strength</option>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="endurance">Endurance</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardio Preference *
                </label>
                <select
                  value={formData.cardio_preference || ""}
                  onChange={(e) =>
                    updateField("cardio_preference", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="none">None</option>
                  <option value="minimal">Minimal</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Limitations
                </label>
                <textarea
                  value={formData.workout_limitations || ""}
                  onChange={(e) =>
                    updateField("workout_limitations", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Lower back pain, knee injury, shoulder issues..."
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Environment *
                </label>
                <select
                  value={formData.workout_environment || ""}
                  onChange={(e) =>
                    updateField("workout_environment", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="home">Home</option>
                  <option value="commercial_gym">Commercial Gym</option>
                  <option value="both">Both</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Workout Time
                </label>
                <select
                  value={formData.preferred_workout_time || ""}
                  onChange={(e) =>
                    updateField("preferred_workout_time", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800"
          >
            {loading ? "Submitting..." : "Submit Assessment"}
          </Button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Your personalized plan will be ready within 24-48 hours
          </p>
        </form>
      </div>
    </div>
  );
}
