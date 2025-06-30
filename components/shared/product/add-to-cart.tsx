"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
export default function AddToCart({
  item,
  cart,
}: {
  item: CartItem;
  cart?: Cart;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function handleAddToCart() {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (res.success) {
        toast(res.message, {
          action: (
            <Button
              className="bg-primary hover:bg-gray-800"
              onClick={() => router.push("/cart")}
            >
              Go To Cart
            </Button>
          ),
        });
      } else {
        toast.error(res.message);
      }
    });
  }
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast(res.message, {
          action: (
            <Button
              className="bg-primary hover:bg-gray-800"
              onClick={() => router.push("/cart")}
            >
              Go To Cart
            </Button>
          ),
        });
      } else {
        toast.error(res.message);
      }
    });
  };

  //Check if item is in cart
  const existItem = cart?.items.find((x) => x.productId === item.productId);

  if (existItem)
    return (
      <div>
        <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </Button>
        <span className="px-2">{existItem.quantity}</span>
        <Button type="button" variant="outline" onClick={handleAddToCart}>
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add To Cart
    </Button>
  );
}
