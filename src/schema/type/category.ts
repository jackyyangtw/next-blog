import { z } from "zod";

export const CategorySchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
});
export type CategoryDoc = z.infer<typeof CategorySchema>;