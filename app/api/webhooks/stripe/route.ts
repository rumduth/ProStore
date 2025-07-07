import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-06-30.basil", // Use the latest API version
});

export async function POST(req: NextRequest) {
  try {
    // Build the webhook event
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Check for successful payment
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update order status
      await updateOrderToPaid({
        orderId: paymentIntent.metadata.orderId,
        paymentResult: {
          id: paymentIntent.id,
          status: "COMPLETED",
          email_address: paymentIntent.receipt_email || "",
          pricePaid: (paymentIntent.amount / 100).toFixed(2),
        },
      });

      return NextResponse.json({
        message: "updateOrderToPaid was successful",
        received: true,
      });
    }

    // Return success for unhandled events (important for Stripe)
    return NextResponse.json({
      message: `Unhandled event type: ${event.type}`,
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
