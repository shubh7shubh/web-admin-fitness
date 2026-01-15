export interface DiaryEntry {
  id: string;
  user_id: string;
  food_id?: string;
  food_name: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snacks";
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  entry_date: string;
  created_at: string;
}

export interface NutritionSummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  calorie_goal: number;
  protein_goal: number;
  carbs_goal: number;
  fat_goal: number;
  fiber_goal: number;
}

export interface WeightEntry {
  id: string;
  user_id: string;
  weight_kg: number;
  recorded_at: string;
  created_at: string;
}
