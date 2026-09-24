import { z } from "zod";

const articleFeedbackBaseSchema = z.object({
  postId: z.string().trim().min(1).max(200),
  locale: z.string().trim().min(1).max(20),
  website: z.string().max(0),
});

export const articleFeedbackSchema = z.discriminatedUnion("feedbackType", [
  articleFeedbackBaseSchema.extend({
    feedbackType: z.literal("helpful"),
    message: z.literal(""),
  }),
  articleFeedbackBaseSchema.extend({
    feedbackType: z.literal("notHelpful"),
    message: z.literal(""),
  }),
]);

export type ArticleFeedbackInput = z.infer<typeof articleFeedbackSchema>;

export const articleFeedbackFollowUpSchema = z.object({
  submissionId: z.string().trim().min(1).max(128),
  followUpToken: z.string().regex(/^[a-f0-9]{64}$/),
  message: z.string().trim().min(1, "請填寫補充意見。").max(2000),
  website: z.string().max(0),
});
