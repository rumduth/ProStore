import { insertProductSchema } from "@/lib/validators";
import { z } from "zod/v4";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
