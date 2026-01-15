"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import type { PremiumAssessment } from "@/shared/types";

export default function PremiumAssessmentsPage() {
  const [assessments, setAssessments] = useState<PremiumAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<PremiumAssessment | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("premium_assessments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSQLTemplate = (assessment: PremiumAssessment) => {
    const today = new Date().toISOString().split("T")[0];

    return `-- Premium Plan Creation for User: ${assessment.user_id}
-- Assessment ID: ${assessment.id}
-- Created: ${new Date().toISOString()}

-- STEP 1: Create Diet Plan
INSERT INTO diet_plans (user_id, plan_data, created_at, updated_at)
VALUES (
  '${assessment.user_id}',
  '{
    "weeks": [
      {
        "week_number": 1,
        "days": [
          {
            "day_number": 1,
            "date": "${today}",
            "meals": [
              {
                "meal_type": "breakfast",
                "meal_name": "Oatmeal with Berries",
                "calories": 350,
                "protein": 12,
                "carbs": 58,
                "fat": 8,
                "ingredients": ["Oats", "Milk", "Berries", "Honey"],
                "instructions": "Cook oats with milk, top with berries and honey"
              }
            ]
          }
        ]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- STEP 2: Create Workout Plan
INSERT INTO workout_plans (user_id, plan_data, created_at, updated_at)
VALUES (
  '${assessment.user_id}',
  '{
    "weeks": [
      {
        "week_number": 1,
        "days": [
          {
            "day_number": 1,
            "day_name": "Chest & Triceps",
            "exercises": [
              {
                "exercise_name": "Push-ups",
                "sets": 3,
                "reps": "12-15",
                "rest_seconds": 60,
                "notes": "Keep core tight, full range of motion"
              }
            ]
          }
        ]
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- STEP 3: Update Assessment Status to Active
UPDATE premium_assessments
SET status = 'active', updated_at = NOW()
WHERE id = '${assessment.id}';

-- Assessment Details for Reference:
-- Goals: ${assessment.fitness_goals}
-- Activity Level: ${assessment.activity_level}
-- Age: ${assessment.age}, Gender: ${assessment.gender}
-- Weight: ${assessment.current_weight_kg}kg -> ${assessment.target_weight_kg || "N/A"}kg
-- Dietary Preferences: ${assessment.dietary_preferences || "None specified"}
-- Health Conditions: ${assessment.health_conditions || "None specified"}
-- Workout Experience: ${assessment.workout_experience}
-- Available Equipment: ${assessment.available_equipment || "None specified"}
-- Time Availability: ${assessment.time_availability}
`;
  };

  const copySQLToClipboard = (assessment: PremiumAssessment) => {
    const sql = generateSQLTemplate(assessment);
    navigator.clipboard.writeText(sql);
    alert("SQL template copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Premium Assessments
          </h1>
          <p className="text-lg text-gray-600">
            Manage and create personalized plans for premium users
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Assessments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assessments.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assessments.filter((a) => a.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Assessments
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {assessments.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No assessments found
              </div>
            ) : (
              assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">
                        User ID: {assessment.user_id.slice(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted:{" "}
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assessment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {assessment.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Goals</p>
                      <p className="font-medium text-gray-900 truncate">
                        {assessment.fitness_goals.slice(0, 50)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Experience</p>
                      <p className="font-medium text-gray-900">
                        {assessment.workout_experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Activity Level</p>
                      <p className="font-medium text-gray-900">
                        {assessment.activity_level.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  {assessment.status === "pending" && (
                    <div className="mt-4 flex space-x-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          copySQLToClipboard(assessment);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL Template
                      </Button>
                      <a
                        href="https://supabase.com/dashboard/project/oswlhrzarxjpyocgxgbr/sql/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open SQL Editor
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assessment Details Modal */}
        {selectedAssessment && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAssessment(null)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Assessment Details
              </h2>

              <div className="space-y-6">
                {/* General Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    General Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Age</p>
                      <p className="font-medium">{selectedAssessment.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gender</p>
                      <p className="font-medium">{selectedAssessment.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Weight</p>
                      <p className="font-medium">
                        {selectedAssessment.current_weight_kg}kg
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Weight</p>
                      <p className="font-medium">
                        {selectedAssessment.target_weight_kg || "N/A"}kg
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 mb-1">Fitness Goals</p>
                    <p className="font-medium bg-gray-50 p-3 rounded">
                      {selectedAssessment.fitness_goals}
                    </p>
                  </div>
                </div>

                {/* Nutrition Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Nutrition Preferences
                  </h3>
                  <div className="space-y-3 text-sm">
                    {selectedAssessment.dietary_preferences && (
                      <div>
                        <p className="text-gray-600">Dietary Preferences</p>
                        <p className="font-medium">
                          {selectedAssessment.dietary_preferences}
                        </p>
                      </div>
                    )}
                    {selectedAssessment.health_conditions && (
                      <div>
                        <p className="text-gray-600">Health Conditions</p>
                        <p className="font-medium">
                          {selectedAssessment.health_conditions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Workout Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Workout Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Experience</p>
                      <p className="font-medium">
                        {selectedAssessment.workout_experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Availability</p>
                      <p className="font-medium">
                        {selectedAssessment.time_availability}
                      </p>
                    </div>
                  </div>
                  {selectedAssessment.available_equipment && (
                    <div className="mt-4">
                      <p className="text-gray-600 mb-1">Available Equipment</p>
                      <p className="font-medium">
                        {selectedAssessment.available_equipment}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={() => setSelectedAssessment(null)}
                  className="bg-gray-800 hover:bg-gray-900"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
