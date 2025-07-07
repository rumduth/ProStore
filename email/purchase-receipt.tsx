import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import dotenv from "dotenv";
import { Order } from "@/types";
import PurchaseReceiptEmail from ".";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPurchaseReceipt({ order }: { order: Order }) {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: "rumduth1@gmail.com",
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
}
