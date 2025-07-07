"use client";

import { Review } from "@/types";
import Link from "next/link";
import ReviewForm from "./review-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, UserIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/rating";

export default function ReviewsList({
  userId,
  productId,
  productSlug,
  reviews,
  userReview,
}: {
  userId: string;
  productId: string;
  productSlug: string;
  reviews: Review[];
  userReview: Review | null;
}) {
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <>
          <ReviewForm
            userId={userId}
            productId={productId}
            userReview={userReview}
          />
        </>
      ) : (
        <div>
          Please
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center gap-1 text-sm leading-none">
                  <UserIcon className="w-4 h-4" />
                  {review.user?.name || "User"}
                </div>
                <div className="flex items-center gap-1 text-sm leading-none">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
