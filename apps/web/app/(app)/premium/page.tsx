"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { usePremiumStatus } from "@/lib/hooks/usePremiumStatus";
import { UpsellView } from "@/components/premium/UpsellView";
import { PendingView } from "@/components/premium/PendingView";
import { PlanDashboard } from "@/components/premium/PlanDashboard";

export default function PremiumPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const { data: premiumStatus, isLoading, error } = usePremiumStatus(user?.id);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  // Handle routing based on gatekeeper state
  useEffect(() => {
    if (!premiumStatus || !user) return;

    const { gatekeeper_state } = premiumStatus;

    switch (gatekeeper_state) {
      case "needs_assessment":
        // Premium user without assessment - redirect to form
        router.push("/premium/assessment");
        break;
      case "upsell":
        // Free user - show marketing page (handled below)
        break;
      case "pending":
        // Assessment submitted, waiting for plan - show pending view (handled below)
        break;
      case "active":
        // Plan ready - show dashboard (handled below)
        break;
      default:
        break;
    }
  }, [premiumStatus, router, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error loading premium status
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!premiumStatus) {
    return null;
  }

  const { gatekeeper_state } = premiumStatus;

  // Render appropriate view based on state
  if (gatekeeper_state === "upsell") {
    return <UpsellView />;
  }

  if (gatekeeper_state === "pending") {
    return <PendingView />;
  }

  if (gatekeeper_state === "active") {
    return <PlanDashboard userId={user.id} />;
  }

  return null;
}
