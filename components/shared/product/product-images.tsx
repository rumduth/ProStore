"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
export default function ProductImages(props: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const images = props.images;

  return (
    <div>
      <div className="space-y-4">
        <Image
          src={images[current]}
          alt="product image"
          width={1000}
          height={1000}
          className="min-h-[300] object-cover object-center"
        />
      </div>
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500"
            )}
          >
            <Image
              src={image}
              alt={`Product Image ${index + 1}`}
              width={100}
              height={100}
              className={`min-h-[75] object-cover object-center`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
