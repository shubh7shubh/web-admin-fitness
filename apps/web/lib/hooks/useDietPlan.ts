import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { createClient } from "@/lib/supabase-browser";
import type { DietPlan } from "@/shared/types";

export function useDietPlan(userId: string) {
  return useQuery({
    queryKey: queryKeys.dietPlan(userId),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc("get_active_diet_plan")
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      return (data as DietPlan) || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
}
