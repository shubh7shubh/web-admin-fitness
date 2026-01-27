"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePremiumStatus } from "@/lib/hooks/usePremiumStatus";
import { createClient } from "@/lib/supabase-browser";

interface QuestionOption {
  value: string;
  label: string;
}

interface AssessmentQuestion {
  id: string;
  field_key: string;
  label: string;
  section: "general" | "nutrition" | "workout";
  field_type: "textarea" | "select" | "number";
  placeholder?: string;
  options?: QuestionOption[];
  is_required: boolean;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  sort_order: number;
  is_active: boolean;
  is_legacy: boolean;
  default_value?: string;
}

// The 10 legacy field keys that the existing RPC accepts
const RPC_HANDLED_KEYS = [
  "fitness_goals",
  "dietary_preferences",
  "health_conditions",
  "activity_level",
  "meal_frequency",
  "favorite_foods",
  "foods_to_avoid",
  "workout_experience",
  "available_equipment",
  "time_availability",
];

const SECTION_LABELS: Record<string, string> = {
  general: "General Information",
  nutrition: "Nutrition Preferences",
  workout: "Workout Preferences",
};

export default function AssessmentPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const { data: premiumStatus, isLoading: statusLoading } =
    usePremiumStatus(user?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  // Fetch questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from("assessment_questions")
          .select("*")
          .eq("is_active", true)
          .order("section", { ascending: true })
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (data) {
          setQuestions(data);
          // Initialize form with default values
          const defaults: Record<string, any> = {};
          for (const q of data) {
            if (q.default_value) {
              defaults[q.field_key] =
                q.field_type === "number"
                  ? parseInt(q.default_value)
                  : q.default_value;
            }
          }
          setFormData(defaults);
        }
      } catch (err) {
        console.error("Failed to load assessment questions:", err);
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadQuestions();
  }, [supabase]);

  // Protect assessment form
  useEffect(() => {
    if (!premiumStatus || !user) return;
    const { gatekeeper_state } = premiumStatus;
    if (
      gatekeeper_state === "upsell" ||
      gatekeeper_state === "pending" ||
      gatekeeper_state === "active"
    ) {
      router.push("/premium");
    }
  }, [premiumStatus, router, user]);

  const updateField = (fieldKey: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const missingRequired = questions
        .filter((q) => q.is_required && q.is_active)
        .filter((q) => {
          const val = formData[q.field_key];
          return val === undefined || val === null || val === "";
        })
        .map((q) => q.label);

      if (missingRequired.length > 0) {
        setError(`Please fill required fields: ${missingRequired.join(", ")}`);
        setLoading(false);
        return;
      }

      // Validate text field lengths
      for (const q of questions) {
        if (q.field_type === "textarea" && q.max_length) {
          const val = formData[q.field_key];
          if (val && typeof val === "string" && val.length > q.max_length) {
            setError(`${q.label} must be at most ${q.max_length} characters`);
            setLoading(false);
            return;
          }
        }
        if (q.field_type === "textarea" && q.is_required && q.field_key === "fitness_goals") {
          const val = formData[q.field_key];
          if (val && typeof val === "string" && val.length < 10) {
            setError(`${q.label} must be at least 10 characters`);
            setLoading(false);
            return;
          }
        }
      }

      // Separate legacy RPC fields from other fields
      const rpcParams: Record<string, any> = {};
      const remainingLegacy: Record<string, any> = {};
      const customAnswers: Record<string, any> = {};

      for (const q of questions) {
        const val = formData[q.field_key];
        if (val === undefined || val === "") continue;

        if (q.is_legacy) {
          if (RPC_HANDLED_KEYS.includes(q.field_key)) {
            rpcParams[q.field_key] = val;
          } else {
            remainingLegacy[q.field_key] = val;
          }
        } else {
          customAnswers[q.field_key] = val;
        }
      }

      // Step 1: Call existing RPC with legacy fields
      const { error: rpcError } = await supabase.rpc(
        "submit_premium_assessment",
        {
          p_fitness_goals: rpcParams.fitness_goals || "",
          p_dietary_preferences: rpcParams.dietary_preferences || null,
          p_health_conditions: rpcParams.health_conditions || null,
          p_activity_level: rpcParams.activity_level || "moderately_active",
          p_meal_frequency: rpcParams.meal_frequency || null,
          p_favorite_foods: rpcParams.favorite_foods || null,
          p_foods_to_avoid: rpcParams.foods_to_avoid || null,
          p_workout_experience: rpcParams.workout_experience || "beginner",
          p_available_equipment: rpcParams.available_equipment || null,
          p_time_availability: rpcParams.time_availability || "30min",
        }
      );

      if (rpcError) throw rpcError;

      // Step 2: Update remaining legacy fields + custom answers
      const hasRemaining = Object.keys(remainingLegacy).length > 0;
      const hasCustom = Object.keys(customAnswers).length > 0;

      if (hasRemaining || hasCustom) {
        const updatePayload: Record<string, any> = { ...remainingLegacy };
        if (hasCustom) {
          updatePayload.custom_answers = customAnswers;
        }

        await supabase
          .from("premium_assessments")
          .update(updatePayload)
          .eq("user_id", user.id)
          .eq("status", "pending");
      }

      router.push("/premium");
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0]?.message || "Please fill all required fields");
      } else {
        setError(err.message || "Something went wrong");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking premium status or loading questions
  if (statusLoading || !user || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Group questions by section
  const sections = ["general", "nutrition", "workout"];
  const grouped = sections
    .map((sec) => ({
      section: sec,
      questions: questions.filter((q) => q.section === sec),
    }))
    .filter((g) => g.questions.length > 0);

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
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {grouped.map((group) => (
            <div key={group.section} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {SECTION_LABELS[group.section] || group.section}
              </h2>

              <div className="space-y-6">
                {group.questions.map((q) => renderField(q, formData, updateField))}
              </div>
            </div>
          ))}

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

function renderField(
  question: AssessmentQuestion,
  formData: Record<string, any>,
  updateField: (key: string, value: any) => void
) {
  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent";

  switch (question.field_type) {
    case "textarea":
      return (
        <div key={question.field_key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {question.label} {question.is_required && "*"}
          </label>
          <textarea
            value={formData[question.field_key] || ""}
            onChange={(e) => updateField(question.field_key, e.target.value)}
            className={inputClasses}
            rows={question.field_key === "fitness_goals" ? 4 : 3}
            placeholder={question.placeholder || ""}
            maxLength={question.max_length || undefined}
            required={question.is_required}
          />
          {question.max_length && (
            <p className="mt-1 text-sm text-gray-500">
              {(formData[question.field_key] as string)?.length || 0}/
              {question.max_length} characters
            </p>
          )}
        </div>
      );

    case "select":
      return (
        <div key={question.field_key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {question.label} {question.is_required && "*"}
          </label>
          <select
            value={formData[question.field_key] || ""}
            onChange={(e) => updateField(question.field_key, e.target.value)}
            className={inputClasses}
            required={question.is_required}
          >
            {!question.is_required && <option value="">Select...</option>}
            {(question.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "number":
      return (
        <div key={question.field_key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {question.label} {question.is_required && "*"}
          </label>
          <input
            type="number"
            value={formData[question.field_key] ?? ""}
            onChange={(e) =>
              updateField(
                question.field_key,
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className={inputClasses}
            min={question.min_value ?? undefined}
            max={question.max_value ?? undefined}
            placeholder={question.placeholder || ""}
            required={question.is_required}
          />
        </div>
      );

    default:
      return null;
  }
}
