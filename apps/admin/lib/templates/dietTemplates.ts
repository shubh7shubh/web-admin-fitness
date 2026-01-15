// Helper function to generate dates for a specific week
export function generateWeekDates(startDate: string, weekNumber: number) {
  const dates = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + (weekNumber - 1) * 7 + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

// Minimal 1-week diet plan for quick UI testing
const today = new Date().toISOString().split("T")[0];

export const minimalDietPlan = {
  weeks: [
    {
      week_number: 1,
      days: [
        {
          day_number: 1,
          date: today,
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Oats Upma with Vegetables",
              calories: 350,
              protein: 12,
              carbs: 55,
              fat: 8,
              ingredients: ["Oats 50g", "Mixed vegetables", "Curry leaves", "Mustard seeds"],
              instructions: "Roast oats, sauté vegetables with spices, mix and cook for 5 mins"
            },
            {
              meal_type: "lunch",
              meal_name: "Dal Rice with Vegetable Curry",
              calories: 500,
              protein: 18,
              carbs: 70,
              fat: 12,
              ingredients: ["Rice 100g", "Moong dal 100g", "Mixed veg curry", "1 tsp ghee"],
              instructions: "Serve hot dal with rice and curry"
            },
            {
              meal_type: "dinner",
              meal_name: "Grilled Paneer Salad",
              calories: 400,
              protein: 22,
              carbs: 25,
              fat: 18,
              ingredients: ["Paneer 100g", "Salad greens", "Cherry tomatoes", "Olive oil"],
              instructions: "Grill paneer with spices, toss with fresh salad"
            }
          ]
        },
        {
          day_number: 2,
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Poha with Peanuts",
              calories: 320,
              protein: 10,
              carbs: 50,
              fat: 10,
              ingredients: ["Poha 50g", "Peanuts 20g", "Onions", "Green chili"],
              instructions: "Soak poha, sauté with peanuts and onions"
            },
            {
              meal_type: "lunch",
              meal_name: "Rajma Chawal",
              calories: 520,
              protein: 20,
              carbs: 75,
              fat: 10,
              ingredients: ["Kidney beans 100g", "Rice 100g", "Tomato gravy"],
              instructions: "Serve rajma curry with steamed rice"
            },
            {
              meal_type: "dinner",
              meal_name: "Grilled Chicken with Quinoa",
              calories: 450,
              protein: 35,
              carbs: 40,
              fat: 12,
              ingredients: ["Chicken breast 150g", "Quinoa 50g", "Steamed veggies"],
              instructions: "Grill chicken, serve with cooked quinoa"
            }
          ]
        },
        {
          day_number: 3,
          date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Vegetable Sandwich with Chutney",
              calories: 300,
              protein: 12,
              carbs: 45,
              fat: 8,
              ingredients: ["Whole wheat bread 3 slices", "Cucumber", "Tomato", "Green chutney"],
              instructions: "Layer vegetables between bread, serve with chutney"
            },
            {
              meal_type: "lunch",
              meal_name: "Chole with Roti",
              calories: 480,
              protein: 16,
              carbs: 65,
              fat: 14,
              ingredients: ["Chickpeas 100g", "Whole wheat roti 3", "Onion salad"],
              instructions: "Serve chole curry with fresh rotis"
            },
            {
              meal_type: "dinner",
              meal_name: "Palak Paneer with Brown Rice",
              calories: 420,
              protein: 18,
              carbs: 48,
              fat: 16,
              ingredients: ["Paneer 80g", "Spinach 200g", "Brown rice 80g"],
              instructions: "Cook paneer in spinach gravy, serve with rice"
            }
          ]
        },
        {
          day_number: 4,
          date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Idli Sambhar",
              calories: 280,
              protein: 10,
              carbs: 50,
              fat: 4,
              ingredients: ["Idli 3 pieces", "Sambhar 1 cup", "Coconut chutney"],
              instructions: "Steam idlis, serve with hot sambhar"
            },
            {
              meal_type: "lunch",
              meal_name: "Fish Curry with Rice",
              calories: 490,
              protein: 28,
              carbs: 60,
              fat: 12,
              ingredients: ["Fish 150g", "Rice 100g", "Curry sauce", "Vegetables"],
              instructions: "Cook fish in curry, serve with rice"
            },
            {
              meal_type: "dinner",
              meal_name: "Egg Bhurji with Roti",
              calories: 380,
              protein: 24,
              carbs: 35,
              fat: 15,
              ingredients: ["Eggs 3", "Whole wheat roti 2", "Onions", "Tomatoes"],
              instructions: "Scramble eggs with vegetables, serve with roti"
            }
          ]
        },
        {
          day_number: 5,
          date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Besan Chilla",
              calories: 310,
              protein: 14,
              carbs: 40,
              fat: 10,
              ingredients: ["Besan 60g", "Onions", "Tomatoes", "Spices"],
              instructions: "Make pancakes with besan batter"
            },
            {
              meal_type: "lunch",
              meal_name: "Vegetable Biryani",
              calories: 510,
              protein: 12,
              carbs: 78,
              fat: 16,
              ingredients: ["Basmati rice 100g", "Mixed vegetables", "Biryani spices", "Raita"],
              instructions: "Layer rice and vegetables, cook together"
            },
            {
              meal_type: "dinner",
              meal_name: "Tandoori Chicken with Salad",
              calories: 390,
              protein: 32,
              carbs: 20,
              fat: 18,
              ingredients: ["Chicken 180g", "Tandoori masala", "Mixed salad", "Lemon"],
              instructions: "Marinate chicken, grill and serve with salad"
            }
          ]
        },
        {
          day_number: 6,
          date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Masala Dosa",
              calories: 340,
              protein: 10,
              carbs: 58,
              fat: 8,
              ingredients: ["Dosa batter", "Potato filling", "Coconut chutney", "Sambhar"],
              instructions: "Spread batter on pan, add filling, fold and serve"
            },
            {
              meal_type: "lunch",
              meal_name: "Mixed Veg Pulao with Raita",
              calories: 460,
              protein: 14,
              carbs: 72,
              fat: 12,
              ingredients: ["Rice 100g", "Mixed vegetables", "Spices", "Yogurt raita"],
              instructions: "Cook rice with vegetables and spices"
            },
            {
              meal_type: "dinner",
              meal_name: "Tofu Stir Fry",
              calories: 370,
              protein: 20,
              carbs: 35,
              fat: 14,
              ingredients: ["Tofu 150g", "Bell peppers", "Soy sauce", "Garlic"],
              instructions: "Stir fry tofu with vegetables"
            }
          ]
        },
        {
          day_number: 7,
          date: new Date(Date.now() + 6 * 86400000).toISOString().split("T")[0],
          meals: [
            {
              meal_type: "breakfast",
              meal_name: "Upma with Vegetables",
              calories: 300,
              protein: 8,
              carbs: 52,
              fat: 7,
              ingredients: ["Rava 50g", "Mixed vegetables", "Peanuts", "Curry leaves"],
              instructions: "Roast rava, cook with vegetables"
            },
            {
              meal_type: "lunch",
              meal_name: "Aloo Paratha with Curd",
              calories: 490,
              protein: 16,
              carbs: 68,
              fat: 16,
              ingredients: ["Whole wheat flour 80g", "Potatoes 100g", "Curd 100g", "Butter 1 tsp"],
              instructions: "Stuff parathas with spiced potatoes, serve with curd"
            },
            {
              meal_type: "dinner",
              meal_name: "Mushroom Curry with Brown Rice",
              calories: 400,
              protein: 14,
              carbs: 55,
              fat: 12,
              ingredients: ["Mushrooms 150g", "Brown rice 80g", "Tomato-onion gravy"],
              instructions: "Cook mushrooms in curry, serve with rice"
            }
          ]
        }
      ]
    }
  ]
};

