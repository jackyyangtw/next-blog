import { z } from "zod";

export const AuthorSchema = z.object({
  _id: z.string(),
  name: z.string(),
  avatar: z.string(),
});
export type AuthorDoc = z.infer<typeof AuthorSchema>;