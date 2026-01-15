import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { createClient } from "@/lib/supabase-browser";
import type { PremiumStatus } from "@/shared/types";

export function usePremiumStatus(userId: string) {
  return useQuery({
    queryKey: queryKeys.premiumStatus(userId),
    queryFn: async () => {
      const supabase = createClient();

      // Call the RPC function directly (matches Expo app)
      const { data, error } = await supabase
        .rpc('get_user_premium_status')
        .single();

      if (error) {
        console.error("Error fetching premium status:", error);
        throw error;
      }

      // Type the RPC response
      const rpcData = data as {
        gatekeeper_state: "upsell" | "needs_assessment" | "pending" | "active";
        subscription_tier: "free" | "premium";
        assessment_status: "not_started" | "pending" | "active" | null;
        has_diet_plan: boolean;
        has_workout_plan: boolean;
      };

      // Transform to match PremiumStatus interface
      return {
        gatekeeper_state: rpcData.gatekeeper_state,
        subscription_tier: rpcData.subscription_tier,
        subscription_expires_at: null, // Not returned by RPC but needed by type
        assessment_status: rpcData.assessment_status,
        has_active_diet_plan: rpcData.has_diet_plan,
        has_active_workout_plan: rpcData.has_workout_plan,
      } as PremiumStatus;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
    enabled: !!userId,
    retry: 1, // Only retry once on error
  });
}
