"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Meal {
  meal_number: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snacks";
  timing: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string;
}

interface DietPlanBuilderProps {
  userId: string;
  onPlanSaved?: () => void;
}

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snacks", label: "Snacks" },
] as const;

const DEFAULT_TIMINGS: Record<string, string> = {
  breakfast: "8:00 AM",
  lunch: "1:00 PM",
  snacks: "4:00 PM",
  dinner: "8:00 PM",
};

function createEmptyMeal(mealNumber: number): Meal {
  return {
    meal_number: mealNumber,
    meal_type: "breakfast",
    timing: "8:00 AM",
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ingredients: [""],
    instructions: "",
  };
}

const sampleMeals: Meal[] = [
  {
    meal_number: 1,
    meal_type: "breakfast",
    timing: "8:00 AM",
    name: "Oats Upma with Vegetables",
    calories: 350,
    protein: 12,
    carbs: 55,
    fat: 8,
    ingredients: ["Oats 50g", "Mixed vegetables", "Curry leaves", "Mustard seeds"],
    instructions: "Roast oats, saut\u00e9 vegetables with spices, mix and cook for 5 mins",
  },
  {
    meal_number: 2,
    meal_type: "lunch",
    timing: "1:00 PM",
    name: "Dal Rice with Vegetable Curry",
    calories: 500,
    protein: 18,
    carbs: 70,
    fat: 12,
    ingredients: ["Rice 100g", "Moong dal 100g", "Mixed veg curry", "1 tsp ghee"],
    instructions: "Serve hot dal with rice and curry",
  },
  {
    meal_number: 3,
    meal_type: "snacks",
    timing: "4:00 PM",
    name: "Greek Yogurt with Nuts",
    calories: 250,
    protein: 20,
    carbs: 15,
    fat: 12,
    ingredients: ["Greek yogurt 200g", "Almonds 20g", "Honey 1 tsp"],
    instructions: "Mix yogurt with nuts and honey",
  },
  {
    meal_number: 4,
    meal_type: "dinner",
    timing: "8:00 PM",
    name: "Grilled Paneer Salad",
    calories: 400,
    protein: 22,
    carbs: 25,
    fat: 18,
    ingredients: ["Paneer 100g", "Salad greens", "Cherry tomatoes", "Olive oil"],
    instructions: "Grill paneer with spices, toss with fresh salad",
  },
];

