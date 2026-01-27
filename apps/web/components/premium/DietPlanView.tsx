"use client";

import { useState } from "react";
import { useDietPlan } from "@/lib/hooks/useDietPlan";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase-browser";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import type { DietPlanMeal } from "@/shared/types";

interface DietPlanViewProps {
  userId: string;
}

export function DietPlanView({ userId }: DietPlanViewProps) {
  const { data: dietPlan, isLoading, error } = useDietPlan(userId);
  const [expandedMeals, setExpandedMeals] = useState<Record<number, boolean>>({});
  const queryClient = useQueryClient();

  const logMealMutation = useMutation({
    mutationFn: async (meal: DietPlanMeal) => {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase.rpc("log_planned_meal_v2", {
        p_meal_name: meal.name,
        p_calories: meal.calories,
        p_protein: meal.protein,
        p_carbs: meal.carbs,
        p_fat: meal.fat,
        p_meal_type: meal.meal_type,
        p_date: today,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      const today = new Date().toISOString().split("T")[0];
      queryClient.invalidateQueries({ queryKey: queryKeys.diaryEntries(today) });
      queryClient.invalidateQueries({ queryKey: queryKeys.nutritionSummary(today) });
    },
  });

  const toggleMeal = (mealNumber: number) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [mealNumber]: !prev[mealNumber],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !dietPlan) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">
          {error ? "Error loading diet plan" : "No diet plan available yet"}
        </p>
      </div>
    );
  }

  const meals = dietPlan.plan_data.meals || [];

  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div>
      {/* Plan Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{dietPlan.plan_name}</h2>
        <p className="text-sm text-gray-600">
          Week {dietPlan.current_week} of {dietPlan.duration_weeks}
        </p>
      </div>

      {/* Daily Totals */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Daily Totals ({meals.length} meal{meals.length !== 1 ? "s" : ""})
        </p>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{dailyTotals.calories}</p>
            <p className="text-xs text-gray-500">Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{dailyTotals.protein}g</p>
            <p className="text-xs text-gray-500">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{dailyTotals.carbs}g</p>
            <p className="text-xs text-gray-500">Carbs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{dailyTotals.fat}g</p>
            <p className="text-xs text-gray-500">Fat</p>
          </div>
        </div>
      </div>

      {/* Meals */}
      <h3 className="text-base font-bold text-gray-900 mb-4">Your Daily Meals</h3>
      <div className="space-y-4">
        {meals.map((meal) => {
          const isExpanded = expandedMeals[meal.meal_number];

          return (
            <div
              key={meal.meal_number}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Meal Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium text-emerald-600 uppercase">
                        {meal.meal_type}
                      </p>
                      {meal.timing && (
                        <p className="text-xs text-gray-400">{meal.timing}</p>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                  </div>
                  <div className="bg-gray-100 px-3 py-1.5 rounded-lg">
                    <p className="font-bold text-sm text-gray-900">
                      {meal.calories} kcal
                    </p>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="font-semibold text-blue-600">{meal.protein}g</p>
                    <p className="text-xs text-gray-500">Protein</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="font-semibold text-orange-600">{meal.carbs}g</p>
                    <p className="text-xs text-gray-500">Carbs</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="font-semibold text-yellow-600">{meal.fat}g</p>
                    <p className="text-xs text-gray-500">Fat</p>
                  </div>
                </div>

                {/* Expandable Details */}
                {(meal.ingredients?.length || meal.instructions) && (
                  <>
                    <button
                      onClick={() => toggleMeal(meal.meal_number)}
                      className="flex items-center text-sm text-emerald-600 font-medium hover:text-emerald-700"
                    >
                      {isExpanded ? "Hide" : "Show"} Details
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${
                          isExpanded ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Ingredients:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                              {meal.ingredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {meal.instructions && (
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Instructions:</p>
                            <p className="text-gray-600">{meal.instructions}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Log Meal Button */}
                <Button
                  onClick={() => logMealMutation.mutate(meal)}
                  disabled={logMealMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {logMealMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Logging...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Eat This
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
