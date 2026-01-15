"use client";

import { useState } from "react";
import { Utensils, Dumbbell } from "lucide-react";
import { DietPlanView } from "./DietPlanView";
import { WorkoutPlanView } from "./WorkoutPlanView";

interface PlanDashboardProps {
  userId: string;
}

type Tab = "diet" | "workout";

export function PlanDashboard({ userId }: PlanDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("diet");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Premium Plan
          </h1>
          <p className="text-lg text-gray-600">
            Follow your personalized 8-week program
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab("diet")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "diet"
                ? "bg-black text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Utensils className="w-5 h-5 mr-2" />
            Diet Plan
          </button>
          <button
            onClick={() => setActiveTab("workout")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === "workout"
                ? "bg-black text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Dumbbell className="w-5 h-5 mr-2" />
            Workout Plan
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "diet" && <DietPlanView userId={userId} />}
          {activeTab === "workout" && <WorkoutPlanView userId={userId} />}
        </div>
      </div>
    </div>
  );
}
