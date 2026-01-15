"use client";

import { useState, useEffect, use } from "react";
import { StateButtons } from "@/components/premium-testing/StateButtons";
import { PremiumStatusCard } from "@/components/premium-testing/PremiumStatusCard";
import { DietPlanBuilder } from "@/components/premium-testing/DietPlanBuilder";
import { WorkoutPlanBuilder } from "@/components/premium-testing/WorkoutPlanBuilder";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UserTestingPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [premiumStatus, setPremiumStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadUserData = async () => {
    try {
      // Use API route with service role key to bypass RLS
      const response = await fetch(`/api/premium-testing/get-user-status?userId=${userId}`);

      if (!response.ok) {
        console.error("Failed to fetch user status");
        return;
      }

      const data = await response.json();
      setUserInfo(data.userInfo);
      setPremiumStatus(data.premiumStatus);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const setUserState = async (targetState: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/premium-testing/set-user-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetState }),
      });

      if (response.ok) {
        await loadUserData();
        alert(`User state changed to: ${targetState}`);
      } else {
        const error = await response.json();
        alert("Failed to change state: " + error.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href="/premium-testing" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Premium Testing
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">
        Premium Testing: {userInfo?.username || "Loading..."}
      </h1>
      <p className="text-zinc-400 mb-8">Manage premium state and create test plans</p>

      <div className="space-y-8">
        <PremiumStatusCard status={premiumStatus} />
        <StateButtons onStateChange={setUserState} loading={loading} />
        <DietPlanBuilder userId={userId} onPlanSaved={loadUserData} />
        <WorkoutPlanBuilder userId={userId} onPlanSaved={loadUserData} />
      </div>
    </div>
  );
}
