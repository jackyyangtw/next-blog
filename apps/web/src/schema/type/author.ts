import { z } from "zod";

export const AuthorSchema = z.object({
  _id: z.string(),
  name: z.string(),
  avatar: z
    .union([
      z.string(),
      z
        .object({
          _type: z.literal("image").optional(),
          asset: z.object({
            _ref: z.string(),
            _type: z.literal("reference").optional(),
          }),
        })
        .passthrough(),
    ])
    .nullish(),
});
export type AuthorDoc = z.infer<typeof AuthorSchema>;
