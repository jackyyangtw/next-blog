import { z } from "zod";

export const articleFeedbackSchema = z.object({
  postId: z.string().trim().min(1),
  locale: z.string().trim().min(1).max(20),
  feedbackType: z.enum(["helpful", "notHelpful", "suggestion"]),
  message: z.string().trim().min(1, "請填寫你的回饋。 ").max(2000),
  website: z.string().max(0),
});

export type ArticleFeedbackInput = z.infer<typeof articleFeedbackSchema>;
