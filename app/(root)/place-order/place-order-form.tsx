"use client";
import { createOrder } from "@/lib/actions/order.actions";
import { useFormStatus } from "react-dom";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PlaceOrderForm() {
  const router = useRouter();
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) return router.push(res.redirectTo);
  }
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        Place order
      </Button>
    );
  }

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit}>
        <SubmitButton />
      </form>
    </>
  );
}
