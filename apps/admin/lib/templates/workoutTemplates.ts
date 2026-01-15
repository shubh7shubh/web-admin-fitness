// Minimal 1-week workout plan for quick UI testing
export const minimalWorkoutPlan = {
  weeks: [
    {
      week_number: 1,
      days: [
        {
          day_number: 1,
          day_name: "Full Body Strength",
          exercises: [
            {
              exercise_name: "Push-ups",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              notes: "Keep body straight, core engaged"
            },
            {
              exercise_name: "Bodyweight Squats",
              sets: 3,
              reps: "15-20",
              rest_seconds: 60,
              notes: "Go parallel or below, knees aligned with toes"
            },
            {
              exercise_name: "Plank Hold",
              sets: 3,
              reps: "30 seconds",
              rest_seconds: 60,
              notes: "Engage core, keep back straight"
            },
            {
              exercise_name: "Lunges",
              sets: 3,
              reps: "10 each leg",
              rest_seconds: 60,
              notes: "Alternate legs, maintain balance"
            }
          ]
        },
        {
          day_number: 2,
          day_name: "Rest / Light Cardio",
          exercises: [
            {
              exercise_name: "Walking or Light Jog",
              sets: 1,
              reps: "20-30 min",
              rest_seconds: 0,
              notes: "Active recovery, low intensity"
            }
          ]
        },
        {
          day_number: 3,
          day_name: "Upper Body",
          exercises: [
            {
              exercise_name: "Incline Push-ups",
              sets: 3,
              reps: "12-15",
              rest_seconds: 60,
              notes: "Hands on elevated surface"
            },
            {
              exercise_name: "Diamond Push-ups",
              sets: 3,
              reps: "8-10",
              rest_seconds: 60,
              notes: "Hands close together, targets triceps"
            },
            {
              exercise_name: "Shoulder Taps",
              sets: 3,
              reps: "20 total",
              rest_seconds: 60,
              notes: "In plank position, tap opposite shoulder"
            },
            {
              exercise_name: "Tricep Dips",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              notes: "Use chair or bench"
            }
          ]
        },
        {
          day_number: 4,
          day_name: "Rest Day",
          exercises: []
        },
        {
          day_number: 5,
          day_name: "Lower Body",
          exercises: [
            {
              exercise_name: "Jump Squats",
              sets: 3,
              reps: "12-15",
              rest_seconds: 90,
              notes: "Land softly, full squat depth"
            },
            {
              exercise_name: "Bulgarian Split Squats",
              sets: 3,
              reps: "10 each leg",
              rest_seconds: 60,
              notes: "Back foot elevated on bench"
            },
            {
              exercise_name: "Glute Bridges",
              sets: 3,
              reps: "15-20",
              rest_seconds: 60,
              notes: "Squeeze glutes at top"
            },
            {
              exercise_name: "Calf Raises",
              sets: 3,
              reps: "20-25",
              rest_seconds: 45,
              notes: "Use elevated surface for full range"
            }
          ]
        },
        {
          day_number: 6,
          day_name: "Core & Cardio",
          exercises: [
            {
              exercise_name: "Mountain Climbers",
              sets: 3,
              reps: "30 seconds",
              rest_seconds: 45,
              notes: "Keep hips level, fast pace"
            },
            {
              exercise_name: "Bicycle Crunches",
              sets: 3,
              reps: "20 total",
              rest_seconds: 45,
              notes: "Touch elbow to opposite knee"
            },
            {
              exercise_name: "Russian Twists",
              sets: 3,
              reps: "30 total",
              rest_seconds: 45,
              notes: "Keep feet elevated, twist fully"
            },
            {
              exercise_name: "Burpees",
              sets: 3,
              reps: "10-12",
              rest_seconds: 60,
              notes: "Full movement, jump at top"
            }
          ]
        },
        {
          day_number: 7,
          day_name: "Active Rest",
          exercises: [
            {
              exercise_name: "Yoga or Stretching",
              sets: 1,
              reps: "20-30 min",
              rest_seconds: 0,
              notes: "Focus on flexibility and recovery"
            }
          ]
        }
      ]
    }
  ]
};

// Beginner 8-week progressive workout plan
export const beginnerWorkoutPlan = {
  weeks: Array.from({ length: 8 }, (_, weekIndex) => ({
    week_number: weekIndex + 1,
    days: minimalWorkoutPlan.weeks[0].days.map((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) => ({
        ...exercise,
        // Progressively increase reps/sets for weeks 2-8
        sets: weekIndex >= 4 ? Math.min(exercise.sets + 1, 4) : exercise.sets,
        reps: exercise.reps.includes("10")
          ? exercise.reps.replace("10", String(10 + weekIndex * 2))
          : exercise.reps
      }))
    }))
  }))
};

