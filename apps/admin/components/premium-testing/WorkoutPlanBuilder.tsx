"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const DAYS_OF_WEEK: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

const MUSCLE_GROUPS = [
  "chest", "back", "shoulders", "biceps", "triceps", "forearms",
  "abs", "obliques", "quadriceps", "hamstrings", "glutes", "calves", "cardio",
] as const;

type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  weight?: string;
  instructions: string;
  form_tips?: string;
}

interface MuscleGroupSection {
  name: MuscleGroup;
  exercises: Exercise[];
}

interface TrainingDay {
  day_of_week: DayOfWeek;
  day_label: string;
  muscle_groups: MuscleGroupSection[];
}

interface WorkoutPlanBuilderProps {
  userId: string;
  onPlanSaved?: () => void;
}

function createEmptyExercise(): Exercise {
  return {
    name: "",
    sets: 3,
    reps: "10-12",
    rest_seconds: 60,
    weight: "",
    instructions: "",
    form_tips: "",
  };
}

const sampleTrainingDays: TrainingDay[] = [
  {
    day_of_week: "monday",
    day_label: "Chest + Triceps",
    muscle_groups: [
      {
        name: "chest",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest_seconds: 90, instructions: "Keep chest up, control descent" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest_seconds: 60, instructions: "30-degree incline, squeeze at top" },
        ],
      },
      {
        name: "triceps",
        exercises: [
          { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest_seconds: 45, instructions: "Keep elbows fixed at sides" },
        ],
      },
    ],
  },
  {
    day_of_week: "wednesday",
    day_label: "Back + Biceps",
    muscle_groups: [
      {
        name: "back",
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "6-8", rest_seconds: 90, instructions: "Full range of motion, dead hang to chin over bar" },
          { name: "Bent Over Rows", sets: 3, reps: "10-12", rest_seconds: 60, instructions: "Hinge at hips, pull to lower chest" },
        ],
      },
      {
        name: "biceps",
        exercises: [
          { name: "Dumbbell Curls", sets: 3, reps: "12-15", rest_seconds: 45, instructions: "No swinging, controlled movement" },
        ],
      },
    ],
  },
  {
    day_of_week: "friday",
    day_label: "Legs + Shoulders",
    muscle_groups: [
      {
        name: "quadriceps",
        exercises: [
          { name: "Barbell Squats", sets: 4, reps: "8-10", rest_seconds: 120, instructions: "Go to parallel or below, drive through heels" },
        ],
      },
      {
        name: "hamstrings",
        exercises: [
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12", rest_seconds: 90, instructions: "Hinge at hips, slight knee bend, feel hamstring stretch" },
        ],
      },
      {
        name: "shoulders",
        exercises: [
          { name: "Overhead Press", sets: 3, reps: "8-10", rest_seconds: 60, instructions: "Press overhead, lock out at top" },
        ],
      },
    ],
  },
];

