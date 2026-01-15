import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, planType } = await req.json();

  if (!userId || !planType) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    if (planType === "diet" || planType === "both") {
      await supabaseAdmin.from("diet_plans").delete().eq("user_id", userId);
    }
    if (planType === "workout" || planType === "both") {
      await supabaseAdmin.from("workout_plans").delete().eq("user_id", userId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting plans:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