export function DietPlanBuilder({ userId, onPlanSaved }: DietPlanBuilderProps) {
  const [planName, setPlanName] = useState("Personalized Diet Plan");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [saving, setSaving] = useState(false);

  const addMeal = () => {
    const newMeal = createEmptyMeal(meals.length + 1);
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (index: number) => {
    const updated = meals.filter((_, i) => i !== index).map((m, i) => ({
      ...m,
      meal_number: i + 1,
    }));
    setMeals(updated);
  };

  const updateMeal = (index: number, field: keyof Meal, value: any) => {
    const updated = [...meals];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "meal_type" && DEFAULT_TIMINGS[value as string]) {
      updated[index].timing = DEFAULT_TIMINGS[value as string];
    }
    setMeals(updated);
  };

  const addIngredient = (mealIndex: number) => {
    const updated = [...meals];
    updated[mealIndex] = {
      ...updated[mealIndex],
      ingredients: [...updated[mealIndex].ingredients, ""],
    };
    setMeals(updated);
  };

  const removeIngredient = (mealIndex: number, ingIndex: number) => {
    const updated = [...meals];
    updated[mealIndex] = {
      ...updated[mealIndex],
      ingredients: updated[mealIndex].ingredients.filter((_, i) => i !== ingIndex),
    };
    setMeals(updated);
  };

  const updateIngredient = (mealIndex: number, ingIndex: number, value: string) => {
    const updated = [...meals];
    const newIngredients = [...updated[mealIndex].ingredients];
    newIngredients[ingIndex] = value;
    updated[mealIndex] = { ...updated[mealIndex], ingredients: newIngredients };
    setMeals(updated);
  };

  const loadSampleMeals = () => {
    setMeals(sampleMeals);
  };

  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const savePlan = async () => {
    if (meals.length === 0) {
      alert("Add at least one meal");
      return;
    }
    const emptyMeals = meals.filter((m) => !m.name.trim());
    if (emptyMeals.length > 0) {
      alert("All meals must have a name");
      return;
    }

    try {
      setSaving(true);
      const planData = {
        meals: meals.map((m) => ({
          ...m,
          ingredients: m.ingredients.filter((i) => i.trim() !== ""),
        })),
      };

      const response = await fetch("/api/premium-testing/create-diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planData, planName, durationWeeks }),
      });

      if (response.ok) {
        alert("Diet plan saved!");
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
    if (!confirm("Delete diet plan?")) return;

    await fetch("/api/premium-testing/delete-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planType: "diet" }),
    });

    setMeals([]);
    onPlanSaved?.();
    alert("Diet plan deleted");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Diet Plan Builder</h3>

      {/* Plan Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Plan Name</label>
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Duration</label>
          <select
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value))}
            className="w-full h-9 rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 text-sm"
          >
            <option value={4}>4 Weeks</option>
            <option value={8}>8 Weeks</option>
            <option value={12}>12 Weeks</option>
          </select>
        </div>
      </div>

      {/* Daily Totals Summary */}
      {meals.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-zinc-400 mb-2">
            Daily Totals ({meals.length} meal{meals.length !== 1 ? "s" : ""})
          </h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">{dailyTotals.calories}</div>
              <div className="text-xs text-zinc-500">Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{dailyTotals.protein}g</div>
              <div className="text-xs text-zinc-500">Protein</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{dailyTotals.carbs}g</div>
              <div className="text-xs text-zinc-500">Carbs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-400">{dailyTotals.fat}g</div>
              <div className="text-xs text-zinc-500">Fat</div>
            </div>
          </div>
        </div>
      )}

      {/* Load Template */}
      <div className="flex gap-3 mb-4">
        <Button onClick={loadSampleMeals} variant="outline" size="sm">
          Load Sample Meals
        </Button>
        <Button onClick={addMeal} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          + Add Meal
        </Button>
      </div>

      {/* Meal Cards */}
      <div className="space-y-4 mb-6">
        {meals.map((meal, mealIndex) => (
          <div
            key={mealIndex}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-4"
          >
            {/* Meal Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-emerald-400">
                Meal {meal.meal_number}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMeal(mealIndex)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2"
              >
                Remove
              </Button>
            </div>

            {/* Row 1: Type, Timing, Name */}
            <div className="grid grid-cols-[140px_120px_1fr] gap-3 mb-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Type</label>
                <select
                  value={meal.meal_type}
                  onChange={(e) => updateMeal(mealIndex, "meal_type", e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-600 bg-zinc-700 text-white px-2 text-sm"
                >
                  {MEAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Timing</label>
                <Input
                  value={meal.timing}
                  onChange={(e) => updateMeal(mealIndex, "timing", e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                  placeholder="8:00 AM"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Meal Name</label>
                <Input
                  value={meal.name}
                  onChange={(e) => updateMeal(mealIndex, "name", e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                  placeholder="e.g., Oats Upma with Vegetables"
                />
              </div>
            </div>

            {/* Row 2: Macros */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Calories</label>
                <Input
                  type="number"
                  value={meal.calories || ""}
                  onChange={(e) => updateMeal(mealIndex, "calories", Number(e.target.value))}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                  placeholder="350"
                />
              </div>
              <div>
                <label className="text-xs text-blue-400 mb-1 block">Protein (g)</label>
                <Input
                  type="number"
                  value={meal.protein || ""}
                  onChange={(e) => updateMeal(mealIndex, "protein", Number(e.target.value))}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                  placeholder="12"
                />
              </div>
              <div>
                <label className="text-xs text-amber-400 mb-1 block">Carbs (g)</label>
                <Input
                  type="number"
                  value={meal.carbs || ""}
                  onChange={(e) => updateMeal(mealIndex, "carbs", Number(e.target.value))}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                  placeholder="55"
                />
              </div>
              <div>
                <label className="text-xs text-rose-400 mb-1 block">Fat (g)</label>
                <Input
                  type="number"
                  value={meal.fat || ""}
                  onChange={(e) => updateMeal(mealIndex, "fat", Number(e.target.value))}
                  className="bg-zinc-700 border-zinc-600 text-white text-sm"
                  placeholder="8"
                />
              </div>
            </div>

            {/* Row 3: Ingredients */}
            <div className="mb-3">
              <label className="text-xs text-zinc-500 mb-1 block">Ingredients</label>
              <div className="space-y-1">
                {meal.ingredients.map((ing, ingIndex) => (
                  <div key={ingIndex} className="flex gap-2">
                    <Input
                      value={ing}
                      onChange={(e) => updateIngredient(mealIndex, ingIndex, e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white text-sm flex-1"
                      placeholder="e.g., Oats 50g"
                    />
                    {meal.ingredients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(mealIndex, ingIndex)}
                        className="text-zinc-500 hover:text-red-400 h-9 px-2"
                      >
                        x
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addIngredient(mealIndex)}
                className="text-zinc-400 hover:text-white mt-1 h-7 text-xs"
              >
                + Add Ingredient
              </Button>
            </div>

            {/* Row 4: Instructions */}
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Instructions</label>
              <Textarea
                value={meal.instructions}
                onChange={(e) => updateMeal(mealIndex, "instructions", e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-white text-sm min-h-[60px]"
                placeholder="Cooking instructions..."
              />
            </div>
          </div>
        ))}
      </div>

      {meals.length === 0 && (
        <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-700 rounded-lg mb-6">
          No meals added yet. Click "Add Meal" or "Load Sample Meals" to start.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={savePlan}
          disabled={meals.length === 0 || saving}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {saving ? "Saving..." : "Save Diet Plan"}
        </Button>
        <Button onClick={deletePlan} variant="destructive">
          Delete Plan
        </Button>
      </div>
    </div>
  );
}