export function WorkoutPlanBuilder({ userId, onPlanSaved }: WorkoutPlanBuilderProps) {
  const [planName, setPlanName] = useState("Personalized Workout Plan");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
  const [saving, setSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>(null);

  const selectedDays = new Set(trainingDays.map((d) => d.day_of_week));

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.has(day)) {
      setTrainingDays(trainingDays.filter((d) => d.day_of_week !== day));
      if (expandedDay === day) setExpandedDay(null);
    } else {
      const newDay: TrainingDay = {
        day_of_week: day,
        day_label: "",
        muscle_groups: [],
      };
      const updated = [...trainingDays, newDay].sort(
        (a, b) => DAYS_OF_WEEK.findIndex((d) => d.value === a.day_of_week) - DAYS_OF_WEEK.findIndex((d) => d.value === b.day_of_week)
      );
      setTrainingDays(updated);
      setExpandedDay(day);
    }
  };

  const getDayIndex = (day: DayOfWeek) => trainingDays.findIndex((d) => d.day_of_week === day);

  const updateDayLabel = (day: DayOfWeek, label: string) => {
    const idx = getDayIndex(day);
    if (idx === -1) return;
    const updated = [...trainingDays];
    updated[idx] = { ...updated[idx], day_label: label };
    setTrainingDays(updated);
  };

  const addMuscleGroup = (day: DayOfWeek, muscleGroup: MuscleGroup) => {
    const idx = getDayIndex(day);
    if (idx === -1) return;
    const updated = [...trainingDays];
    const existing = updated[idx].muscle_groups.find((mg) => mg.name === muscleGroup);
    if (existing) return;
    updated[idx] = {
      ...updated[idx],
      muscle_groups: [...updated[idx].muscle_groups, { name: muscleGroup, exercises: [createEmptyExercise()] }],
    };
    setTrainingDays(updated);
  };

  const removeMuscleGroup = (day: DayOfWeek, muscleGroup: MuscleGroup) => {
    const idx = getDayIndex(day);
    if (idx === -1) return;
    const updated = [...trainingDays];
    updated[idx] = {
      ...updated[idx],
      muscle_groups: updated[idx].muscle_groups.filter((mg) => mg.name !== muscleGroup),
    };
    setTrainingDays(updated);
  };

  const addExercise = (day: DayOfWeek, muscleGroup: MuscleGroup) => {
    const idx = getDayIndex(day);
    if (idx === -1) return;
    const updated = [...trainingDays];
    const mgIdx = updated[idx].muscle_groups.findIndex((mg) => mg.name === muscleGroup);
    if (mgIdx === -1) return;
    const newMgs = [...updated[idx].muscle_groups];
    newMgs[mgIdx] = {
      ...newMgs[mgIdx],
      exercises: [...newMgs[mgIdx].exercises, createEmptyExercise()],
    };
    updated[idx] = { ...updated[idx], muscle_groups: newMgs };
    setTrainingDays(updated);
  };

  const removeExercise = (day: DayOfWeek, muscleGroup: MuscleGroup, exIdx: number) => {
    const idx = getDayIndex(day);
    if (idx === -1) return;
    const updated = [...trainingDays];
    const mgIdx = updated[idx].muscle_groups.findIndex((mg) => mg.name === muscleGroup);
    if (mgIdx === -1) return;
    const newMgs = [...updated[idx].muscle_groups];
    newMgs[mgIdx] = {
      ...newMgs[mgIdx],
      exercises: newMgs[mgIdx].exercises.filter((_, i) => i !== exIdx),
    };
    updated[idx] = { ...updated[idx], muscle_groups: newMgs };
    setTrainingDays(updated);
  };

  const updateExercise = (day: DayOfWeek, muscleGroup: MuscleGroup, exIdx: number, field: keyof Exercise, value: any) => {
    const idx = getDayIndex(day);
    if (idx === -1) return;
    const updated = [...trainingDays];
    const mgIdx = updated[idx].muscle_groups.findIndex((mg) => mg.name === muscleGroup);
    if (mgIdx === -1) return;
    const newMgs = [...updated[idx].muscle_groups];
    const newExercises = [...newMgs[mgIdx].exercises];
    newExercises[exIdx] = { ...newExercises[exIdx], [field]: value };
    newMgs[mgIdx] = { ...newMgs[mgIdx], exercises: newExercises };
    updated[idx] = { ...updated[idx], muscle_groups: newMgs };
    setTrainingDays(updated);
  };

  const loadSample = () => {
    setTrainingDays(sampleTrainingDays);
    setExpandedDay("monday");
  };

  const savePlan = async () => {
    if (trainingDays.length === 0) {
      alert("Select at least one training day");
      return;
    }

    try {
      setSaving(true);
      const planData = {
        training_days: trainingDays.map((td) => ({
          ...td,
          muscle_groups: td.muscle_groups.map((mg) => ({
            ...mg,
            exercises: mg.exercises.filter((ex) => ex.name.trim() !== ""),
          })),
        })),
      };

      const response = await fetch("/api/premium-testing/create-workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planData, planName, durationWeeks }),
      });

      if (response.ok) {
        alert("Workout plan saved!");
        onPlanSaved?.();
      } else {
        const error = await response.json();
        alert("Error saving plan: " + error.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async () => {
    if (!confirm("Delete workout plan?")) return;

    await fetch("/api/premium-testing/delete-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planType: "workout" }),
    });

    setTrainingDays([]);
    onPlanSaved?.();
    alert("Workout plan deleted");
  };

  const availableMuscleGroups = (day: DayOfWeek) => {
    const idx = getDayIndex(day);
    if (idx === -1) return MUSCLE_GROUPS;
    const used = new Set(trainingDays[idx].muscle_groups.map((mg) => mg.name));
    return MUSCLE_GROUPS.filter((mg) => !used.has(mg));
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Workout Plan Builder</h3>

      {/* Plan Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Plan Name</label>
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Duration</label>
          <select
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value))}
            className="w-full h-9 rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 text-sm"
          >
            <option value={4}>4 Weeks</option>
            <option value={8}>8 Weeks</option>
            <option value={12}>12 Weeks</option>
          </select>
        </div>
      </div>

      {/* Load Template */}
      <div className="flex gap-3 mb-4">
        <Button onClick={loadSample} variant="outline" size="sm">
          Load Sample (3-Day Split)
        </Button>
      </div>

      {/* Day Selector Grid */}
      <div className="mb-6">
        <label className="text-sm text-zinc-400 mb-2 block">Select Training Days</label>
        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedDays.has(day.value)
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
            >
              {day.short}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          {trainingDays.length} training day{trainingDays.length !== 1 ? "s" : ""} / week
          {trainingDays.length > 0 && ` | ${7 - trainingDays.length} rest day${7 - trainingDays.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Training Day Editors */}
      <div className="space-y-3 mb-6">
        {trainingDays.map((td) => {
          const isExpanded = expandedDay === td.day_of_week;
          const dayInfo = DAYS_OF_WEEK.find((d) => d.value === td.day_of_week)!;

          return (
            <div key={td.day_of_week} className="bg-zinc-800 border border-zinc-700 rounded-lg">
              {/* Day Header (clickable to expand) */}
              <button
                onClick={() => setExpandedDay(isExpanded ? null : td.day_of_week)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-semibold text-sm">{dayInfo.label}</span>
                  {td.day_label && (
                    <span className="text-zinc-400 text-sm">- {td.day_label}</span>
                  )}
                  <span className="text-zinc-600 text-xs">
                    {td.muscle_groups.length} muscle group{td.muscle_groups.length !== 1 ? "s" : ""} |{" "}
                    {td.muscle_groups.reduce((sum, mg) => sum + mg.exercises.length, 0)} exercises
                  </span>
                </div>
                <span className="text-zinc-500 text-sm">{isExpanded ? "▲" : "▼"}</span>
              </button>

              {/* Expanded Day Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-700 pt-4">
                  {/* Day Label */}
                  <div className="mb-4">
                    <label className="text-xs text-zinc-500 mb-1 block">Day Label</label>
                    <Input
                      value={td.day_label}
                      onChange={(e) => updateDayLabel(td.day_of_week, e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white text-sm"
                      placeholder="e.g., Chest + Triceps"
                    />
                  </div>

                  {/* Muscle Groups */}
                  {td.muscle_groups.map((mg) => (
                    <div key={mg.name} className="mb-4 bg-zinc-750 border border-zinc-600 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-blue-400">{capitalize(mg.name)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMuscleGroup(td.day_of_week, mg.name)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 px-2 text-xs"
                        >
                          Remove Group
                        </Button>
                      </div>

                      {/* Exercises */}
                      <div className="space-y-3">
                        {mg.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="bg-zinc-800 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-zinc-500">Exercise {exIdx + 1}</span>
                              {mg.exercises.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExercise(td.day_of_week, mg.name, exIdx)}
                                  className="text-zinc-500 hover:text-red-400 h-5 px-1 text-xs"
                                >
                                  x
                                </Button>
                              )}
                            </div>

                            {/* Exercise Name */}
                            <div className="mb-2">
                              <Input
                                value={ex.name}
                                onChange={(e) => updateExercise(td.day_of_week, mg.name, exIdx, "name", e.target.value)}
                                className="bg-zinc-700 border-zinc-600 text-white text-sm"
                                placeholder="Exercise name"
                              />
                            </div>

                            {/* Sets, Reps, Rest, Weight */}
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              <div>
                                <label className="text-[10px] text-zinc-500 block">Sets</label>
                                <Input
                                  type="number"
                                  value={ex.sets}
                                  onChange={(e) => updateExercise(td.day_of_week, mg.name, exIdx, "sets", Number(e.target.value))}
                                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-zinc-500 block">Reps</label>
                                <Input
                                  value={ex.reps}
                                  onChange={(e) => updateExercise(td.day_of_week, mg.name, exIdx, "reps", e.target.value)}
                                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                                  placeholder="10-12"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-zinc-500 block">Rest (s)</label>
                                <Input
                                  type="number"
                                  value={ex.rest_seconds}
                                  onChange={(e) => updateExercise(td.day_of_week, mg.name, exIdx, "rest_seconds", Number(e.target.value))}
                                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-zinc-500 block">Weight</label>
                                <Input
                                  value={ex.weight || ""}
                                  onChange={(e) => updateExercise(td.day_of_week, mg.name, exIdx, "weight", e.target.value)}
                                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                                  placeholder="60 kg"
                                />
                              </div>
                            </div>

                            {/* Instructions */}
                            <Textarea
                              value={ex.instructions}
                              onChange={(e) => updateExercise(td.day_of_week, mg.name, exIdx, "instructions", e.target.value)}
                              className="bg-zinc-700 border-zinc-600 text-white text-sm min-h-[40px]"
                              placeholder="Instructions / notes..."
                            />
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addExercise(td.day_of_week, mg.name)}
                        className="text-zinc-400 hover:text-white mt-2 h-7 text-xs"
                      >
                        + Add Exercise
                      </Button>
                    </div>
                  ))}

                  {/* Add Muscle Group */}
                  {availableMuscleGroups(td.day_of_week).length > 0 && (
                    <div className="flex items-center gap-2">
                      <select
                        id={`mg-select-${td.day_of_week}`}
                        className="h-8 rounded-md border border-zinc-600 bg-zinc-700 text-white px-2 text-sm"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addMuscleGroup(td.day_of_week, e.target.value as MuscleGroup);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="" disabled>
                          Add muscle group...
                        </option>
                        {availableMuscleGroups(td.day_of_week).map((mg) => (
                          <option key={mg} value={mg}>
                            {capitalize(mg)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {trainingDays.length === 0 && (
        <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-700 rounded-lg mb-6">
          Select training days above or click "Load Sample" to start.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={savePlan}
          disabled={trainingDays.length === 0 || saving}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? "Saving..." : "Save Workout Plan"}
        </Button>
        <Button onClick={deletePlan} variant="destructive">
          Delete Plan
        </Button>
      </div>
    </div>
  );
}
