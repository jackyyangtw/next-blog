import { z } from "zod";

export const SUPPORTED_ARTICLE_REVIEW_LOCALES = ["zh-TW", "en"] as const;

export const ARTICLE_REVIEW_CONTENT_MAX_LENGTH = 30_000;

const articleLibrarySchema = z.object({
  name: z.string().trim().min(1).max(100),
  version: z.string().trim().min(1).max(50).optional(),
});

const articleTechnicalContextSchema = z.object({
  libraries: z.array(articleLibrarySchema).max(20).default([]),
});

export const reviewArticleRequestSchema = z.object({
  title: z.string().trim().max(140).default(""),

  description: z.string().trim().max(260).default(""),

  content: z
    .string()
    .trim()
    .min(80, "Article content is required before review.")
    .max(ARTICLE_REVIEW_CONTENT_MAX_LENGTH, "Article content is too large."),

  locale: z.enum(SUPPORTED_ARTICLE_REVIEW_LOCALES).default("zh-TW"),

  categories: z.array(z.string().trim().min(1).max(80)).max(10).default([]),

  technicalContext: articleTechnicalContextSchema.optional(),
});

export type ReviewArticleRequest = z.infer<typeof reviewArticleRequestSchema>;
