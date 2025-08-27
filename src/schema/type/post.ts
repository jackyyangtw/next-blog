import { z } from "zod";
import { AuthorSchema } from "./author";
import { CategorySchema } from "./category";
import { BlockContentSchema } from "./blockContent";

export const PostSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  photo: z.string(),
  description: z.string(),
  author: AuthorSchema,
  categories: z.array(CategorySchema),
  content: BlockContentSchema,
});
export type PostDoc = z.infer<typeof PostSchema>;
