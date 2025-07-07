"use server";

import { z } from "zod/v4";
import { extendedReviewSchema } from "../validators";
import { formatErrors } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

// Create and update review
export async function createUpdateReview(
  data: z.infer<typeof extendedReviewSchema>
) {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");

  //Validate and store the review
  const review = extendedReviewSchema.parse(data);
  //Get Product that is being reviewed
  const product = await prisma.product.findFirst({
    where: { id: review.productId },
  });
  if (!product) throw new Error("Product not found");

  //Check if a user already review the product
  const reviewExists = await prisma.review.findFirst({
    where: {
      productId: review.productId,
      userId: review.userId,
    },
  });

  await prisma.$transaction(async (tx) => {
    if (reviewExists) {
      //Update the review
      await tx.review.update({
        where: {
          id: reviewExists.id,
        },
        data: {
          title: review.title,
          description: review.description,
          rating: review.rating,
        },
      });
    } else {
      //Create the review
      await tx.review.create({ data: review });
    }

    //Get avg rating
    const averageRating = await tx.review.aggregate({
      _avg: { rating: true },
      where: { productId: review.productId },
    });

    //Get number of revies
    const numReviews = await tx.review.count({
      where: { productId: review.productId },
    });

    //Update the rating and numRewiews in product table
    await tx.product.update({
      where: { id: review.productId },
      data: {
        rating: averageRating._avg.rating || 0,
        numReviews,
      },
    });
  });
  revalidatePath(`/product/${product.slug}`);
  return { success: true, message: "Review Updated Sucessfully" };
  try {
  } catch (err) {
    return { success: false, message: formatErrors(err) };
  }
}

// Get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId: productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return data;
}

// Get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authenticated");
  return await prisma.review.findFirst({
    where: { productId, userId: session?.user?.id },
  });
}
