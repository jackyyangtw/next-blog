import { z } from "zod";
import { PostSchema } from "./post";

export const BookmarkSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  post: PostSchema,
});
export type BookmarkDoc = z.infer<typeof BookmarkSchema>;