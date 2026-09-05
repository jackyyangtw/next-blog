import { z } from "zod";
import { AuthorSchema } from "./author";
import { CategorySchema } from "./category";
import { BlockContentSchema } from "./blockContent";

const PhotoSchema = z.object({
  asset: z.object({
    _id: z
      .string()
      .nullish()
      .transform((value) => value ?? undefined),
    url: z
      .string()
      .nullish()
      .transform((value) => value ?? undefined),
    metadata: z
      .object({
        lqip: z
          .string()
          .nullish()
          .transform((value) => value ?? undefined),
      })
      .optional(),
  }),
  alt: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
});

export const PostSummarySchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  title: z.string(),
  slug: z.string(),
  bannerSource: z
    .enum(["upload", "preset"])
    .nullish()
    .transform((value) => value ?? undefined),
  presetBanner: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  photo: PhotoSchema.nullish(),
  description: z.string(),
  author: AuthorSchema,
  categories: z.array(CategorySchema),
});
export const PostSchema = PostSummarySchema.extend({
  content: BlockContentSchema,
});
export const PostsResponseSchema = z.object({
  data: z.array(PostSummarySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(50),
});
export type PostSummary = z.infer<typeof PostSummarySchema>;
export type PostsResponse = z.infer<typeof PostsResponseSchema>;
export type PostDoc = z.infer<typeof PostSchema>;
