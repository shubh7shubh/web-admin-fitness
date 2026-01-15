import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    // Check if service role key is set
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not set!");
      return NextResponse.json(
        { error: "Service role key not configured" },
        { status: 500 }
      );
    }

    // Admin client with service role key (bypasses RLS)
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile query error:", profileError);
    }

    // Get premium assessment status (check for pending or active assessment)
    const { data: assessments, error: assessmentError } = await supabaseAdmin
      .from("premium_assessments")
      .select("status")
      .eq("user_id", userId)
      .in("status", ["pending", "active"])
      .order("status", { ascending: true }) // 'active' comes before 'pending'
      .order("created_at", { ascending: false })
      .limit(1);

    const assessment = assessments && assessments.length > 0 ? assessments[0] : null;

    if (assessmentError) {
      console.error("Assessment query error:", assessmentError);
    }

    // Check for diet plan
    const { data: dietPlan, error: dietError } = await supabaseAdmin
      .from("diet_plans")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (dietError) {
      console.error("Diet plan query error:", dietError);
    }

    // Check for workout plan
    const { data: workoutPlan, error: workoutError } = await supabaseAdmin
      .from("workout_plans")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (workoutError) {
      console.error("Workout plan query error:", workoutError);
    }

    return NextResponse.json({
      userInfo: profile,
      premiumStatus: {
        assessment_status: assessment?.status || null,
        has_diet_plan: !!dietPlan,
        has_workout_plan: !!workoutPlan,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user status:", error);
    return NextResponse.json(
      { error: "Failed to fetch user status", details: error.message },
      { status: 500 }
    );
  }
}