// Full 8-week Indian diet plan (generated by expanding week 1)
export const fullIndianDietPlan = {
  weeks: Array.from({ length: 8 }, (_, weekIndex) => ({
    week_number: weekIndex + 1,
    days: minimalDietPlan.weeks[0].days.map((day, dayIndex) => ({
      ...day,
      day_number: dayIndex + 1,
      date: new Date(Date.now() + (weekIndex * 7 + dayIndex) * 86400000).toISOString().split("T")[0]
    }))
  }))
};

// High protein diet template
export const highProteinDietPlan = {
  weeks: [
    {
      week_number: 1,
      days: minimalDietPlan.weeks[0].days.map((day, index) => ({
        day_number: day.day_number,
        date: day.date,
        meals: [
          {
            meal_type: "breakfast",
            meal_name: "Protein Shake with Oats",
            calories: 400,
            protein: 30,
            carbs: 45,
            fat: 10,
            ingredients: ["Whey protein 30g", "Oats 50g", "Banana", "Milk 200ml"],
            instructions: "Blend all ingredients"
          },
          {
            meal_type: "lunch",
            meal_name: "Grilled Chicken with Quinoa",
            calories: 550,
            protein: 45,
            carbs: 50,
            fat: 15,
            ingredients: ["Chicken breast 200g", "Quinoa 80g", "Broccoli", "Olive oil"],
            instructions: "Grill chicken, serve with quinoa and veggies"
          },
          {
            meal_type: "snack",
            meal_name: "Greek Yogurt with Nuts",
            calories: 250,
            protein: 20,
            carbs: 15,
            fat: 12,
            ingredients: ["Greek yogurt 200g", "Almonds 20g", "Honey"],
            instructions: "Mix yogurt with nuts and honey"
          },
          {
            meal_type: "dinner",
            meal_name: "Fish with Sweet Potato",
            calories: 480,
            protein: 40,
            carbs: 40,
            fat: 14,
            ingredients: ["Fish fillet 180g", "Sweet potato 150g", "Green beans"],
            instructions: "Bake fish and sweet potato, steam beans"
          }
        ]
      }))
    }
  ]
};
