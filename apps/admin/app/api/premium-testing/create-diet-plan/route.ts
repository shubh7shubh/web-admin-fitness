import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, planData } = await req.json();

  if (!userId || !planData) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Step 1: Deactivate any existing active diet plans for this user
  const { error: deactivateError } = await supabaseAdmin
    .from("diet_plans")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("is_active", true);

  if (deactivateError) {
    console.error("Error deactivating existing diet plans:", deactivateError);
    return NextResponse.json({ error: deactivateError.message }, { status: 500 });
  }

  // Step 2: Insert new diet plan with all required fields
  const { error: insertError } = await supabaseAdmin
    .from("diet_plans")
    .insert({
      user_id: userId,
      plan_name: "Test Diet Plan",
      start_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      duration_weeks: 1,
      plan_data: planData,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error("Error creating diet plan:", insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
