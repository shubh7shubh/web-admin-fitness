import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// PUT: Update an assessment question
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Fetch existing question to check if legacy
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("assessment_questions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Prevent changing field_key or field_type on legacy questions
    if (existing.is_legacy) {
      if (body.field_key && body.field_key !== existing.field_key) {
        return NextResponse.json(
          { error: "Cannot change field_key on legacy questions" },
          { status: 400 }
        );
      }
      if (body.field_type && body.field_type !== existing.field_type) {
        return NextResponse.json(
          { error: "Cannot change field_type on legacy questions" },
          { status: 400 }
        );
      }
    }

    // Validate field_key format if being updated
    if (body.field_key && !/^[a-z][a-z0-9_]*$/.test(body.field_key)) {
      return NextResponse.json(
        { error: "field_key must be lowercase snake_case" },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    const allowedFields = [
      "field_key", "label", "section", "field_type", "placeholder",
      "options", "is_required", "max_length", "min_value", "max_value",
      "sort_order", "is_active", "default_value",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data, error } = await supabaseAdmin
      .from("assessment_questions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ question: data });
  } catch (error: any) {
    console.error("Error updating question:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A question with this field_key already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an assessment question
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if legacy
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("assessment_questions")
      .select("is_legacy")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (existing.is_legacy) {
      return NextResponse.json(
        { error: "Cannot delete legacy questions. Deactivate them instead by setting is_active to false." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("assessment_questions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
