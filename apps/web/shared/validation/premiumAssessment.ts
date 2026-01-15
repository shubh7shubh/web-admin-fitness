import { z } from "zod";

export const premiumAssessmentSchema = z.object({
  // Base Assessment Fields (10 fields)
  fitness_goals: z.string().min(10, "At least 10 characters").max(500),
  dietary_preferences: z.string().max(1000).optional(),
  health_conditions: z.string().max(1000).optional(),
  activity_level: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  meal_frequency: z.number().min(1).max(8).optional(),
  favorite_foods: z.string().max(500).optional(),
  foods_to_avoid: z.string().max(500).optional(),
  workout_experience: z.enum(["beginner", "intermediate", "advanced"]),
  available_equipment: z.string().max(500).optional(),
  time_availability: z.enum(["15min", "30min", "45min", "60min_plus"]),  // Fixed

  // Workout-specific Fields (7 additional fields)
  workout_days_per_week: z.number().min(1).max(7).optional(),
  preferred_workout_split: z.enum([
    "full_body",
    "upper_lower",
    "push_pull_legs",
    "body_part",
    "no_preference",
  ]).optional(),
  primary_workout_goal: z.enum([
    "muscle_gain",
    "strength",
    "fat_loss",
    "endurance",
    "general_fitness",
  ]),
  cardio_preference: z.enum(["none", "minimal", "moderate", "high"]),
  workout_limitations: z.string().max(1000).optional(),
  workout_environment: z.enum(["home", "commercial_gym", "both", "outdoor"]),
  preferred_workout_time: z.enum([
    "morning",
    "afternoon",
    "evening",
    "flexible",
  ]).optional(),
});

export type PremiumAssessmentData = z.infer<typeof premiumAssessmentSchema>;
