import { z } from "zod";

const articleFeedbackBaseSchema = z.object({
  postId: z.string().trim().min(1),
  locale: z.string().trim().min(1).max(20),
  website: z.string().max(0),
});

export const articleFeedbackSchema = z.discriminatedUnion("feedbackType", [
  articleFeedbackBaseSchema.extend({
    feedbackType: z.literal("helpful"),
    message: z.string().trim().max(2000),
  }),
  articleFeedbackBaseSchema.extend({
    feedbackType: z.literal("notHelpful"),
    message: z.string().trim().max(2000),
  }),
  articleFeedbackBaseSchema.extend({
    feedbackType: z.literal("suggestion"),
    message: z.string().trim().min(1, "請填寫你的建議。").max(2000),
  }),
]);

export type ArticleFeedbackInput = z.infer<typeof articleFeedbackSchema>;