// Intermediate 8-week workout plan with equipment
export const intermediateWorkoutPlan = {
  weeks: Array.from({ length: 8 }, (_, weekIndex) => ({
    week_number: weekIndex + 1,
    days: [
      {
        day_number: 1,
        day_name: "Chest & Triceps",
        exercises: [
          {
            exercise_name: "Dumbbell Bench Press",
            sets: 4,
            reps: "8-12",
            rest_seconds: 90,
            notes: "Control the weight, full range of motion"
          },
          {
            exercise_name: "Incline Dumbbell Press",
            sets: 3,
            reps: "10-12",
            rest_seconds: 60,
            notes: "30-45 degree incline"
          },
          {
            exercise_name: "Cable Flyes",
            sets: 3,
            reps: "12-15",
            rest_seconds: 60,
            notes: "Squeeze chest at peak contraction"
          },
          {
            exercise_name: "Tricep Pushdowns",
            sets: 3,
            reps: "12-15",
            rest_seconds: 45,
            notes: "Keep elbows fixed at sides"
          },
          {
            exercise_name: "Overhead Tricep Extension",
            sets: 3,
            reps: "10-12",
            rest_seconds: 60,
            notes: "Full stretch at bottom"
          }
        ]
      },
      {
        day_number: 2,
        day_name: "Back & Biceps",
        exercises: [
          {
            exercise_name: "Pull-ups or Lat Pulldowns",
            sets: 4,
            reps: "8-12",
            rest_seconds: 90,
            notes: "Wide grip, full extension"
          },
          {
            exercise_name: "Barbell Rows",
            sets: 4,
            reps: "8-10",
            rest_seconds: 90,
            notes: "Pull to lower chest"
          },
          {
            exercise_name: "Seated Cable Rows",
            sets: 3,
            reps: "10-12",
            rest_seconds: 60,
            notes: "Squeeze shoulder blades"
          },
          {
            exercise_name: "Dumbbell Bicep Curls",
            sets: 3,
            reps: "10-12",
            rest_seconds: 60,
            notes: "Control the negative"
          },
          {
            exercise_name: "Hammer Curls",
            sets: 3,
            reps: "12-15",
            rest_seconds: 45,
            notes: "Neutral grip throughout"
          }
        ]
      },
      {
        day_number: 3,
        day_name: "Rest or Active Recovery",
        exercises: [
          {
            exercise_name: "Light Cardio",
            sets: 1,
            reps: "20-30 min",
            rest_seconds: 0,
            notes: "Walking, cycling, or swimming"
          }
        ]
      },
      {
        day_number: 4,
        day_name: "Legs",
        exercises: [
          {
            exercise_name: "Barbell Squats",
            sets: 4,
            reps: "8-12",
            rest_seconds: 120,
            notes: "Depth to parallel or below"
          },
          {
            exercise_name: "Romanian Deadlifts",
            sets: 4,
            reps: "8-10",
            rest_seconds: 90,
            notes: "Feel stretch in hamstrings"
          },
          {
            exercise_name: "Leg Press",
            sets: 3,
            reps: "12-15",
            rest_seconds: 60,
            notes: "Full range of motion"
          },
          {
            exercise_name: "Leg Curls",
            sets: 3,
            reps: "12-15",
            rest_seconds: 45,
            notes: "Squeeze hamstrings at top"
          },
          {
            exercise_name: "Calf Raises",
            sets: 4,
            reps: "15-20",
            rest_seconds: 45,
            notes: "Full stretch and contraction"
          }
        ]
      },
      {
        day_number: 5,
        day_name: "Shoulders & Abs",
        exercises: [
          {
            exercise_name: "Military Press",
            sets: 4,
            reps: "8-10",
            rest_seconds: 90,
            notes: "Strict form, no leg drive"
          },
          {
            exercise_name: "Lateral Raises",
            sets: 3,
            reps: "12-15",
            rest_seconds: 45,
            notes: "Light weight, control the movement"
          },
          {
            exercise_name: "Front Raises",
            sets: 3,
            reps: "12-15",
            rest_seconds: 45,
            notes: "Alternate arms or both together"
          },
          {
            exercise_name: "Face Pulls",
            sets: 3,
            reps: "15-20",
            rest_seconds: 45,
            notes: "Pull to face level, external rotation"
          },
          {
            exercise_name: "Hanging Leg Raises",
            sets: 3,
            reps: "10-15",
            rest_seconds: 60,
            notes: "Raise knees to chest"
          },
          {
            exercise_name: "Plank",
            sets: 3,
            reps: "60 seconds",
            rest_seconds: 60,
            notes: "Full body tension"
          }
        ]
      },
      {
        day_number: 6,
        day_name: "Full Body HIIT",
        exercises: [
          {
            exercise_name: "Kettlebell Swings",
            sets: 4,
            reps: "15",
            rest_seconds: 45,
            notes: "Hip hinge movement, explosive"
          },
          {
            exercise_name: "Box Jumps",
            sets: 4,
            reps: "10",
            rest_seconds: 60,
            notes: "Land softly, full hip extension"
          },
          {
            exercise_name: "Battle Ropes",
            sets: 4,
            reps: "30 seconds",
            rest_seconds: 30,
            notes: "Alternate waves, high intensity"
          },
          {
            exercise_name: "Medicine Ball Slams",
            sets: 4,
            reps: "12",
            rest_seconds: 45,
            notes: "Full body power movement"
          }
        ]
      },
      {
        day_number: 7,
        day_name: "Rest Day",
        exercises: []
      }
    ]
  }))
};
