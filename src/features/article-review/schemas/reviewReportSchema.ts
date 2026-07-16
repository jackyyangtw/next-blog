import { z } from "zod";

export const reviewIssueSchema = z.object({
  severity: z.enum(["low", "medium", "high"]),
  category: z.enum(["readability", "seo", "code", "technical", "content"]),
  title: z.string().trim().min(4).max(100),
  suggestion: z.string().trim().min(12).max(500),
});

export const reviewReportSchema = z.object({
  summary: z.string().trim().min(20).max(500),
  overallScore: z.number().min(0).max(10),
  score: z.object({
    readability: z.number().min(0).max(10),
    technicalAccuracy: z.number().min(0).max(10),
    completeness: z.number().min(0).max(10),
    seo: z.number().min(0).max(10),
  }),
  issues: z.array(reviewIssueSchema).max(12),
});

export type ReviewIssue = z.infer<typeof reviewIssueSchema>;
export type ReviewReport = z.infer<typeof reviewReportSchema>;
