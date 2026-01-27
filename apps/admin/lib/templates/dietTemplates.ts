/**
 * Diet Plan Templates - Simplified flat meal structure
 *
 * New structure: { meals: [...] }
 * - Flat array of meals that repeat every day
 * - No weeks/days nesting
 * - Repeats for duration_weeks
 */

export interface DietMeal {
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

export interface DietPlanData {
  meals: DietMeal[];
}

// Minimal diet plan for quick UI testing
export const minimalDietPlan: DietPlanData = {
  meals: [
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
      instructions: "Roast oats, sauté vegetables with spices, mix and cook for 5 mins"
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
      instructions: "Serve hot dal with rice and curry"
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
      instructions: "Mix yogurt with nuts and honey"
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
      instructions: "Grill paneer with spices, toss with fresh salad"
    }
  ]
};

// Full Indian diet plan (same meals, higher variety)
export const fullIndianDietPlan: DietPlanData = {
  meals: [
    {
      meal_number: 1,
      meal_type: "breakfast",
      timing: "8:00 AM",
      name: "Oats Upma with Vegetables",
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 8,
      ingredients: ["Oats 50g", "Mixed vegetables", "Curry leaves", "Mustard seeds", "Peanuts 10g"],
      instructions: "Roast oats until fragrant. Sauté vegetables with curry leaves, mustard seeds, and peanuts. Mix with oats and cook for 5 minutes."
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
      ingredients: ["Rice 100g", "Moong dal 100g", "Mixed veg curry", "1 tsp ghee", "Pickle"],
      instructions: "Cook dal with turmeric and temper with cumin. Serve hot with steamed rice, vegetable curry, and a side of pickle."
    },
    {
      meal_number: 3,
      meal_type: "snacks",
      timing: "4:00 PM",
      name: "Sprouts Chaat",
      calories: 180,
      protein: 10,
      carbs: 25,
      fat: 4,
      ingredients: ["Mixed sprouts 100g", "Onion", "Tomato", "Lemon juice", "Chaat masala"],
      instructions: "Mix boiled sprouts with chopped onion, tomato, lemon juice and chaat masala."
    },
    {
      meal_number: 4,
      meal_type: "dinner",
      timing: "8:00 PM",
      name: "Grilled Paneer with Roti",
      calories: 450,
      protein: 24,
      carbs: 40,
      fat: 20,
      ingredients: ["Paneer 100g", "Whole wheat roti 2", "Mixed salad", "Mint chutney"],
      instructions: "Grill marinated paneer with spices. Serve with fresh rotis, salad and mint chutney."
    }
  ]
};

// High protein diet template
export const highProteinDietPlan: DietPlanData = {
  meals: [
    {
      meal_number: 1,
      meal_type: "breakfast",
      timing: "7:30 AM",
      name: "Protein Shake with Oats",
      calories: 400,
      protein: 30,
      carbs: 45,
      fat: 10,
      ingredients: ["Whey protein 30g", "Oats 50g", "Banana", "Milk 200ml", "Peanut butter 1 tbsp"],
      instructions: "Blend all ingredients until smooth. Add ice for a thicker shake."
    },
    {
      meal_number: 2,
      meal_type: "lunch",
      timing: "12:30 PM",
      name: "Grilled Chicken with Quinoa",
      calories: 550,
      protein: 45,
      carbs: 50,
      fat: 15,
      ingredients: ["Chicken breast 200g", "Quinoa 80g", "Broccoli 100g", "Olive oil 1 tbsp"],
      instructions: "Grill seasoned chicken breast. Serve with cooked quinoa and steamed broccoli."
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
      ingredients: ["Greek yogurt 200g", "Almonds 20g", "Honey 1 tsp", "Chia seeds 1 tbsp"],
      instructions: "Mix yogurt with nuts, honey and chia seeds."
    },
    {
      meal_number: 4,
      meal_type: "dinner",
      timing: "8:00 PM",
      name: "Fish with Sweet Potato",
      calories: 480,
      protein: 40,
      carbs: 40,
      fat: 14,
      ingredients: ["Fish fillet 180g", "Sweet potato 150g", "Green beans 100g", "Lemon"],
      instructions: "Bake fish with lemon and herbs. Serve with roasted sweet potato and steamed green beans."
    }
  ]
};
