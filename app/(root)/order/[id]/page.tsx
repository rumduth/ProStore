import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";

import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Page",
};
export default async function OrderDetailPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;
  const order = await getOrderById(id);
  const session = await auth();
  if (!order) return notFound();

  let client_secret = null;
  //Check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    //Initialize the Stripe instant
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin"}
      stripeClientSecret={client_secret}
    />
  );
}
