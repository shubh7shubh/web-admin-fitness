export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  height_cm?: number;
  current_weight_kg?: number;
  goal_weight_kg?: number;
  activity_level?: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
  goal_type?: "lose" | "maintain" | "gain";
  goal_rate_kg_per_week?: number;
  daily_calorie_goal?: number;
  protein_goal_g?: number;
  carbs_goal_g?: number;
  fat_goal_g?: number;
  fiber_goal_g?: number;
  tdee?: number;
  points?: number;
  rank?: number;
  follower_count?: number;
  following_count?: number;
  posts_count?: number;
  is_admin?: boolean;
  is_banned?: boolean;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserGoals {
  daily_calorie_goal?: number;
  protein_goal_g?: number;
  carbs_goal_g?: number;
  fat_goal_g?: number;
  fiber_goal_g?: number;
  tdee?: number;
}

export interface PremiumStatus {
  hasSubscription: boolean;
  subscriptionTier: "free" | "premium" | "pro";
  hasAssessment: boolean;
  assessmentStatus: "pending" | "active" | "inactive" | null;
  hasDietPlan: boolean;
  hasWorkoutPlan: boolean;
  gatekeeperState: "upsell" | "needs_assessment" | "pending" | "active";
}
