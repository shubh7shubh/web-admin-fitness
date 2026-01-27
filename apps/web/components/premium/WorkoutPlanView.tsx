"use client";

import { useState, useMemo } from "react";
import { useWorkoutPlan } from "@/lib/hooks/useWorkoutPlan";
import { ChevronDown, Clock } from "lucide-react";
import type { DayOfWeek, TrainingDay, MuscleGroup } from "@/shared/types";

interface WorkoutPlanViewProps {
  userId: string;
}

const DAYS_OF_WEEK: { key: DayOfWeek; short: string; full: string }[] = [
  { key: "monday", short: "Mon", full: "Monday" },
  { key: "tuesday", short: "Tue", full: "Tuesday" },
  { key: "wednesday", short: "Wed", full: "Wednesday" },
  { key: "thursday", short: "Thu", full: "Thursday" },
  { key: "friday", short: "Fri", full: "Friday" },
  { key: "saturday", short: "Sat", full: "Saturday" },
  { key: "sunday", short: "Sun", full: "Sunday" },
];

function getTodayDayOfWeek(): DayOfWeek {
  const jsDay = new Date().getDay();
  const map: DayOfWeek[] = [
    "sunday", "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday",
  ];
  return map[jsDay];
}

const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: "#3B82F6",
  back: "#10B981",
  shoulders: "#F59E0B",
  biceps: "#8B5CF6",
  triceps: "#EC4899",
  forearms: "#6B7280",
  abs: "#EF4444",
  obliques: "#DC2626",
  quadriceps: "#F97316",
  hamstrings: "#EA580C",
  glutes: "#D946EF",
  calves: "#14B8A6",
  cardio: "#06B6D4",
};

export function WorkoutPlanView({ userId }: WorkoutPlanViewProps) {
  const { data: workoutPlan, isLoading, error } = useWorkoutPlan(userId);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek());
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});

  const trainingDayMap = useMemo(() => {
    if (!workoutPlan?.routine_data?.training_days) return new Map<DayOfWeek, TrainingDay>();
    const map = new Map<DayOfWeek, TrainingDay>();
    for (const day of workoutPlan.routine_data.training_days) {
      map.set(day.day_of_week, day);
    }
    return map;
  }, [workoutPlan]);

  const toggleExercise = (key: string) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !workoutPlan) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">
          {error ? "Error loading workout plan" : "No workout plan available yet"}
        </p>
      </div>
    );
  }

  const selectedTrainingDay = trainingDayMap.get(selectedDay);
  const isRestDay = !selectedTrainingDay;
  const todayKey = getTodayDayOfWeek();

  return (
    <div>
      {/* Plan Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{workoutPlan.plan_name}</h2>
        <p className="text-sm text-gray-600">
          Week {workoutPlan.current_week} of {workoutPlan.duration_weeks}
        </p>
      </div>

      {/* Day-of-week selector */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {DAYS_OF_WEEK.map(({ key, short }) => {
          const isTraining = trainingDayMap.has(key);
          const isSelected = selectedDay === key;
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              className={`relative py-3 rounded-lg text-center text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-emerald-600 text-white"
                  : isTraining
                  ? "bg-white text-gray-900 border border-gray-200 hover:border-emerald-300"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {short}
              {isToday && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-white" : "bg-emerald-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isRestDay ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">😴</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rest Day</h3>
          <p className="text-gray-600">
            No exercises scheduled. Take time to recover and come back stronger!
          </p>
        </div>
      ) : (
        <>
          {/* Day Label */}
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selectedTrainingDay.day_label}
          </h3>

          {/* Muscle Groups */}
          {selectedTrainingDay.muscle_groups.map((group, groupIdx) => (
            <div key={group.name} className="mb-6">
              {/* Muscle Group Header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold capitalize"
                  style={{
                    backgroundColor: (MUSCLE_GROUP_COLORS[group.name] || "#6B7280") + "15",
                    color: MUSCLE_GROUP_COLORS[group.name] || "#6B7280",
                  }}
                >
                  {group.name}
                </span>
                <span className="text-xs text-gray-400">
                  {group.exercises.length} exercise{group.exercises.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Exercises */}
              <div className="space-y-3">
                {group.exercises.map((exercise, exIdx) => {
                  const exerciseKey = `${groupIdx}-${exIdx}`;
                  const isExpanded = expandedExercises[exerciseKey] || false;

                  return (
                    <div
                      key={exIdx}
                      className="bg-white rounded-lg shadow-sm p-4"
                    >
                      {/* Exercise Name */}
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {exercise.name}
                      </h4>

                      {/* Sets / Reps / Weight / Rest */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-gray-50 rounded p-3 text-center">
                          <p className="font-bold text-lg text-gray-900">{exercise.sets}</p>
                          <p className="text-xs text-gray-500">Sets</p>
                        </div>
                        <div className="bg-gray-50 rounded p-3 text-center">
                          <p className="font-bold text-lg text-blue-600">{exercise.reps}</p>
                          <p className="text-xs text-gray-500">Reps</p>
                        </div>
                        <div className="bg-gray-50 rounded p-3 text-center">
                          <div className="flex items-center justify-center">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <p className="font-bold text-lg text-orange-600">
                              {exercise.rest_seconds}s
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">Rest</p>
                        </div>
                      </div>

                      {exercise.weight && (
                        <p className="text-sm text-gray-600 mb-3">
                          Weight: <span className="font-medium">{exercise.weight}</span>
                        </p>
                      )}

                      {/* Instructions Toggle */}
                      {exercise.instructions && (
                        <>
                          <button
                            onClick={() => toggleExercise(exerciseKey)}
                            className="flex items-center text-sm text-emerald-600 font-medium hover:text-emerald-700"
                          >
                            {isExpanded ? "Hide" : "Show"} Instructions
                            <ChevronDown
                              className={`w-4 h-4 ml-1 transition-transform ${
                                isExpanded ? "transform rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-2 text-sm text-gray-600">
                              {exercise.instructions}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
