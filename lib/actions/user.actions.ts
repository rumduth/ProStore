"use server";

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/prisma/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { formatErrors } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod/v4";
// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", user);
    return { success: true, message: "Sign in succesfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      email: formData.get("email"),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: { name: user.name, email: user.email, password: user.password },
    });

    await signIn("credentials", { email: user.email, password: plainPassword });
    return {
      success: true,
      message: "User registered succesfully",
    };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// Get user by the id
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) throw new Error("User not found!");
  return user;
}

// Update the user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error("Usr not found.");
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });
    return { success: true, message: "User updated succesfully" };
  } catch (err) {
    return {
      success: false,
      message: formatErrors(err),
    };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error("User not found");
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });
    return { success: true, message: "User updated succesfully" };
  } catch (err) {
    return { success: false, message: formatErrors(err) };
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });
    return { success: true, message: "User updated succesfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}
