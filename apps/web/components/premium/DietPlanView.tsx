"use client";

import { useState } from "react";
import { useDietPlan } from "@/lib/hooks/useDietPlan";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase-browser";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Check } from "lucide-react";

interface DietPlanViewProps {
  userId: string;
}

export function DietPlanView({ userId }: DietPlanViewProps) {
  const { data: dietPlan, isLoading, error } = useDietPlan(userId);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const logMealMutation = useMutation({
    mutationFn: async ({
      mealName,
      calories,
      protein,
      carbs,
      fat,
      mealType,
      date,
    }: {
      mealName: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      mealType: string;
      date: string;
    }) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("log_planned_meal_v2", {
        p_meal_name: mealName,
        p_calories: calories,
        p_protein: protein,
        p_carbs: carbs,
        p_fat: fat,
        p_meal_type: mealType,
        p_date: date,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate diary queries to update UI
      const today = new Date().toISOString().split("T")[0];
      queryClient.invalidateQueries({ queryKey: queryKeys.diaryEntries(today) });
      queryClient.invalidateQueries({ queryKey: queryKeys.nutritionSummary(today) });
    },
  });

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

  const currentWeek = dietPlan.plan_data.weeks.find(
    (w) => w.week_number === selectedWeek
  );

  return (
    <div>
      {/* Week Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Week
        </label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          {dietPlan.plan_data.weeks.map((week) => (
            <option key={week.week_number} value={week.week_number}>
              Week {week.week_number}
            </option>
          ))}
        </select>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {currentWeek?.days.map((day) => {
          const isExpanded = expandedDay === day.day_number;
          const isToday =
            new Date(day.date).toDateString() === new Date().toDateString();

          return (
            <div
              key={day.day_number}
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                isToday ? "ring-2 ring-green-500" : ""
              }`}
            >
              {/* Day Header */}
              <button
                onClick={() =>
                  setExpandedDay(isExpanded ? null : day.day_number)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <p className="font-semibold text-gray-900">
                      Day {day.day_number}
                      {isToday && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Today
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {day.meals.length} meals
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Meals List */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  {day.meals.map((meal, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="bg-gray-50 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                            {meal.meal_type}
                          </p>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {meal.meal_name}
                          </h4>
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Calories</p>
                          <p className="font-semibold text-gray-900">
                            {meal.calories}
                          </p>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Protein</p>
                          <p className="font-semibold text-blue-600">
                            {meal.protein}g
                          </p>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Carbs</p>
                          <p className="font-semibold text-orange-600">
                            {meal.carbs}g
                          </p>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-600 mb-1">Fat</p>
                          <p className="font-semibold text-yellow-600">
                            {meal.fat}g
                          </p>
                        </div>
                      </div>

                      {/* Ingredients */}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-1">
                            Ingredients:
                          </p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {meal.ingredients.map((ingredient, idx) => (
                              <li key={idx}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Instructions */}
                      {meal.instructions && (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-1">
                            Instructions:
                          </p>
                          <p className="text-gray-600">{meal.instructions}</p>
                        </div>
                      )}

                      {/* Log Meal Button */}
                      <Button
                        onClick={() =>
                          logMealMutation.mutate({
                            mealName: meal.meal_name,
                            calories: meal.calories,
                            protein: meal.protein,
                            carbs: meal.carbs,
                            fat: meal.fat,
                            mealType: meal.meal_type,
                            date: day.date,
                          })
                        }
                        disabled={logMealMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {logMealMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Logging...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Log This Meal
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
