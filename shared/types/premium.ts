export interface PremiumStatus {
  gatekeeper_state: "upsell" | "needs_assessment" | "pending" | "active";
  subscription_tier: "free" | "premium";
  subscription_expires_at: string | null;
  assessment_status: "not_started" | "pending" | "active" | null;
  has_active_diet_plan: boolean;
  has_active_workout_plan: boolean;
}

export interface DietPlan {
  id: string;
  user_id: string;
  plan_data: {
    weeks: Array<{
      week_number: number;
      days: Array<{
        day_number: number;
        date: string;
        meals: Array<{
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          meal_name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          ingredients?: string[];
          instructions?: string;
        }>;
      }>;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  routine_data: {  // Correct field name for workout_plans table
    weeks: Array<{
      week_number: number;
      days: Array<{
        day_number: number;
        day_name: string;
        exercises: Array<{
          exercise_name: string;
          sets: number;
          reps: string;
          rest_seconds: number;
          notes?: string;
          video_url?: string;
        }>;
      }>;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface PremiumAssessment {
  id: string;
  user_id: string;
  status: "pending" | "active" | "inactive";  // Added "inactive"

  // Base Assessment Fields (10 fields from original implementation)
  fitness_goals: string;
  dietary_preferences?: string;
  health_conditions?: string;
  activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
  meal_frequency?: number;
  favorite_foods?: string;
  foods_to_avoid?: string;
  workout_experience: "beginner" | "intermediate" | "advanced";
  available_equipment?: string;
  time_availability: "15min" | "30min" | "45min" | "60min_plus";  // Fixed to match DB

  // Workout-specific Fields (7 additional fields added to DB)
  workout_days_per_week?: number;
  preferred_workout_split?: "full_body" | "upper_lower" | "push_pull_legs" | "body_part" | "no_preference";
  primary_workout_goal: "muscle_gain" | "strength" | "fat_loss" | "endurance" | "general_fitness";
  cardio_preference: "none" | "minimal" | "moderate" | "high";
  workout_limitations?: string;
  workout_environment: "home" | "commercial_gym" | "both" | "outdoor";
  preferred_workout_time?: "morning" | "afternoon" | "evening" | "flexible";

  // Admin fields
  admin_notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}
