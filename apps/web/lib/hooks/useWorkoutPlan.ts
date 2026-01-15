import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { createClient } from "@/lib/supabase-browser";
import type { WorkoutPlan } from "@/shared/types";

export function useWorkoutPlan(userId: string) {
  return useQuery({
    queryKey: queryKeys.workoutPlan(userId),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc("get_active_workout_plan")
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      return (data as WorkoutPlan) || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
}
