/**
 * Workout Plan Templates - Simplified training days structure
 *
 * New structure: { training_days: [...] }
 * - Weekly template with day-of-week selection
 * - No weeks nesting
 * - Repeats for duration_weeks
 */

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type MuscleGroup =
  | "chest" | "back" | "shoulders" | "biceps" | "triceps"
  | "forearms" | "abs" | "obliques" | "quadriceps" | "hamstrings"
  | "glutes" | "calves" | "cardio";

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  weight?: string;
  instructions: string;
}

export interface MuscleGroupSection {
  name: MuscleGroup;
  exercises: WorkoutExercise[];
}

export interface TrainingDay {
  day_of_week: DayOfWeek;
  day_label: string;
  muscle_groups: MuscleGroupSection[];
}

export interface WorkoutPlanData {
  training_days: TrainingDay[];
}

// Minimal workout plan for quick UI testing (3-day split)
export const minimalWorkoutPlan: WorkoutPlanData = {
  training_days: [
    {
      day_of_week: "monday",
      day_label: "Chest + Triceps",
      muscle_groups: [
        {
          name: "chest",
          exercises: [
            {
              name: "Push-ups",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Keep body straight, core engaged. Lower chest to ground."
            },
            {
              name: "Incline Push-ups",
              sets: 3,
              reps: "12-15",
              rest_seconds: 60,
              instructions: "Hands on elevated surface, targets upper chest."
            }
          ]
        },
        {
          name: "triceps",
          exercises: [
            {
              name: "Tricep Dips",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Use chair or bench, keep elbows close to body."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "wednesday",
      day_label: "Back + Biceps",
      muscle_groups: [
        {
          name: "back",
          exercises: [
            {
              name: "Pull-ups or Lat Pulldowns",
              sets: 3,
              reps: "8-10",
              rest_seconds: 90,
              instructions: "Wide grip, pull to chest level, squeeze shoulder blades."
            },
            {
              name: "Bent Over Rows",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Hinge at hips, pull weights to lower chest."
            }
          ]
        },
        {
          name: "biceps",
          exercises: [
            {
              name: "Bicep Curls",
              sets: 3,
              reps: "12-15",
              rest_seconds: 45,
              instructions: "Control the movement, no swinging."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "friday",
      day_label: "Legs + Core",
      muscle_groups: [
        {
          name: "quadriceps",
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: 3,
              reps: "15-20",
              rest_seconds: 60,
              instructions: "Go parallel or below, knees aligned with toes."
            },
            {
              name: "Lunges",
              sets: 3,
              reps: "10 each leg",
              rest_seconds: 60,
              instructions: "Alternate legs, maintain balance and form."
            }
          ]
        },
        {
          name: "abs",
          exercises: [
            {
              name: "Plank Hold",
              sets: 3,
              reps: "30 seconds",
              rest_seconds: 45,
              instructions: "Engage core, keep back straight, don't let hips sag."
            }
          ]
        }
      ]
    }
  ]
};

// Beginner full body workout (3 days)
export const beginnerWorkoutPlan: WorkoutPlanData = {
  training_days: [
    {
      day_of_week: "monday",
      day_label: "Full Body A",
      muscle_groups: [
        {
          name: "chest",
          exercises: [
            {
              name: "Push-ups (or Knee Push-ups)",
              sets: 3,
              reps: "8-12",
              rest_seconds: 60,
              instructions: "Start with knee push-ups if needed. Focus on form over reps."
            }
          ]
        },
        {
          name: "back",
          exercises: [
            {
              name: "Inverted Rows",
              sets: 3,
              reps: "8-10",
              rest_seconds: 60,
              instructions: "Use a sturdy table or bar. Keep body straight."
            }
          ]
        },
        {
          name: "quadriceps",
          exercises: [
            {
              name: "Bodyweight Squats",
              sets: 3,
              reps: "12-15",
              rest_seconds: 60,
              instructions: "Sit back like sitting in a chair. Keep weight on heels."
            }
          ]
        },
        {
          name: "abs",
          exercises: [
            {
              name: "Dead Bug",
              sets: 3,
              reps: "10 each side",
              rest_seconds: 45,
              instructions: "Keep lower back pressed to floor throughout."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "wednesday",
      day_label: "Full Body B",
      muscle_groups: [
        {
          name: "shoulders",
          exercises: [
            {
              name: "Pike Push-ups",
              sets: 3,
              reps: "8-10",
              rest_seconds: 60,
              instructions: "Form an inverted V with your body. Lower head toward floor."
            }
          ]
        },
        {
          name: "back",
          exercises: [
            {
              name: "Superman Hold",
              sets: 3,
              reps: "10-15",
              rest_seconds: 45,
              instructions: "Lift arms and legs off floor. Hold for 2 seconds each rep."
            }
          ]
        },
        {
          name: "glutes",
          exercises: [
            {
              name: "Glute Bridges",
              sets: 3,
              reps: "15-20",
              rest_seconds: 45,
              instructions: "Squeeze glutes at top. Hold for 1 second."
            }
          ]
        },
        {
          name: "abs",
          exercises: [
            {
              name: "Plank",
              sets: 3,
              reps: "20-30 seconds",
              rest_seconds: 45,
              instructions: "Keep body in straight line. Don't hold breath."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "friday",
      day_label: "Full Body C",
      muscle_groups: [
        {
          name: "chest",
          exercises: [
            {
              name: "Wide Push-ups",
              sets: 3,
              reps: "8-12",
              rest_seconds: 60,
              instructions: "Hands wider than shoulder width. Targets outer chest."
            }
          ]
        },
        {
          name: "hamstrings",
          exercises: [
            {
              name: "Single Leg Romanian Deadlift",
              sets: 3,
              reps: "8 each leg",
              rest_seconds: 60,
              instructions: "Hold onto wall for balance if needed. Feel stretch in hamstring."
            }
          ]
        },
        {
          name: "calves",
          exercises: [
            {
              name: "Calf Raises",
              sets: 3,
              reps: "15-20",
              rest_seconds: 45,
              instructions: "Use step for full range of motion. Pause at top."
            }
          ]
        },
        {
          name: "abs",
          exercises: [
            {
              name: "Bicycle Crunches",
              sets: 3,
              reps: "20 total",
              rest_seconds: 45,
              instructions: "Opposite elbow to knee. Slow and controlled."
            }
          ]
        }
      ]
    }
  ]
};

// Intermediate PPL split (6 days)
export const intermediateWorkoutPlan: WorkoutPlanData = {
  training_days: [
    {
      day_of_week: "monday",
      day_label: "Push (Chest, Shoulders, Triceps)",
      muscle_groups: [
        {
          name: "chest",
          exercises: [
            {
              name: "Dumbbell Bench Press",
              sets: 4,
              reps: "8-12",
              rest_seconds: 90,
              weight: "Moderate",
              instructions: "Control the weight, full range of motion. Touch dumbbells at top."
            },
            {
              name: "Incline Dumbbell Press",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              weight: "Moderate",
              instructions: "30-45 degree incline. Focus on upper chest."
            }
          ]
        },
        {
          name: "shoulders",
          exercises: [
            {
              name: "Overhead Press",
              sets: 3,
              reps: "8-10",
              rest_seconds: 90,
              weight: "Moderate",
              instructions: "Strict form, no leg drive. Press straight up."
            },
            {
              name: "Lateral Raises",
              sets: 3,
              reps: "12-15",
              rest_seconds: 45,
              weight: "Light",
              instructions: "Lead with elbows, control the movement."
            }
          ]
        },
        {
          name: "triceps",
          exercises: [
            {
              name: "Tricep Pushdowns",
              sets: 3,
              reps: "12-15",
              rest_seconds: 45,
              instructions: "Keep elbows fixed at sides. Squeeze at bottom."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "tuesday",
      day_label: "Pull (Back, Biceps)",
      muscle_groups: [
        {
          name: "back",
          exercises: [
            {
              name: "Pull-ups or Lat Pulldowns",
              sets: 4,
              reps: "8-12",
              rest_seconds: 90,
              instructions: "Wide grip, pull to upper chest. Squeeze lats at bottom."
            },
            {
              name: "Barbell Rows",
              sets: 4,
              reps: "8-10",
              rest_seconds: 90,
              weight: "Moderate-Heavy",
              instructions: "Hinge at hips, pull to lower chest. Keep back flat."
            },
            {
              name: "Seated Cable Rows",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Squeeze shoulder blades together at peak contraction."
            }
          ]
        },
        {
          name: "biceps",
          exercises: [
            {
              name: "Dumbbell Bicep Curls",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Control the negative. No swinging."
            },
            {
              name: "Hammer Curls",
              sets: 3,
              reps: "12-15",
              rest_seconds: 45,
              instructions: "Neutral grip throughout. Works brachialis."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "wednesday",
      day_label: "Legs",
      muscle_groups: [
        {
          name: "quadriceps",
          exercises: [
            {
              name: "Barbell Squats",
              sets: 4,
              reps: "8-12",
              rest_seconds: 120,
              weight: "Moderate-Heavy",
              instructions: "Depth to parallel or below. Keep chest up, core tight."
            },
            {
              name: "Leg Press",
              sets: 3,
              reps: "12-15",
              rest_seconds: 60,
              instructions: "Full range of motion. Don't lock knees at top."
            }
          ]
        },
        {
          name: "hamstrings",
          exercises: [
            {
              name: "Romanian Deadlifts",
              sets: 4,
              reps: "8-10",
              rest_seconds: 90,
              weight: "Moderate",
              instructions: "Feel stretch in hamstrings. Keep bar close to legs."
            }
          ]
        },
        {
          name: "calves",
          exercises: [
            {
              name: "Standing Calf Raises",
              sets: 4,
              reps: "15-20",
              rest_seconds: 45,
              instructions: "Full stretch at bottom, squeeze at top. Pause for 1 second."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "thursday",
      day_label: "Push (Volume)",
      muscle_groups: [
        {
          name: "chest",
          exercises: [
            {
              name: "Cable Flyes",
              sets: 4,
              reps: "12-15",
              rest_seconds: 45,
              instructions: "Squeeze chest at peak contraction. Slow negative."
            }
          ]
        },
        {
          name: "shoulders",
          exercises: [
            {
              name: "Arnold Press",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Rotate palms from facing you to facing forward as you press."
            },
            {
              name: "Face Pulls",
              sets: 3,
              reps: "15-20",
              rest_seconds: 45,
              instructions: "Pull to face level with external rotation. Great for rear delts."
            }
          ]
        },
        {
          name: "triceps",
          exercises: [
            {
              name: "Overhead Tricep Extension",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Full stretch at bottom. Keep elbows pointed forward."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "friday",
      day_label: "Pull (Volume)",
      muscle_groups: [
        {
          name: "back",
          exercises: [
            {
              name: "Single Arm Dumbbell Rows",
              sets: 3,
              reps: "10-12 each",
              rest_seconds: 60,
              instructions: "Full stretch at bottom, squeeze at top."
            },
            {
              name: "Straight Arm Pulldowns",
              sets: 3,
              reps: "12-15",
              rest_seconds: 45,
              instructions: "Keep arms straight, feel lats working."
            }
          ]
        },
        {
          name: "biceps",
          exercises: [
            {
              name: "Preacher Curls",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              instructions: "Full extension at bottom. Controlled movement."
            }
          ]
        }
      ]
    },
    {
      day_of_week: "saturday",
      day_label: "Legs + Core",
      muscle_groups: [
        {
          name: "quadriceps",
          exercises: [
            {
              name: "Bulgarian Split Squats",
              sets: 3,
              reps: "10 each leg",
              rest_seconds: 60,
              instructions: "Back foot elevated on bench. Keep front knee over ankle."
            }
          ]
        },
        {
          name: "glutes",
          exercises: [
            {
              name: "Hip Thrusts",
              sets: 4,
              reps: "12-15",
              rest_seconds: 60,
              weight: "Heavy",
              instructions: "Squeeze glutes hard at top. Pause for 1 second."
            }
          ]
        },
        {
          name: "abs",
          exercises: [
            {
              name: "Hanging Leg Raises",
              sets: 3,
              reps: "10-15",
              rest_seconds: 60,
              instructions: "Raise legs to parallel or higher. Control the swing."
            },
            {
              name: "Plank",
              sets: 3,
              reps: "60 seconds",
              rest_seconds: 45,
              instructions: "Full body tension. Breathe normally."
            }
          ]
        }
      ]
    }
  ]
};
