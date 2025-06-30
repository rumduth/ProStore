"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatErrors, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
// Calculuate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    )
  );
  const shippingPrice = round2(itemsPrice < 100 ? 10 : 0);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //Check for the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //Get session and user id
    const session = await auth();
    const userId = session?.user?.id ? session.user.id : undefined;

    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    //Find product in the database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate the product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart.`,
      };
    } else {
      //Check if item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      if (existItem) {
        //check stock
        if (product.stock < existItem.quantity + 1)
          throw new Error("Not enough stock");
        //increase the quantity
        existItem.quantity += 1;

        //
      } else {
        // If item does not exist in cart
        // check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        //Add item to the cart.items
        cart.items.push(item);
      }

      //Save to database
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: { ...cart, ...calcPrice(cart.items) },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: formatErrors(err),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");
  const session = await auth();
  const userId = session?.user?.id ? session.user.id : undefined;

  //Get user cart from the database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;

  //Convert decimals and returns;
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //Get Product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error("Product not found");

    //Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    //Check for item

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    //Check if only one in quantity
    exist.quantity -= 1;
    cart.items = (cart.items as CartItem[]).filter((item) => item.quantity > 0);
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        ...cart,
        ...calcPrice(cart.items),
      },
    });
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} was removed from cart.`,
    };
  } catch (err) {
    return { success: false, message: formatErrors(err) };
  }
}
