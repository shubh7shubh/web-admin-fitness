import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: List all assessment questions
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("assessment_questions")
      .select("*")
      .order("section", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ questions: data });
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new assessment question
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      field_key,
      label,
      section,
      field_type,
      placeholder,
      options,
      is_required,
      max_length,
      min_value,
      max_value,
      sort_order,
      default_value,
    } = body;

    if (!field_key || !label || !section || !field_type) {
      return NextResponse.json(
        { error: "Missing required fields: field_key, label, section, field_type" },
        { status: 400 }
      );
    }

    // Validate field_key format (snake_case)
    if (!/^[a-z][a-z0-9_]*$/.test(field_key)) {
      return NextResponse.json(
        { error: "field_key must be lowercase snake_case (e.g., sleep_quality)" },
        { status: 400 }
      );
    }

    // Validate select type has options
    if (field_type === "select" && (!options || !Array.isArray(options) || options.length === 0)) {
      return NextResponse.json(
        { error: "Select fields must have at least one option" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("assessment_questions")
      .insert({
        field_key,
        label,
        section,
        field_type,
        placeholder: placeholder || null,
        options: options || null,
        is_required: is_required || false,
        max_length: max_length || null,
        min_value: min_value || null,
        max_value: max_value || null,
        sort_order: sort_order || 0,
        is_legacy: false,
        default_value: default_value || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ question: data });
  } catch (error: any) {
    console.error("Error creating question:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A question with this field_key already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
