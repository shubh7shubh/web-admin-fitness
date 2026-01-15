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
  status: "pending" | "active";

  // General Section
  fitness_goals: string;
  activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
  age: number;
  gender: "male" | "female" | "other";
  current_weight_kg: number;
  target_weight_kg?: number;

  // Nutrition Section
  dietary_preferences?: string;
  health_conditions?: string;
  meal_frequency?: number;
  favorite_foods?: string;
  foods_to_avoid?: string;

  // Workout Section
  workout_experience: "beginner" | "intermediate" | "advanced";
  available_equipment?: string;
  time_availability: "15min" | "30min" | "45min" | "60min+";
  workout_days_per_week?: number;
  preferred_workout_type?: "strength" | "cardio" | "flexibility" | "mixed";
  injuries_limitations?: string;

  created_at: string;
  updated_at: string;
}
