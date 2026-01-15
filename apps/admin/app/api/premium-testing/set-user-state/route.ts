import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, targetState } = await req.json();

  if (!userId || !targetState) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    switch (targetState) {
      case "upsell":
        await setToUpsellState(userId);
        break;
      case "needs_assessment":
        await setToNeedsAssessmentState(userId);
        break;
      case "pending":
        await setToPendingState(userId);
        break;
      case "active":
        await setToActiveState(userId);
        break;
      default:
        return NextResponse.json({ error: "Invalid target state" }, { status: 400 });
    }
    return NextResponse.json({ success: true, state: targetState });
  } catch (error: any) {
    console.error("Error setting user state:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete all premium data, set to free tier
async function setToUpsellState(userId: string) {
  await supabaseAdmin.from("diet_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("workout_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("premium_assessments").delete().eq("user_id", userId);

  // Set subscription_tier to 'free'
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "free" })
    .eq("id", userId);
}

// Make premium, delete assessment and plans
async function setToNeedsAssessmentState(userId: string) {
  await supabaseAdmin.from("diet_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("workout_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("premium_assessments").delete().eq("user_id", userId);

  // Set subscription_tier to 'premium' (this is what makes them premium)
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "premium" })
    .eq("id", userId);
}

// Make premium, create pending assessment, delete plans
async function setToPendingState(userId: string) {
  await supabaseAdmin.from("diet_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("workout_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("premium_assessments").delete().eq("user_id", userId);

  // Set subscription_tier to 'premium'
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "premium" })
    .eq("id", userId);

  // Create assessment with pending status (using correct DB fields)
  await supabaseAdmin.from("premium_assessments").insert({
    user_id: userId,
    status: "pending",
    fitness_goals: "Test goals for UI testing",
    activity_level: "moderately_active",
    workout_experience: "intermediate",
    time_availability: "45min",
    // Add required fields with defaults
    primary_workout_goal: "general_fitness",
    cardio_preference: "minimal",
    workout_environment: "commercial_gym",
  });
}

// Make premium, set assessment to active, create sample plans
async function setToActiveState(userId: string) {
  // Delete existing data
  await supabaseAdmin.from("diet_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("workout_plans").delete().eq("user_id", userId);
  await supabaseAdmin.from("premium_assessments").delete().eq("user_id", userId);

  // Set subscription_tier to 'premium'
  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "premium" })
    .eq("id", userId);

  // Create active assessment (using correct DB fields)
  await supabaseAdmin.from("premium_assessments").insert({
    user_id: userId,
    status: "active",
    fitness_goals: "Test goals for UI testing",
    activity_level: "moderately_active",
    workout_experience: "intermediate",
    time_availability: "45min",
    // Add required fields with defaults
    primary_workout_goal: "general_fitness",
    cardio_preference: "minimal",
    workout_environment: "commercial_gym",
  });

  // Create minimal diet plan
  const { minimalDietPlan } = await import("@/lib/templates/dietTemplates");
  await supabaseAdmin.from("diet_plans").insert({
    user_id: userId,
    plan_name: "Test Diet Plan",
    start_date: new Date().toISOString().split("T")[0],
    duration_weeks: 1,
    plan_data: minimalDietPlan,
    is_active: true,
  });

  // Create minimal workout plan (using routine_data field)
  const { minimalWorkoutPlan } = await import("@/lib/templates/workoutTemplates");
  await supabaseAdmin.from("workout_plans").insert({
    user_id: userId,
    plan_name: "Test Workout Plan",
    start_date: new Date().toISOString().split("T")[0],
    duration_weeks: 1,
    routine_data: minimalWorkoutPlan, // Correct field name for workout_plans
    is_active: true,
  });
}
