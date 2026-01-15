import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log("Razorpay webhook event:", event.event);

    // Handle subscription charged event
    if (event.event === "subscription.charged") {
      const { payload } = event;
      const subscriptionId = payload.subscription.entity.id;
      const customerId = payload.subscription.entity.notes?.user_id;

      if (!customerId) {
        console.error("No user_id in subscription notes");
        return NextResponse.json(
          { error: "Missing user_id" },
          { status: 400 }
        );
      }

      // Create Supabase admin client (using service role key)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Update user's subscription status
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "premium",
          subscription_expires_at: new Date(
            payload.subscription.entity.current_end * 1000
          ).toISOString(),
          razorpay_subscription_id: subscriptionId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);

      if (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }

      console.log(`Subscription activated for user: ${customerId}`);
    }

    // Handle subscription cancelled event
    if (event.event === "subscription.cancelled") {
      const { payload } = event;
      const subscriptionId = payload.subscription.entity.id;

      // Create Supabase admin client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Update user's subscription status
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_subscription_id", subscriptionId);

      if (error) {
        console.error("Error cancelling subscription:", error);
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }

      console.log(`Subscription cancelled: ${subscriptionId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
