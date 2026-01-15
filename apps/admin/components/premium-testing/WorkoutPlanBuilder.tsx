"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { minimalWorkoutPlan, beginnerWorkoutPlan } from "@/lib/templates/workoutTemplates";

interface WorkoutPlanBuilderProps {
  userId: string;
  onPlanSaved?: () => void;
}

export function WorkoutPlanBuilder({ userId, onPlanSaved }: WorkoutPlanBuilderProps) {
  const [planJson, setPlanJson] = useState("");
  const [saving, setSaving] = useState(false);

  const loadTemplate = (templateName: string) => {
    let template;
    if (templateName === "minimal") template = minimalWorkoutPlan;
    else if (templateName === "beginner") template = beginnerWorkoutPlan;

    setPlanJson(JSON.stringify(template, null, 2));
  };

  const savePlan = async () => {
    try {
      setSaving(true);
      const planData = JSON.parse(planJson);

      const response = await fetch("/api/premium-testing/create-workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planData }),
      });

      if (response.ok) {
        alert("Workout plan saved!");
        onPlanSaved?.();
      } else {
        const error = await response.json();
        alert("Error saving plan: " + error.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async () => {
    if (!confirm("Delete workout plan?")) return;

    await fetch("/api/premium-testing/delete-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planType: "workout" }),
    });

    setPlanJson("");
    onPlanSaved?.();
    alert("Workout plan deleted");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Workout Plan Builder</h3>

      <div className="flex gap-4 mb-4">
        <Button onClick={() => loadTemplate("minimal")} variant="outline" size="sm">
          Load Minimal (1 week)
        </Button>
        <Button onClick={() => loadTemplate("beginner")} variant="outline" size="sm">
          Load Beginner (8 weeks)
        </Button>
      </div>

      <Textarea
        value={planJson}
        onChange={(e) => setPlanJson(e.target.value)}
        placeholder='{"weeks": [...]}'
        className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm min-h-[300px] mb-4"
      />

      <div className="flex gap-4">
        <Button onClick={savePlan} disabled={!planJson || saving}>
          {saving ? "Saving..." : "Save Workout Plan"}
        </Button>
        <Button onClick={deletePlan} variant="destructive">
          Delete Plan
        </Button>
      </div>
    </div>
  );
}
