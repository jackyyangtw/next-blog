import { z } from "zod";
import { PostSummarySchema } from "./post";

export const BookmarkSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  post: PostSummarySchema.nullable(),
});
export const BookmarkInputSchema = z.object({
  postId: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid published post ID"),
});
export const BookmarkMutationResponseSchema = z.object({
  postId: z.string(),
  bookmarked: z.boolean(),
});
export type BookmarkDoc = z.infer<typeof BookmarkSchema>;
export type BookmarkMutationResponse = z.infer<
  typeof BookmarkMutationResponseSchema
>;
