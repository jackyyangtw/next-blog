import { z } from "zod";
import { AuthorSchema } from "./author";
import { CategorySchema } from "./category";
import { BlockContentSchema } from "./blockContent";

const PhotoSchema = z.object({
  asset: z.object({
    _id: z.string(),
    url: z.string(),
    metadata: z.object({
      lqip: z.string().optional(),
    }),
  }),
});

export const PostSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  photo: PhotoSchema,
  description: z.string(),
  author: AuthorSchema,
  categories: z.array(CategorySchema),
  content: BlockContentSchema,
});
export type PostDoc = z.infer<typeof PostSchema>;
