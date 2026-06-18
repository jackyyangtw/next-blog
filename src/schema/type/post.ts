import { z } from "zod";
import { AuthorSchema } from "./author";
import { CategorySchema } from "./category";
import { BlockContentSchema } from "./blockContent";

const PhotoSchema = z.object({
  asset: z.object({
    _id: z.string().optional(),
    url: z.string().optional(),
    metadata: z
      .object({
        lqip: z.string().optional(),
      })
      .optional(),
  }),
  alt: z.string().optional(),
});

export const PostSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  bannerSource: z.enum(["upload", "preset"]).optional(),
  presetBanner: z.string().optional(),
  photo: PhotoSchema.nullish(),
  description: z.string(),
  author: AuthorSchema,
  categories: z.array(CategorySchema),
  content: BlockContentSchema,
});
export type PostDoc = z.infer<typeof PostSchema>;
