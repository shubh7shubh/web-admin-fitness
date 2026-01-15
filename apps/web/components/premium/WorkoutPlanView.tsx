"use client";

import { useState } from "react";
import { useWorkoutPlan } from "@/lib/hooks/useWorkoutPlan";
import { ChevronDown, Clock, Repeat } from "lucide-react";

interface WorkoutPlanViewProps {
  userId: string;
}

export function WorkoutPlanView({ userId }: WorkoutPlanViewProps) {
  const { data: workoutPlan, isLoading, error } = useWorkoutPlan(userId);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

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

  const currentWeek = workoutPlan.routine_data.weeks.find(
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
          {workoutPlan.routine_data.weeks.map((week) => (
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

          return (
            <div
              key={day.day_number}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
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
                      Day {day.day_number} - {day.day_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {day.exercises.length} exercises
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Exercises List */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div
                      key={exerciseIndex}
                      className="bg-gray-50 rounded-lg p-4 space-y-3"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {exerciseIndex + 1}. {exercise.exercise_name}
                        </h4>
                      </div>

                      {/* Sets, Reps, Rest */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Repeat className="w-4 h-4 text-gray-600 mr-1" />
                            <p className="text-xs text-gray-600">Sets</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {exercise.sets}
                          </p>
                        </div>
                        <div className="bg-white rounded p-3 text-center">
                          <p className="text-xs text-gray-600 mb-1">Reps</p>
                          <p className="font-semibold text-blue-600">
                            {exercise.reps}
                          </p>
                        </div>
                        <div className="bg-white rounded p-3 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="w-4 h-4 text-gray-600 mr-1" />
                            <p className="text-xs text-gray-600">Rest</p>
                          </div>
                          <p className="font-semibold text-orange-600">
                            {exercise.rest_seconds}s
                          </p>
                        </div>
                      </div>

                      {/* Notes */}
                      {exercise.notes && (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-1">
                            Notes:
                          </p>
                          <p className="text-gray-600 bg-yellow-50 p-2 rounded">
                            {exercise.notes}
                          </p>
                        </div>
                      )}

                      {/* Video Link */}
                      {exercise.video_url && (
                        <div>
                          <a
                            href={exercise.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                            Watch Tutorial Video
                          </a>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Workout Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Workout Summary
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-700">Total Exercises:</p>
                          <p className="font-semibold text-blue-900">
                            {day.exercises.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700">Estimated Time:</p>
                          <p className="font-semibold text-blue-900">
                            {Math.ceil(
                              day.exercises.reduce(
                                (total, ex) =>
                                  total + ex.sets * (45 + ex.rest_seconds),
                                0
                              ) / 60
                            )}{" "}
                            min
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
